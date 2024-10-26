import moment from "moment";
import db from "../models";
import { CronJob } from "cron";
import winston from "winston";
import path from "path";
import { Sequelize } from "../models";
import { v4 } from "uuid";
import { sendMail } from "../utils/sendMail";
import { Op } from "sequelize";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join("./log", "checkBookingStatus.log"),
        }),
    ],
});

const checkBookingStatus = async () => {
    logger.info("---------------------------------");
    logger.info("Starting checkBookingStatus job");
    const tenMinutesAgo = moment().subtract(10, "minutes").toISOString();
    const bookingStatus = await db.BookingStatus.findAll({
        attributes: [
            "booking_id",
            [Sequelize.fn("ARRAY_AGG", Sequelize.col("status")), "statusArray"],
            [Sequelize.fn("MAX", Sequelize.col("created_at")), "lastCreatedAt"],
        ],
        group: ["booking_id"],
        raw: true,
        nest: true,
    });

    let bookingCancelled = 0;

    bookingStatus.forEach(async (booking) => {
        if (
            booking.statusArray.length === 1 &&
            booking.statusArray.includes("confirmed") &&
            moment(booking.lastCreatedAt).isBefore(tenMinutesAgo)
        ) {
            console.log("Booking cancelled", booking.booking_id);
            await db.BookingStatus.create({
                booking_id: booking.booking_id,
                status: "cancelled",
            });

            const customer = await db.Booking.findOne({
                where: { booking_id: booking.booking_id },
                include: [
                    {
                        model: db.Customer,
                        include: [db.User],
                    },
                ],
            });

            await db.Notification.create({
                notification_id: v4(),
                customer_id: customer.customer_id,
                type: "booking",
                description: `Booking cancelled for booking id ${booking.booking_id}`,
            });

            await sendMail(
                customer.Customer.User.email,
                "Booking Cancellation Due to Payment Timeout",
                `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; background-color: #f4f4f4;">
                <!-- Header with logo -->
                <div style="text-align: center; padding-bottom: 20px;">
                    <img src="https://workzy.vercel.app/WORKZY_SMALL_LOGO.png" alt="Company Logo" style="width: 150px;">
                </div>

                <h2 style="text-align: center; color: #dc3545; font-size: 24px; font-weight: bold; letter-spacing: 1px;">Booking Cancellation</h2>
                <p style="text-align: center; font-size: 16px; color: #555;">Dear <strong>${
                    customer.Customer.User.name
                }</strong>,</p>
                <p style="text-align: center; font-size: 16px; color: #555;">We regret to inform you that your booking has been cancelled due to non-payment within the allowed time. Below are the details of the booking:</p>
                
                <!-- Booking Details -->
                <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.05); margin-top: 20px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Booking ID:</td>
                        <td style="padding: 12px; border-bottom: 1px solid #ddd;">${
                            booking.booking_id
                        }</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Original Booking Date:</td>
                        <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
                            booking.start_time_date
                        ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Cancellation Date:</td>
                        <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
                            booking.end_time_date
                        ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
                    </tr>
                    </table>
                </div>

                <!-- Payment Timeout Notice -->
                <p style="text-align: center; font-size: 16px; color: #555; margin-top: 20px;">
                    Unfortunately, we did not receive your payment within the required time. As a result, your booking has been cancelled automatically.
                </p>

                <!-- Call to action button -->
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://workzy.vercel.app/" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Book Again</a>
                </div>

                <!-- Footer -->
                <p style="text-align: center; font-size: 14px; color: #777; margin-top: 30px;">If you have any questions, feel free to contact our support team at <strong>support@yourwebsite.com</strong> or call <strong>+1-800-123-4567</strong>.</p>

                <p style="text-align: center; font-size: 12px; color: #999;">© 2024 Your Company. All rights reserved.</p>
                </div>
            `
            );

            logger.info(`Booking ${booking.booking_id} has been cancelled`);
            bookingCancelled++;
        }
    });

    logger.info(`${bookingCancelled} bookings have been cancelled`);

    logger.info("Finishing checkBookingStatus job");
    logger.info("---------------------------------");
};

