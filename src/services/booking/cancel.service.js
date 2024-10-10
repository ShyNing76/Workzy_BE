import db from "../../models";

export const cancelBookingService = ({ booking_id, user_id }) =>
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

            if (!booking) return reject("Booking not found");

            const bookingStatus = await db.BookingStatus.findOne({
                where: {
                    booking_id: booking.booking_id,
                },
                order: [["createdAt", "DESC"]],
            });

            if (!bookingStatus) return reject("Booking status not found");

            if (bookingStatus.status === "cancelled")
                return reject("Booking already cancelled");

            if (bookingStatus.status !== "confirmed")
                return reject("Booking not confirmed");

            await db.BookingStatus.create({
                booking_id: booking_id,
                status: "cancelled",
            });

            resolve({
                err: 0,
                message: "Booking cancelled",
            });
        } catch (error) {
            reject(error);
        }
    });
