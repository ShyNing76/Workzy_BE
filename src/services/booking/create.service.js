import { v4 } from "uuid";
import { Op } from "sequelize";
import db from "../../models";
import { checkRoomAvailability } from "../../utils/checkRoomAvailability";

export const createBookingService = (data) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const [customer, workspace, bookingType] = await Promise.all([
                db.Customer.findOne({ where: { user_id: data.user_id } }),
                db.Workspace.findOne({
                    where: {
                        workspace_id: data.workspace_id,
                        status: "active",
                    },
                }),
                db.BookingType.findOne({ where: { type: data.type }, raw: true, nest: true }),
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
            let voucher;
            if(data.voucher_id && data.voucher_id !== "") {
                voucher = await db.Voucher.findOne({
                    where: {
                        voucher_id: data.voucher_id,
                    },
                });
                if (!voucher) return reject("Voucher not found");
                voucher.quantity = parseInt(voucher.quantity) - 1;
                await voucher.save({ transaction: t });
            }
            const booking = {
                booking_id: v4(),
                customer_id: customer.customer_id,
                booking_type_id: bookingType.booking_type_id,
                workspace_id: workspace.workspace_id,
                voucher_id: voucher ? voucher.voucher_id : null,
                workspace_price:
                    bookingType.type === "Hourly"
                        ? workspace.price_per_hour
                        : bookingType.type === "Daily"
                        ? workspace.price_per_day
                        : workspace.price_per_month,
                total_workspace_price: data.total_price,
                total_price: data.total_price,
                start_time_date: data.start_time,
                end_time_date: data.end_time,
            };

            const bookingStatus = {
                booking_id: booking.booking_id,
                status: "confirmed",
            };

            const notification = {
                notification_id: v4(),
                customer_id: customer.customer_id,
                type: "booking",
                description: `Booking confirmed for workspace ${workspace.workspace_name}`,
            };

            await await Promise.all([
                db.Notification.create(notification, {
                    transaction: t,
                }),
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
            await t.rollback();
            console.log(error);
            reject(error);
        }
    });
