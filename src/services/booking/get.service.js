import moment from "moment";
import db from "../../models";
import {
    handleLimit,
    handleOffset,
    handleSortOrder,
} from "../../utils/handleFilter";
import { where } from "sequelize";

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
    ...data
}) =>
    new Promise(async (resolve, reject) => {
        try {
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

            const bookings = await db.Booking.findAndCountAll({
                where: {
                    ...data,
                },
                include: [
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        where: statusCondition,
                    },
                ],
                order: handleSortOrder(order, "start_time_date"),
                limit: handleLimit(limit),
                offset: handleLimit(page, limit),
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            });

            if (!bookings) return reject("No bookings found");

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
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "booking_status_id",
                                "booking_id",
                            ],
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
