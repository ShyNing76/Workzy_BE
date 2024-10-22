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
                Current: ["check-in", "usage"],
                Upcoming: ["paid", "confirmed"],
                "Check-out": ["check-out", "check-amenities"],
                Completed: ["completed"],
                Cancelled: ["cancelled"],
            };

            const statusCondition = status
                ? {
                      status: {
                          [db.Sequelize.Op.in]: tabStatus[status] || [],
                      },
                  }
                : {};

            const bookings = await db.Booking.findAll({
                where: {
                    customer_id: customer.customer_id,
                },
                include: [
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        where: statusCondition,
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                        required: false, // Change to false to include bookings without statuses
                    },
                ],
                order: [handleSortOrder(order, "start_time_date")],
                limit: handleLimit(limit),
                offset: handleOffset(page, limit),
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            });

            // Filter out bookings that do not have any BookingStatuses
            const filteredBookings = bookings.filter(
                (booking) =>
                    booking.BookingStatuses &&
                    booking.BookingStatuses.length > 0
            );

            if (!filteredBookings || filteredBookings.length === 0)
                return reject("No bookings found");

            return resolve({
                err: 0,
                message: "Bookings found",
                data: filteredBookings,
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
            const tabStatus = {
                Current: ["usage", "check-out", "check-amenities"],
                Upcoming: ["paid", "confirmed"],
                Completed: ["completed"],
                Cancelled: ["cancelled"],
            };

            const statusCondition = status
                ? {
                      status: {
                          [db.Sequelize.Op.in]: tabStatus[status] || [],
                      },
                  }
                : {};

            const bookings = await db.Booking.findAndCountAll({
                where: { ...data },
                include: [
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        where: statusCondition,
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                        required: false,
                    },
                    {
                        model: db.Workspace,
                        as: "Workspace",
                        where: { building_id: building_id || [] },
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    },
                    {
                        model: db.Customer,
                        as: "Customer",
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        include: {
                            model: db.User,
                            as: "User",
                            attributes: { exclude: ["createdAt", "updatedAt"] },
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
                    dateTime: moment(booking.data.start_time_date, "DD/MM/YYYY HH:mm:ss").toISOString(),
                    timeZone: "Asia/Kolkata",
                },
                end: {
                    dateTime: moment(booking.data.end_time_date, "DD/MM/YYYY HH:mm:ss").toISOString(),
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
                return resolve({err: 0, message: "Event added to Google Calendar"
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
            const booking = await db.Booking.findOne({
                where: {
                    workspace_id,
                    start_time_date: {
                        [db.Sequelize.Op.between]: [startOfDay, endOfDay],
                    },
                    end_time_date: {
                        [db.Sequelize.Op.between]: [startOfDay, endOfDay],
                    },
                },
                attributes: ["booking_id", "start_time_date", "end_time_date"],
                include: [
                    {
                        model: db.BookingStatus,
                        attributes: ["status"],
                        limit: 1,
                        order: [["createdAt", "desc"]],
                    },
                ],
            });

            if (!booking) return reject("Booking not found");

            return resolve({
                err: 0,
                message: "Booking found",
                data: booking,
            });
        }catch(error){
            console.error(error);
            return reject(error);
        }
    });

// export const getTotalPricesInMonthService = () =>
//     new Promise(async (resolve, reject) => {
//         try {
//             const currentYear = new Date().getFullYear();
//             const currentMonth = new Date().getMonth();

//             const startDate = new Date(
//                 Date.UTC(currentYear, currentMonth, 1)
//             ).toISOString();
//             const endDate = new Date(
//                 Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59)
//             ).toISOString();

//             const totalPrice = await db.Booking.sum("total_price", {
//                 where: {
//                     createdAt: {
//                         [db.Sequelize.Op.between]: [startDate, endDate],
//                     },
//                 },
//                 include: [
//                     {
//                         model: db.BookingStatus,
//                         order: [["createdAt", "DESC"]],
//                         limit: 1,
//                         where: {
//                             status: "completed",
//                         },
//                         required: false,
//                     },
//                 ],
//             });
//             return resolve({
//                 err: 0,
//                 message: "Total prices in month found",
//                 data: totalPrice,
//             });
//         } catch (error) {
//             console.error(error);
//             return reject(error);
//         }
//     });

// export const getTotalBookingService = () =>
//     new Promise(async (resolve, reject) => {
//         try {
//             const totalBooking = await db.Booking.count();
//             return resolve({
//                 err: 0,
//                 message: "Total booking found",
//                 data: totalBooking,
//             });
//         } catch (error) {
//             console.error(error);
//             return reject(error);
//         }
//     });