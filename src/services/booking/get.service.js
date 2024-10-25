import { google } from "googleapis";
import moment from "moment";
import { oauth2Client } from "../../config/passport";
import db from "../../models";
import { v4 as uuidv4 } from "uuid";
import {
    handleLimit,
    handleOffset,
    handleSortOrder,
} from "../../utils/handleFilter";

export const getBookingService = ({ page, limit, order, status, ...data }) =>
    new Promise(async (resolve, reject) => {
        try {
            const customer = await db.Customer.findOne({
                where: {
                    user_id: data.user_id,
                },
            });

            if (!customer) return reject("Customer not found");

            const tabStatus = {
                All: [
                    "check-in",
                    "usage",
                    "check-out",
                    "check-amenities",
                    "paid",
                    "confirmed",
                    "completed",
                    "cancelled",
                ],
                Current: ["check-in", "usage", "check-out", "check-amenities"],
                Upcoming: ["paid", "confirmed"],
                Completed: ["completed"],
                Cancelled: ["cancelled"],
            };

            const statusCount = {
                All: 0,
                Current: 0,
                Upcoming: 0,
                Completed: 0,
                Cancelled: 0,
            };

            const bookings = await db.Booking.findAndCountAll({
                where: {
                    customer_id: customer.customer_id,
                },
                include: [
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        limit: 1,
                        order: [["createdAt", "DESC"]],
                        attributes: { exclude: ["booking_id"] },
                        required: true,
                        right: true,
                    },
                ],
                order: [handleSortOrder(order, "created_at")],
                distinct: true,
                subquery: false,
            });

            if (bookings && bookings.count === 0)
                return reject("No bookings found");

            bookings.rows.forEach((booking) => {
                const status = booking.BookingStatuses[0].status;
                if (tabStatus.All.includes(status)) statusCount.All += 1;
                if (tabStatus.Current.includes(status))
                    statusCount.Current += 1;
                if (tabStatus.Upcoming.includes(status))
                    statusCount.Upcoming += 1;
                if (tabStatus.Completed.includes(status))
                    statusCount.Completed += 1;
                if (tabStatus.Cancelled.includes(status))
                    statusCount.Cancelled += 1;
            });

            status = status || "All";

            const filteredBookings = bookings.rows.filter((booking) => {
                if (status === "All") return true;
                return tabStatus[status].includes(
                    booking.BookingStatuses[0].status
                );
            });

            const paginatedBookings = filteredBookings.slice(
                handleOffset(page, limit),
                handleOffset(page, limit) + handleLimit(limit)
            );

            return resolve({
                err: 0,
                message: "Bookings found",
                data: {
                    statusCount,
                    bookings: paginatedBookings,
                },
            });
        } catch (error) {
            console.error(error);
            return reject(error);
        }
    });

export const getAllBookingsService = ({
    page,
    limit,
    order,
    status,
    building_id,
    ...data
}) =>
    new Promise(async (resolve, reject) => {
        try {
            const bookings = await db.Booking.findAndCountAll({
                where: { ...data },
                include: [
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                        attributes: {
                            exclude: ["booking_id", "createdAt", "updatedAt"],
                        },
                        required: false,
                    },
                    {
                        model: db.Workspace,
                        as: "Workspace",
                        where: building_id ? { building_id } : {},
                        attributes: ["workspace_name", "workspace_type_id", "building_id"],
                    },
                    {
                        model: db.Customer,
                        as: "Customer",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        include: {
                            model: db.User,
                            as: "User",
                            attributes: ["name", "email"],
                        },
                    },
                    {
                        model: db.Amenity,
                        as: "Amenities",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    },
                ],
                order: [handleSortOrder(order, "start_time_date")],
                limit: handleLimit(limit),
                offset: handleOffset(page, limit),
                attributes: { exclude: ["createdAt", "updatedAt"] },
                subquery: false,
            });

            if (!bookings || bookings.count === 0)
                return reject("No bookings found");

            return resolve({
                err: 0,
                message: "Bookings found",
                data: bookings,
            });
        } catch (error) {
            console.error(error);
            return reject(error);
        }
    });

export const getBookingByIdService = ({ booking_id, user_id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const customer = await db.Customer.findOne({
                where: {
                    user_id: user_id,
                },
            });

            if (!customer) return reject("Customer not found");

            const booking = await db.Booking.findOne({
                where: {
                    booking_id: booking_id,
                    customer_id: customer.customer_id,
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                include: [
                    {
                        model: db.Workspace,
                        as: "Workspace",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "workspace_id",
                                "workspace_type_id",
                                "building_id",
                            ],
                        },
                    },
                    {
                        model: db.BookingType,
                        as: "BookingType",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "booking_type_id",
                            ],
                        },
                    },
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        attributes: {
                            exclude: ["booking_status_id", "booking_id"],
                        },
                    },
                ],
            });

            if (!booking) return reject("No booking found");

            const formatBookings = {
                ...JSON.parse(JSON.stringify(booking)),
                start_time_date: moment(booking.start_time_date).format(
                    "DD/MM/YYYY HH:mm:ss"
                ),
                end_time_date: moment(booking.end_time_date).format(
                    "DD/MM/YYYY HH:mm:ss"
                ),
            };

            return resolve({
                err: 0,
                message: "Booking found",
                data: formatBookings,
            });
        } catch (error) {
            console.error(error);
            return reject(error);
        }
    });

