import {v4} from "uuid";
import db from "../../models";

export const createBookingService = (data) => new Promise(async (resolve, reject) => {
    const t = await db.sequelize.transaction();
    try {
        const customer = await db.Customer.findOne({
            where: {user_id: data.user_id},
        });
        const workspace = await db.Workspace.findOne({
            where: {workspace_id: data.workspace_id},
        });
        const bookingType = await db.BookingType.findOne({
            where: {type: data.type},
        });

        if (!customer) {
            return reject("Customer not found");
        }
        if (!workspace) {
            return reject("Workspace not found");
        }
        if (!bookingType) {
            return reject("Booking type not found");
        }

        const booking = {
            booking_id: v4(),
            customer_id: customer.customer_id,
            booking_type_id: bookingType.booking_type_id,
            workspace_id: workspace.workspace_id,
            workspace_price: bookingType.type === 'hourly' ? workspace.hourly_price :
                              bookingType.type === 'daily' ? workspace.daily_price :
                              bookingType.type === 'monthly' ? workspace.monthly_price :
                              workspace.price,
            total_price: data.total_price,
            start_time_date: data.start_time,
            end_time_date: data.end_time,

        };
        const bookingStatus = {
            booking_id: booking.booking_id,
            status: "confirmed",
        };

        await Promise.all([
            db.Booking.create(booking, {transaction: t}),
            db.BookingStatus.create(bookingStatus, {transaction: t}),
        ]);

        // if commit success, return booking data else rollback
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
