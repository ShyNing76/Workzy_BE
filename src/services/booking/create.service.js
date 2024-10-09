import { v4 } from "uuid";
import db from "../../models";
import { checkRoomAvailability } from "../../utils/checkRoomAvailability";

export const createBookingService = (data) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const [customer, workspace, bookingType] = await Promise.all([
                db.Customer.findOne({ where: { user_id: data.user_id } }),
                db.Workspace.findOne({
                    where: { workspace_id: data.workspace_id },
                }),
                db.BookingType.findOne({ where: { type: data.type } }),
            ]);

            if (!customer || !workspace || !bookingType) {
                return reject(
                    `${
                        !customer
                            ? "Customer"
                            : !workspace
                            ? "Workspace"
                            : "Booking type"
                    } not found`
                );
            }

            const checkAvailability = await checkRoomAvailability({
                workspace_id: workspace.workspace_id,
                start_time: data.start_time,
                end_time: data.end_time,
            });

            if (!checkAvailability) {
                return reject(
                    "Workspace is already booked for the selected time period"
                );
            }

            const booking = {
                booking_id: v4(),
                customer_id: customer.customer_id,
                booking_type_id: bookingType.booking_type_id,
                workspace_id: workspace.workspace_id,
                workspace_price:
                    bookingType.type === "hourly"
                        ? workspace.price_per_hour
                        : bookingType.type === "daily"
                        ? workspace.price_per_day
                        : workspace.price_per_month,
                total_price: data.total_price,
                start_time_date: data.start_time,
                end_time_date: data.end_time,
            };
            const bookingStatus = {
                booking_id: booking.booking_id,
                status: "confirmed",
            };

            await Promise.all([
                db.Booking.create(booking, { transaction: t }),
                db.BookingStatus.create(bookingStatus, { transaction: t }),
            ]);

            await t.commit();
            return resolve({
                err: 0,
                message: "Booking created successfully",
                data: {
                    booking_id: booking.booking_id,
                    user_id: customer.user_id,
                    workspace_id: workspace.workspace_id,
                    start_time: data.start_time,
                    end_time: data.end_time,
                    total_price: data.total_price,
                },
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
