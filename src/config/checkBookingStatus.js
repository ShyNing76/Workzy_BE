import moment from "moment";
import db from "../models";
import { CronJob } from "cron";
import winston from "winston";
import path from "path";

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join('./log', 'checkBookingStatus.log') })
  ]
});

const checkBookingStatus = async () => {
    logger.info('---------------------------------');
    logger.info('Starting checkBookingStatus job');
    const tenMinutesAgo = moment().subtract(10, "minutes").toISOString();
    console.log(tenMinutesAgo);
    const bookingStatus = await db.BookingStatus.findAll({
        where: {
            status: "confirmed",
            createdAt: {
                [db.Sequelize.Op.lt]: tenMinutesAgo,
            },
        },
    });

    logger.info(`Found ${bookingStatus.length} bookings to update`);

    for (const status of bookingStatus) {
        await db.BookingStatus.update(
            {
                status: "cancelled",
            },
            {
                where: { booking_id: status.booking_id },
            }
        );
        logger.info(`Updated booking status to cancelled for booking_id: ${status.booking_id}`);
    }

    logger.info('Finished checkBookingStatus job');
    logger.info('---------------------------------');
};

const job = new CronJob("*/2 * * * *", checkBookingStatus, null, true, "UTC");
job.start();

logger.info('CronJob for checkBookingStatus has been started');

export default job;
