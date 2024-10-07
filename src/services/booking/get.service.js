import db from "../../models";

export const getBookingService = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            console.log(data);
            const customer = await db.Customer.findOne({
                where: {
                    user_id: data.user_id,
                },
            });

            const bookings = await db.Booking.findAll({
                where: {
                    customer_id: customer.customer_id,
                },
                include: [
                    {
                        model: db.Workspace,
                        as: "Workspace",
                    },
                    {
                        model: db.BookingType,
                        as: "BookingType",
                    },
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                    },
                ],
            });

            if (!bookings) return reject("No bookings found");

            return resolve({
                err: 1,
                message: "Bookings found",
                data: bookings,
            })
        } catch (error) {
            console.error(error);
            return reject(error);
        }
    });