export const getAmenitiesBookingByIdService = ({ booking_id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const amenities = await db.BookingAmenities.findAll({
                where: {
                    booking_id,
                },
                attributes: ["quantity", "price", "total_price"],
                include: [
                    {
                        model: db.Amenity,
                        attributes: ["amenity_name", "image"],
                    },
                ],
            });

            if (!amenities) return reject("No booking found");

            return resolve({
                err: 0,
                message: "Amenities found",
                data: amenities,
            });
        } catch (error) {
            console.error(error);
            return reject(error);
        }
    });

export const addToCalendarService = (booking_id, user_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const booking = await getBookingByIdService({
                booking_id,
                user_id,
            });

            if (booking.err) {
                return reject(booking.message);
            }

            // New Google Calendar API
            const calendar = google.calendar({
                version: "v3",
                auth: oauth2Client,
            });

            let event = {
                summary: `Booking at ${booking.data.Workspace.workspace_name}`,
                description: `Booking details:\n\nWorkspace: ${booking.data.Workspace.workspace_name}\nBooking Type: ${booking.data.BookingType.type}\nStart Time: ${booking.data.start_time_date}\nEnd Time: ${booking.data.end_time_date}`,
                start: {
                    dateTime: moment(
                        booking.data.start_time_date,
                        "DD/MM/YYYY HH:mm:ss"
                    ).toISOString(),
                    timeZone: "Asia/Kolkata",
                },
                end: {
                    dateTime: moment(
                        booking.data.end_time_date,
                        "DD/MM/YYYY HH:mm:ss"
                    ).toISOString(),
                    timeZone: "Asia/Kolkata",
                },
                attendees: [
                    // Add attendees if needed
                ],
                conferenceData: {
                    createRequest: {
                        requestId: uuidv4(),
                    },
                },
            };

            try {
                await calendar.events.insert({
                    auth: oauth2Client,
                    calendarId: "primary",
                    resource: event,
                });
                return resolve({
                    err: 0,
                    message: "Event added to Google Calendar",
                });
            } catch (calendarError) {
                if (
                    calendarError.errors &&
                    calendarError.errors[0].reason === "insufficientPermissions"
                ) {
                    console.error(
                        "Insufficient permissions for Google Calendar API"
                    );
                    return reject(
                        "Insufficient permissions to add event to Google Calendar"
                    );
                }
                return reject(calendarError);
            }
        } catch (error) {
            console.error(error);
            return reject(error);
        }
    });

export const getTimeBookingService = ({ workspace_id, date }) =>
    new Promise(async (resolve, reject) => {
        try {
            const startOfDay = moment(date).startOf("day").toISOString();
            const endOfDay = moment(date).endOf("day").toISOString();

            console.log(startOfDay, endOfDay);

            const booking = await db.Booking.findAll({
                where: {
                    workspace_id,
                },
                attributes: ["booking_id", "start_time_date", "end_time_date"],
                include: [
                    {
                        model: db.BookingStatus,
                        attributes: ["status"],
                        where: {
                            status: {
                                [db.Sequelize.Op.ne]: "cancelled",
                            },
                        },
                        limit: 1,
                        order: [["createdAt", "desc"]],
                    },
                ],
            });

            if (!booking) return reject("Booking not found");

            console.log(
                "🚀 ~ newPromise ~ startOfDay, endOfDay:",
                startOfDay,
                endOfDay
            );

            const filteredBooking = booking.filter(
                (book) =>
                    moment(startOfDay).isBetween(
                        book.start_time_date,
                        book.end_time_date
                    ) ||
                    moment(endOfDay).isBetween(
                        book.start_time_date,
                        book.end_time_date
                    ) ||
                    moment(book.start_time_date).isBetween(
                        startOfDay,
                        endOfDay
                    ) ||
                    moment(book.end_time_date).isBetween(startOfDay, endOfDay)
            );

            return resolve({
                err: 0,
                message: "Booking found",
                data: filteredBooking,
            });
        } catch (error) {
            console.error(error);
            return reject(error);
        }
    });