const checkTimeOutBooking = async () => {
    logger.info("---------------------------------");
    logger.info("Starting checkTimeOutBooking job");
    const tenMinutesAgo = moment().subtract(10, "minutes").toISOString();

    console.log("Ten minutes ago:", tenMinutesAgo);

    const overdueBookings = await db.BookingStatus.findAll({
        attributes: [
            "booking_id",
            [Sequelize.fn("ARRAY_AGG", Sequelize.col("status")), "statusArray"],
        ],
        include: [
            {
                model: db.Booking,
                where: {
                    end_time_date: {
                        [Op.lte]: tenMinutesAgo,
                    },
                },
            },
        ],
        group: ["BookingStatus.booking_id", "Booking.booking_id"],
        raw: true,
        nest: true,
    });

    let overdueBookingCount = 0;
    const currentTimestamp = moment().toISOString();
    // Duyệt qua danh sách booking quá hạn
    overdueBookings.forEach(async (booking) => {
        if (
            booking.statusArray &&
            booking.statusArray.includes("paid", "check-in", "usage") &&
            !booking.statusArray.includes("cancelled") &&
            !booking.statusArray.includes("completed")
        ) {
            overdueBookingCount++;

            logger.info(`Booking ${booking.booking_id} is overdue`);

            // Chuyển trạng thái booking sang completed nếu thời gian kết thúc booking đã qua
            // Quá giờ thì chuyển sang trạng thái completed
            if (
                moment(currentTimestamp).isAfter(booking.Booking.end_time_date)
            ) {
                await db.BookingStatus.create({
                    booking_id: booking.booking_id,
                    status: "completed",
                });
            } else {
                // Lấy thông tin khách hàng
                const customer = await db.Booking.findOne({
                    where: { booking_id: booking.booking_id },
                    include: [
                        {
                            model: db.Customer,
                            include: [db.User],
                        },
                    ],
                });

                // Gửi email thông báo tới khách hàng
                await sendMail(
                    customer.Customer.User.email,
                    "Check-Out Reminder for Your Booking",
                    `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; background-color: #f4f4f4;">
                        <!-- Header with logo -->
                        <div style="text-align: center; padding-bottom: 20px;">
                            <img src="https://workzy.vercel.app/WORKZY_SMALL_LOGO.png" alt="Company Logo - Workzy" style="width: 150px;">
                        </div>

                        <h2 style="text-align: center; color: #dc3545; font-size: 24px; font-weight: bold; letter-spacing: 1px;">Check-Out Reminder</h2>
                        <p style="text-align: center; font-size: 16px; color: #555;">Dear <strong>${
                            customer.Customer.User.name
                        }</strong>,</p>
                        <p style="text-align: center; font-size: 16px; color: #555;">This is a friendly reminder that your booking is approaching its check-out time. Below are the details of your booking:</p>

                        <!-- Booking Details -->
                        <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.05); margin-top: 20px;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr style="background-color: #f9f9f9;">
                                    <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Booking ID:</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #ddd;">${
                                        booking.booking_id
                                    }</td>
                                </tr>
                                <tr style="background-color: #f9f9f9;">
                                    <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Original Booking Date:</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
                                        booking.start_time_date
                                    ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Check-Out Date:</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
                                        booking.end_time_date
                                    ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
                                </tr>
                            </table>
                        </div>

                        <!-- Reminder Notice -->
                        <p style="text-align: center; font-size: 16px; color: #555; margin-top: 20px;">
                            Please make sure to complete the check-out process on time to avoid any inconvenience.
                        </p>

                        <!-- Call to action button -->
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://workzy.vercel.app/user/booking" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Check-Out Now</a>
                        </div>

                        <!-- Footer -->
                        <p style="text-align: center; font-size: 14px; color: #777; margin-top: 30px;">If you have any questions, feel free to contact our support team at <strong>support@yourwebsite.com</strong> or call <strong>+1-800-123-4567</strong>.</p>

                        <p style="text-align: center; font-size: 12px; color: #999;">© 2024 Your Company. All rights reserved.</p>
                    </div>
                `
                );

                // Lấy thông tin building và nhân viên
                const building = await db.Building.findOne({
                    include: [
                        {
                            model: db.Workspace,
                            where: {
                                workspace_id: booking.Booking.workspace_id,
                            },
                            required: true,
                        },
                    ],
                    raw: true,
                });

                const staffUser = await db.User.findOne({
                    include: [
                        {
                            model: db.Staff,
                            where: {
                                building_id: building.building_id,
                            },
                            required: true,
                        },
                    ],
                    raw: true,
                });

                if (!building || !staffUser) {
                    console.error(
                        "Building or staff information not found for booking:",
                        booking.booking_id
                    );
                    return;
                }

                // Gửi email thông báo tới nhân viên
                await sendMail(
                    staffUser.email,
                    "Check-Out Reminder for Booking",
                    `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; background-color: #f4f4f4;">
                        <!-- Header with logo -->
                        <div style="text-align: center; padding-bottom: 20px;">
                            <img src="https://workzy.vercel.app/WORKZY_SMALL_LOGO.png" alt="Company Logo - Workzy" style="width: 150px;">
                        </div>

                        <h2 style="text-align: center; color: #dc3545; font-size: 24px; font-weight: bold; letter-spacing: 1px;">Check-Out Reminder</h2>
                        <p style="text-align: center; font-size: 16px; color: #555;">Dear <strong>${
                            staffUser.name
                        }</strong>,</p>
                        <p style="text-align: center; font-size: 16px; color: #555;">This is a friendly reminder that the booking for <strong>${
                            customer.Customer.User.name
                        }</strong> is approaching its check-out time. Please ensure that the check-out process is completed promptly. Below are the details of the booking:</p>

                        <!-- Booking Details -->
                        <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.05); margin-top: 20px;">
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <tr style="background-color: #f9f9f9;">
                                    <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Booking ID:</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #ddd;">${
                                        booking.booking_id
                                    }</td>
                                </tr>
                                <tr style="background-color: #f9f9f9;">
                                    <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Original Booking Date:</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
                                        booking.start_time_date
                                    ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Check-Out Date:</td>
                                    <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
                                        booking.end_time_date
                                    ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
                                </tr>
                            </table>
                        </div>
                        <p style="text-align: center; font-size: 16px; color: #555; margin-top: 20px;">Please ensure all items are checked out on time. Thank you for your cooperation!</p>
                        
                        <!-- Button for check-out -->
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://workzy.vercel.app/staff/bookings" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Complete Check-Out</a>
                        </div>
                    </div>
                `
                );
            }
        }
    });

    logger.info(`${overdueBookingCount} bookings are overdue`);

    logger.info("Finishing checkTimeOutBooking job");
};

const job = new CronJob("*/2 * * * *", checkBookingStatus, null, true, "UTC");
const timeOutJob = new CronJob(
    "*/30 * * * * *",
    checkTimeOutBooking,
    null,
    true,
    "UTC"
);

export { job, timeOutJob };
