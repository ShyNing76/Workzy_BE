import db from "../../models";
import { Op } from "sequelize";
import moment from "moment";
import { v4 } from "uuid";
import { hashPassword } from "../../utils/hashPassword";
import {
    handleLimit,
    handleOffset,
    handleSortOrder,
} from "../../utils/handleFilter";

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

export const getAllStaffService = ({page, limit, order, name, building_id, status, ...query}) => new Promise(async (resolve, reject) => {
    try {
        query.status = status ? status : {[Op.ne]: null};
        query.role_id = 3;
        const staffs = await db.User.findAndCountAll({
            where: query,
            offset: handleOffset(page, limit),
            limit: handleLimit(limit),
            order: [handleSortOrder(order, "name")],
            attributes: {
                exclude: ["password","google_token","building_id","createdAt", "updatedAt"]
            },
            include: [
                {
                    model: db.Staff,
                    attributes: ["staff_id", "building_id"],
                    where: {
                        building_id: building_id ? building_id === "null" ? {[Op.is]: null} : building_id : {[Op.or]: [null, {[Op.ne]: null}]}
                    },
                    required: true,
                    include: [
                        {
                            model: db.Building,
                            attributes: ["building_name"],
                        },
                    ]
                }, 
            ],
            raw: true,
            nest: true
        });
        staffs.rows.forEach(staff => {
            if (staff.date_of_birth) {
                staff.date_of_birth = moment(staff.date_of_birth).format('MM/DD/YYYY');
            }
        });
        resolve({
            err: staffs.count > 0 ? 0 : 1,
            message: staffs.count > 0 ? "Got" : "No Staff Exist",
            data: staffs
        });
    } catch (error) {
        console.log(error)
        reject(error)
    }
})

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
                        attributes: ["staff_id", "building_id"],
                        required: true,
                        include: [
                            {
                                model: db.Building,
                                attributes: ["building_name"],
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

export const getBuildingByStaffIdService = (tokenUser) => new Promise(async (resolve, reject) => {
    try {
        const staff = await db.Staff.findOne({
            where: {
                user_id: tokenUser.user_id,
            },
            attributes: [],
            include: [
                {
                    model: db.Building,
                    attributes: ["building_id"],
                    required: true,
                }
            ],
            raw: true,
            nest: true
        });
        if(!staff) return reject("No Building Exist")
        resolve({
            err: 0,
            message: "Got",
            data: staff.Building
        });
    } catch (error) {
        reject(error)
    }
})

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
        const t = await db.sequelize.transaction();
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
                },
                { transaction: t }
            );
            if (updatedRowsCount === 0) return reject("No Staff Exist");
            const removeBuilding = await db.Staff.update({
                building_id: null
            }, {
                where: { user_id: id },
                transaction: t
            })
            if(!removeBuilding) return reject("Failed to remove building")
            await t.commit();
            resolve({
                err: 0,
                message: "Staff deleted",
            });
        } catch (error) {
            console.log(error);
            await t.rollback();
            reject(error);
        }
    });

export const assignStaffToBuildingService = (id, building_id) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const [staff, isBuildingExist] =
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
                    
                ]);
            if (!staff || staff.status == "inactive")
                return reject("Staff is not exist");
            if (!isBuildingExist) return reject("Building is not exist");

            if (staff.Staff.building_id === building_id) return reject("Staff is already assigned to this building");

            if(staff.Staff.building_id) return reject("Building already has a staff")
            
            const oldStaffOfBuilding = await db.Staff.update({
                    building_id: null
                }, {
                    where: { building_id: building_id },
                    transaction: t
                });
            if (!oldStaffOfBuilding) return reject("Failed to remove old staff of building")
            staff.Staff.building_id = building_id;
            await staff.Staff.save({ transaction: t });
            await t.commit();
            resolve({
                err: 0,
                message: "Staff updated successfully!",
            });
        } catch (error) {
            await t.rollback();
            reject(error);
        }
    });

export const removeStaffFromBuildingService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const removedStaff = await db.Staff.update({
                building_id: null
            }, {
                where: { user_id: id , building_id: {[Op.ne]: null}},
            })
            if (removedStaff[0] === 0) return reject("Failed to remove staff from building || Staff is not assigned to any building")
            resolve({
                err: 0,
                message: "Staff removed from building successfully"
            })
        } catch (error) {
            console.log(error)
            reject(error);
        }
    })

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

            if (bookingStatus.count === 0) return reject("No bookings found for the specified workspace");

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

export const changeBookingStatusService = (bookingId, status) => new Promise(async (resolve, reject) => {
    try {
        const bookingStatus = await db.BookingStatus.findOne({
            where: {
                booking_id: bookingId
            },
            order: [["createdAt", "DESC"]],
            limit: 1,
            raw: true,
            nest: true
        })
       
        if (!bookingStatus) return reject("Booking not found")

        let statusTransitions = {
            "paid": "in-process",
            "in-process": "check-out",
            "check-out": "check-amenities",
            "check-amenities": "completed"
        };

        let changeStatus;
        if (statusTransitions[bookingStatus.status] === status) {
            changeStatus = await db.BookingStatus.create({
                booking_status_id: v4(),
                booking_id: bookingId,
                status: statusTransitions[bookingStatus.status]
            });
        }

        if(!changeStatus) return reject("Failed to update booking status")

        resolve({
            err: 0,
            message: "Booking status updated successfully"
        })
    } catch (error) {
        console.log(error)
        reject(error)
    }
})