// Lấy tổng doanh thu trong tháng
export const getTotalPricesInMonthService = (tokenUser, building_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();

            const startDate = new Date(
                Date.UTC(currentYear, currentMonth, 1)
            ).toISOString();
            const endDate = new Date(
                Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59)
            ).toISOString();

            let totalPrice = 0;
            const commonWhere = {
                createdAt: {
                    [db.Sequelize.Op.between]: [startDate, endDate],
                },
            };
            const commonInclude = [
                {
                    model: db.BookingStatus,
                    attributes: [],
                    where: {
                        status: "completed",
                    },
                    required: true,
                },
            ];

            if (tokenUser.role_id === 1) {
                totalPrice = await db.Booking.sum("total_price", {
                    where: commonWhere,
                    include: commonInclude,
                });
            } else if (tokenUser.role_id === 2) {
                if (!building_id) return reject("Building_id is missing");
                const manager = await db.Manager.findOne({
                    where: {
                        user_id: tokenUser.user_id,
                    },
                });
                if (!manager) return reject("Manager is not exist");
                const isManagerBelongToBuilding = await db.Building.findOne({
                    where: {
                        building_id: building_id,
                        manager_id: manager.manager_id,
                    },
                });
                if (!isManagerBelongToBuilding)
                    return reject("Manager does not belong to this building");

                totalPrice = await db.Booking.sum("total_price", {
                    where: commonWhere,
                    include: [
                        ...commonInclude,
                        {
                            model: db.Workspace,
                            required: false,
                            attributes: [],
                            where: {
                                building_id: building_id,
                            },
                        },
                    ],
                });
            }
            return resolve({
                err: 0,
                message: "Total prices in month found",
                data: totalPrice,
            });
        } catch (error) {
            console.error(error);
            return reject(error);
        }
    });
// Lấy tổng số booking
export const getTotalBookingService = (tokenUser, building_id) =>
    new Promise(async (resolve, reject) => {
        try {
            let totalBooking = 0;
            console.log(tokenUser.role_id);
            if (tokenUser.role_id === 1) {
                totalBooking = await db.Booking.count();
                console.log(totalBooking);
            } else if (tokenUser.role_id === 2) {
                if (!building_id) return reject("Building_id is missing");
                const manager = await db.Manager.findOne({
                    where: {
                        user_id: tokenUser.user_id,
                    },
                });
                if (!manager) return reject("Manager is not exist");
                const isManagerBelongToBuilding = await db.Building.findOne({
                    where: {
                        building_id: building_id,
                        manager_id: manager.manager_id,
                    },
                });
                if (!isManagerBelongToBuilding)
                    return reject("Manager does not belong to this building");
                totalBooking = await db.Booking.count({
                    include: [
                        {
                            model: db.Workspace,
                            required: false,
                            where: {
                                building_id: building_id,
                            },
                        },
                    ],
                });
                console.log(totalBooking);
            }
            return resolve({
                err: 0,
                message: "Total booking found",
                data: totalBooking,
            });
        } catch (error) {
            console.error(error);
            return reject(error);
        }
    });
// lấy 5 booking mới nhất
export const get5RecentBookingService = (tokenUser, building_id) =>
    new Promise(async (resolve, reject) => {
        try {
            let bookings = [];
            if (tokenUser.role_id === 1) {
                bookings = await db.Booking.findAll({
                    attributes: [
                        "booking_id",
                        "start_time_date",
                        "end_time_date",
                        "total_price",
                        "createdAt",
                    ],
                    order: [["createdAt", "DESC"]],
                    limit: 5,
                    include: [
                        {
                            model: db.BookingStatus,
                            as: "BookingStatuses",
                            order: [["createdAt", "DESC"]],
                            limit: 1,
                            attributes: ["status"],
                            require: true,
                        },
                        {
                            model: db.Customer,
                            attributes: ["user_id"],
                            include: [
                                {
                                    model: db.User,
                                    attributes: ["name"],
                                },
                            ],
                        },
                        {
                            model: db.Workspace,
                            attributes: ["workspace_name"],
                            include: [
                                {
                                    model: db.WorkspaceType,
                                    attributes: ["workspace_type_name"],
                                },
                            ],
                        },
                    ],
                });
            } else if (tokenUser.role_id === 2) {
                if (!building_id) return reject("Building_id is missing");
                const manager = await db.Manager.findOne({
                    where: {
                        user_id: tokenUser.user_id,
                    },
                });
                if (!manager) return reject("Manager is not exist");
                const isManagerBelongToBuilding = await db.Building.findOne({
                    where: {
                        building_id: building_id,
                        manager_id: manager.manager_id,
                    },
                });
                if (!isManagerBelongToBuilding)
                    return reject("Manager does not belong to this building");
                bookings = await db.Booking.findAll({
                    order: [["createdAt", "DESC"]],
                    limit: 5,
                    include: [
                        {
                            model: db.BookingStatus,
                            as: "BookingStatuses",
                            order: [["createdAt", "DESC"]],
                            limit: 1,
                            require: true,
                        },
                        {
                            model: db.Customer,
                            attributes: ["user_id"],
                            include: [
                                {
                                    model: db.User,
                                    attributes: ["name"],
                                },
                            ],
                        },
                        {
                            model: db.Workspace,
                            attributes: ["workspace_name"],
                            where: {
                                building_id: building_id,
                            },
                            include: [
                                {
                                    model: db.WorkspaceType,
                                    attributes: ["workspace_type_name"],
                                },
                            ],
                        },
                    ],
                });
            }
            resolve({
                err: 0,
                message: "5 bookings found",
                data: bookings,
            });
        } catch (error) {
            console.error("Error while fetching booking:", error);
            reject(error);
        }
    });
