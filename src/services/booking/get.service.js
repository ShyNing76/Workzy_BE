import { google } from "googleapis";
import moment from "moment";
import { oauth2Client } from "../../config/passport";
import db from "../../models";
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
                Current: ["check-in", "in-process"],
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
                Current: ["in-process", "check-out", "check-amenities"],
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

            console.log(building_id);

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
            const calendar = google.calendar({
                version: "v3",
                auth: oauth2Client,
            });

            const event = {
                summary: booking.data.workspace_name,
                description: booking.data.workspace_description,
                start: {
                    dateTime: moment(
                        booking.data.start_time_date,
                        "DD/MM/YYYY HH:mm:ss"
                    ).format(),
                },
                end: {
                    dateTime: moment(
                        booking.data.end_time_date,
                        "DD/MM/YYYY HH:mm:ss"
                    ).format(),
                },
            };

            console.log(event);

            try {
                const res = await calendar.events.insert({
                    calendarId: "primary",
                    requestBody: event,
                });
                return resolve(res.data);
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
                throw calendarError;
            }
        } catch (error) {
            console.error(error);
            return reject(error);
        }
    });
