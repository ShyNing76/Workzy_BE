import db from "../../models";
import { Op, or } from "sequelize";
import moment from "moment";
import { v4 } from "uuid";
import { hashPassword } from "../../utils/hashPassword";
import {
    handleLimit,
    handleOffset,
    handleSortOrder,
} from "../../utils/handleFilter";
import { raw } from "body-parser";

export const createStaffService = ({ password, ...data }) =>
    new Promise(async (resolve, reject) => {
        try {
            const isDuplicated = await db.User.findOne({
                where: {
                    [Op.or]: [
                        {
                            email: data.email,
                        },
                        {
                            phone: data.phone,
                        },
                    ],
                },
                raw: true,
            });

            if (isDuplicated) {
                const field =
                    isDuplicated.email === data.email ? "Email" : "Phone";
                return reject(`${field} is already used`);
            }

            const staff = await db.User.create(
                {
                    user_id: v4(),
                    password: hashPassword(password),
                    ...data,
                    role_id: 3,
                    Staff: {
                        staff_id: v4(),
                    },
                },
                {
                    include: [{ model: db.Staff }],
                    raw: true,
                    nest: true,
                }
            );

            resolve({
                err: 0,
                message: "Staff created successfully",
                data: {
                    user_id: staff.user_id,
                    email: staff.email,
                    name: staff.name,
                    phone: staff.phone,
                    date_of_birth: moment(staff.date_of_birth).format(
                        "MM/DD/YYYY"
                    ),
                    role_id: staff.role_id,
                    staff_id: staff.Staff.staff_id,
                },
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllStaffService = ({ page, limit, order, name, ...query }) =>
    new Promise(async (resolve, reject) => {
        try {
            const staffs = await db.User.findAndCountAll({
                where: {
                    role_id: 3,
                    ...query,
                },
                offset: handleOffset(page, limit),
                limit: handleLimit(limit),
                order: [handleSortOrder(order, "name")],
                attributes: {
                    exclude: [
                        "password",
                        "google_token",
                        "building_id",
                        "createdAt",
                        "updatedAt",
                    ],
                },
                include: [
                    {
                        model: db.Staff,
                        attributes: ["staff_id"],
                        include: [
                            {
                                model: db.Building,
                                attributes: ["building_id"],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            staffs.rows.forEach((staff) => {
                if (staff.date_of_birth) {
                    staff.date_of_birth = moment(staff.date_of_birth).format(
                        "MM/DD/YYYY"
                    );
                }
            });
            resolve({
                err: staffs.count > 0 ? 0 : 1,
                message: staffs.count > 0 ? "Got" : "No Staff Exist",
                data: staffs,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getStaffByIdService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const staff = await db.User.findOne({
                where: {
                    user_id: id,
                    role_id: 3,
                },
                attributes: {
                    exclude: [
                        "password",
                        "google_token",
                        "createdAt",
                        "updatedAt",
                    ],
                },
                include: [
                    {
                        model: db.Staff,
                        attributes: ["staff_id"],
                        include: [
                            {
                                model: db.Building,
                                attributes: ["building_id"],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!staff) return reject("No Staff Exist");
            staff.date_of_birth = moment(staff.date_of_birth).format(
                "MM/DD/YYYY"
            );
            resolve({
                err: 0,
                message: "Got",
                data: staff,
            });
        } catch (error) {
            reject(error);
        }
    });

export const updateStaffService = (id, data) =>
    new Promise(async (resolve, reject) => {
        try {
            const isDuplicated = await db.User.findOne({
                where: {
                    [Op.or]: [
                        {
                            email: data.email,
                        },
                        {
                            phone: data.phone,
                        },
                    ],
                    user_id: { [Op.ne]: id },
                },
                raw: true,
            });

            if (isDuplicated) {
                const field =
                    isDuplicated.email === data.email ? "Email" : "Phone";
                return reject(`${field} is already used`);
            }
            if (data.password) data.password = hashPassword(data.password);
            const staff = await db.User.update(
                {
                    ...data,
                },
                {
                    where: {
                        user_id: id,
                        role_id: 3,
                    },
                    raw: true,
                    nest: true,
                }
            );
            if (!staff) return reject("Staff not found");
            resolve({
                err: 0,
                message: "Update Successfully",
            });
        } catch (error) {
            console.log(error.message);
            reject(error);
        }
    });

export const deleteStaffService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const [updatedRowsCount] = await db.User.update(
                {
                    status: "inactive",
                },
                {
                    where: {
                        user_id: id,
                        role_id: 3,
                        status: "active",
                    },
                }
            );
            if (updatedRowsCount === 0) return reject("No Staff Exist");
            resolve({
                err: 0,
                message: "Staff deleted",
            });
        } catch (error) {
            reject(error);
        }
    });

export const assignStaffToBuildingService = (id, building_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const [staff, isBuildingExist, isStaffAlreadyAssigned] =
                await Promise.all([
                    db.User.findOne({
                        where: {
                            user_id: id,
                            role_id: 3,
                            status: "active",
                        },
                        include: [
                            {
                                model: db.Staff,
                                attributes: {
                                    exclude: [
                                        "user_id",
                                        "createdAt",
                                        "updatedAt",
                                    ],
                                },
                                required: true,
                            },
                        ],
                    }),
                    db.Building.findOne({
                        where: {
                            building_id: building_id,
                        },
                    }),
                    db.Staff.findOne({
                        where: {
                            building_id: building_id,
                        },
                    }),
                ]);
            if (!staff || staff.status == "inactive")
                return reject("Staff is not exist");
            if (!isBuildingExist) return reject("Building is not exist");
            if (isStaffAlreadyAssigned)
                return reject("Staff is already assigned to this building");

            staff.Staff.building_id = building_id;
            await staff.Staff.save();
            resolve({
                err: 0,
                message: "Staff updated successfully!",
            });
        } catch (error) {
            reject(error);
        }
    });

export const getBookingStatusService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const bookingStatus = await db.Booking.findAndCountAll({
                where: {
                    workspace_id: id,
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                include: [
                    {
                        model: db.BookingStatus,
                        attributes: ["status"],
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                    },
                ],
            });

            if (!bookingStatus) return reject("Workspace cannot have booking");

            const formattedBookingStatus = bookingStatus.rows.map((booking) => {
                return {
                    ...booking.dataValues,
                    start_time_date: moment(booking.start_time_date).format(
                        "MM/DD/YYYY HH:mm"
                    ),
                    end_time_date: moment(booking.end_time_date).format(
                        "MM/DD/YYYY HH:mm"
                    ),
                };
            });

            resolve({
                err: 0,
                message: "Get booking status successfully",
                data: formattedBookingStatus,
            });
        } catch (error) {
            reject(error);
        }
    });
