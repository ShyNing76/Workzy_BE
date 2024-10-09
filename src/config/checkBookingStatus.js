import moment from "moment";
import db from "../models";
import { CronJob } from "cron";
import winston from "winston";
import path from "path";
import { Sequelize } from "../models";

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
            await db.BookingStatus.create({
                booking_id: booking.booking_id,
                status: "cancelled",
            });

            logger.info(`Booking ${booking.booking_id} has been cancelled`);
            bookingCancelled++;
        }
    });

    logger.info(`${bookingCancelled} bookings have been cancelled`);

    logger.info("Finishing checkBookingStatus job");
    logger.info("---------------------------------");
};

const job = new CronJob(
    "*/30 * * * * *",
    checkBookingStatus,
    null,
    true,
    "UTC"
);
job.start();

logger.info("CronJob for checkBookingStatus has been started");

export default job;
