import moment from "moment";
import { Op } from "sequelize";
import { v4 } from "uuid";
import db from "../../models";
import { sendMail } from "../../utils/sendMail/index.js";
import {
    handleLimit,
    handleOffset,
    handleSortOrder,
} from "../../utils/handleFilter";
import { hashPassword } from "../../utils/hashPassword";

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

export const getBookingTypeService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const bookingType = await db.BookingType.findOne({
                where: {
                    booking_type_id: id,
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                raw: true,
                nest: true,
            });
            if (!bookingType) return reject("Booking type not found");
            resolve({
                err: 0,
                message: "Booking type found",
                data: bookingType,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getAllStaffService = ({
    page,
    limit,
    order,
    name,
    building_id,
    status,
    ...query
}) =>
    new Promise(async (resolve, reject) => {
        try {
            query.status = status ? status : { [Op.ne]: null };
            query.role_id = 3;
            const staffs = await db.User.findAndCountAll({
                where: query,
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
                        attributes: ["staff_id", "building_id"],
                        where: {
                            building_id: building_id
                                ? building_id === "null"
                                    ? { [Op.is]: null }
                                    : building_id
                                : { [Op.or]: [null, { [Op.ne]: null }] },
                        },
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
            staffs.rows.forEach((staff) => {
                if (staff.date_of_birth) {
                    staff.date_of_birth = moment(staff.date_of_birth).format(
                        "MM/DD/YYYY"
                    );
                }
            });
            if (!staffs) return reject("No Staff Exist");
            resolve({
                err: 0,
                message: "Got",
                data: staffs,
            });
        } catch (error) {
            console.log(error);
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

export const getBuildingByStaffIdService = (tokenUser) =>
    new Promise(async (resolve, reject) => {
        try {
            const staff = await db.Staff.findOne({
                where: {
                    user_id: tokenUser.user_id,
                },
                attributes: [],
                include: [
                    {
                        model: db.Building,
                        required: true,
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!staff) return reject("No Building Exist");
            resolve({
                err: 0,
                message: "Got",
                data: staff.Building,
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

export const unactiveStaffService = (id) =>
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
            const removeBuilding = await db.Staff.update(
                {
                    building_id: null,
                },
                {
                    where: { user_id: id },
                    transaction: t,
                }
            );
            if (!removeBuilding) return reject("Failed to remove building");
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

export const activeStaffService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const staff = await db.User.update(
                {
                    status: "active",
                },
                {
                    where: {
                        user_id: id,
                        role_id: 3,
                        status: "inactive",
                    },
                }
            );
            if (!staff) return reject("Staff not found");
            resolve({
                err: 0,
                message: "Staff active successfully",
            });
        } catch (error) {
            reject(error);
        }
    });

export const assignStaffToBuildingService = (id, building_id) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const [staff, isBuildingExist] = await Promise.all([
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
                                exclude: ["user_id", "createdAt", "updatedAt"],
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

            if (staff.Staff.building_id === building_id)
                return reject("Staff is already assigned to this building");

            if (staff.Staff.building_id)
                return reject("Building already has a staff");

            const oldStaffOfBuilding = await db.Staff.update(
                {
                    building_id: null,
                },
                {
                    where: { building_id: building_id },
                    transaction: t,
                }
            );
            if (!oldStaffOfBuilding)
                return reject("Failed to remove old staff of building");
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
            const removedStaff = await db.Staff.update(
                {
                    building_id: null,
                },
                {
                    where: { user_id: id, building_id: { [Op.ne]: null } },
                }
            );
            if (removedStaff[0] === 0)
                return reject(
                    "Failed to remove staff from building || Staff is not assigned to any building"
                );
            resolve({
                err: 0,
                message: "Staff removed from building successfully",
            });
        } catch (error) {
            console.log(error);
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

            if (bookingStatus.count === 0)
                return reject("No bookings found for the specified workspace");

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

export const changeBookingStatusService = (booking_id, status) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const bookingStatus = await db.BookingStatus.findOne({
                where: {
                    booking_id: booking_id,
                },
                order: [["createdAt", "DESC"]],
                limit: 1,
                raw: true,
                nest: true,
            });
            if (!bookingStatus) return reject("Booking not found");
            const booking = await db.Booking.findOne({
                where: {
                    booking_id: booking_id,
                },
                include: [
                    {
                        model: db.Customer,
                        attributes: ["point"],
                        required: true,
                        include: [
                            {
                                model: db.User,
                                attributes: ["email", "name"],
                                required: true,
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!booking) return reject("User not found");
            let statusTransitions = {
                paid: "usage",
                "check-in": "usage",
                "check-out": "check-amenities",
                "check-amenities": "completed",
            };
            let changeStatus;
            if (statusTransitions[bookingStatus.status] === status) {
                const statusesToCreate =
                    bookingStatus.status === "paid"
                        ? ["check-in", "usage"]
                        : [statusTransitions[bookingStatus.status]];
                for (const statusToCreate of statusesToCreate) {
                    changeStatus = await db.BookingStatus.create(
                        {
                            booking_status_id: v4(),
                            booking_id: booking_id,
                            status: statusToCreate,
                        },
                        { transaction: t }
                    );
                }

                if (statusTransitions[bookingStatus.status] === "completed") {
                    const updatedPoints = await db.Customer.update(
                        {
                            point:
                                parseInt(booking.Customer.point) +
                                Math.ceil(parseInt(booking.total_price) / 1000),
                        },
                        {
                            where: {
                                customer_id: booking.customer_id,
                            },
                            transaction: t,
                        }
                    );
                    if (updatedPoints[0] === 0)
                        return reject("Failed to update customer points");
                }

                await sendMail(
                    booking.Customer.User.email,
                    "Booking Status Updated",
                    "Your booking status has been updated to <b>" +
                        statusesToCreate[statusesToCreate.length - 1] +
                        "</b>"
                );
            }
            if (!changeStatus) return reject("Failed to update booking status");
            await t.commit();
            resolve({
                err: 0,
                message: "Booking status updated successfully",
            });
        } catch (error) {
            await t.rollback();
            console.log(error);
            reject(error);
        }
    });

export const getAmenitiesByBookingIdService = (booking_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const [booking, amenitiesOfBooking] = await Promise.all([
                db.Booking.findOne({
                    where: {
                        booking_id: booking_id,
                    },
                    include: [
                        {
                            model: db.Workspace,
                            attributes: ["workspace_id"],
                            required: true,
                        },
                        {
                            model: db.Customer,
                            attributes: [],
                            required: true,
                            include: {
                                model: db.User,
                                attributes: ["email", "name"],
                                required: true,
                            },
                        },
                        {
                            model: db.BookingStatus,
                            attributes: ["status"],
                            order: [["createdAt", "DESC"]],
                            limit: 1,
                            required: true,
                        },
                    ],
                }),
                db.BookingAmenities.findAll({
                    where: {
                        booking_id: booking_id,
                    },
                    attributes: ["quantity"],
                    include: [
                        {
                            model: db.Amenity,
                            attributes: ["amenity_name"],
                            required: true,
                        },
                    ],
                    raw: true,
                    nest: true,
                }),
            ]);

            if (!booking) return reject("Booking not found");
            if (booking.BookingStatuses[0].status !== "check-amenities")
                return reject("Booking status is not check-amenities");
            if (booking.BookingStatuses[0].status === "cancelled")
                return reject("Booking status is cancelled");
            if (amenitiesOfBooking.length === 0)
                return reject("No amenities found for the specified booking");
            console.log(amenitiesOfBooking);
            const amenitiesWorkspace = await db.AmenitiesWorkspace.findAll({
                where: {
                    workspace_id: booking.Workspace.workspace_id,
                },
                attributes: ["quantity"],
                include: [
                    {
                        model: db.Amenity,
                        attributes: ["amenity_name"],
                        required: true,
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!amenitiesWorkspace)
                return reject("No amenities found for the specified workspace");

            const amenitiesOfBookingList = amenitiesOfBooking.map((amenity) => {
                return {
                    amenity_name: amenity.Amenity.amenity_name,
                    quantity: amenity.quantity,
                };
            });
            const amenitiesWorkspaceList = amenitiesWorkspace.map((amenity) => {
                return {
                    amenity_name: amenity.Amenities.amenity_name,
                    quantity: amenity.quantity,
                };
            });
            const countMap = {};
            [...amenitiesOfBookingList, ...amenitiesWorkspaceList].forEach(
                (amenity) => {
                    countMap[amenity.amenity_name] =
                        (countMap[amenity.amenity_name] || 0) +
                        amenity.quantity;
                }
            );
            const uniqueAmenitiesWithQuantity = Object.keys(countMap).map(
                (amenityName) => {
                    return {
                        amenity_name: amenityName,
                        quantity: countMap[amenityName],
                    };
                }
            );
            console.log(uniqueAmenitiesWithQuantity);
            if (uniqueAmenitiesWithQuantity.length === 0)
                return reject("No amenities found for the specified booking");
            resolve({
                err: 0,
                message: "Get amenities successfully",
                data: { uniqueAmenitiesWithQuantity, booking_id },
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

export const createBrokenAmenitiesBookingService = (
    amenities_quantities,
    booking_id
) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const amenitiesName = amenities_quantities.map((amenity) => {
                return amenity.amenity_name;
            });
            const amenities = await db.Amenity.findAll({
                where: {
                    amenity_name: { [Op.in]: amenitiesName },
                    status: "active",
                },
                attributes: [
                    "amenity_id",
                    "depreciation_price",
                    "amenity_name",
                ],
                raw: true,
                nest: true,
            });
            // Check if all amenities are exists in db or not
            const availableAmenities = amenities.map((amenity) => amenity.amenity_name);
            const notAvailableAmenities = amenitiesName.filter((amenity) => !availableAmenities.includes(amenity));
            if (notAvailableAmenities.length > 0) return reject(`Amenities ${notAvailableAmenities.join(', ')} not found`);
            if (amenities.length === 0) return reject("Amenities not found");

            const booking = await db.Booking.findOne({
                where: {
                    booking_id: booking_id,
                },
                include: [
                    {
                        model: db.BookingStatus,
                        attributes: ["status"],
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                        required: true,
                    },
                ],
            });
            if (!booking) return reject("Booking not found");
            if (booking.BookingStatuses[0].status !== "check-amenities")
                return reject("Booking status is not check-amenities");
            if (booking.BookingStatuses[0].status === "cancelled")
                return reject("Booking status is cancelled");

            const quantitiesMap = {};
            const quantities = amenities_quantities.map((amenity) => {
                quantitiesMap[amenity.amenity_name] = amenity.quantity;
            });

            const total_broken_price = amenities.reduce((total, amenity) => {
                return parseInt(total) + parseInt(amenity.depreciation_price) * parseInt(quantitiesMap[amenity.amenity_name]);
            }, 0);
            const amenitiesData = amenities
                .map(
                    (amenity) =>
                        `${amenity.amenity_name}: ${quantitiesMap[amenity.amenity_name]}: ${amenity.depreciation_price}`
                )
                .join("|");

            booking.total_price =
                parseInt(total_broken_price) +
                parseInt(
                    booking.total_workspace_price +
                        booking.total_amenities_price
                );
            booking.total_broken_price = total_broken_price;
            booking.report_damage_ameninites = amenitiesData;
            await booking.save({ transaction: t });

            await db.BookingStatus.create(
                {
                    booking_status_id: v4(),
                    booking_id: booking_id,
                    status: "damaged-payment",
                },
                { transaction: t }
            );
            await t.commit();
            resolve({
                err: 0,
                message: "Broken amenities created successfully",
            });
        } catch (error) {
            console.log(error);
            await t.rollback();
            reject(error);
        }
    });
