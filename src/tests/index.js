const db = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const moment = require("moment");

const amenityWorkspace = () =>
    new Promise(async (resolve, reject) => {
        try {
            const bookingStatus = await db.BookingStatus.findAll({
                attributes: [
                    "booking_id",
                    [
                        Sequelize.fn("ARRAY_AGG", Sequelize.col("status")),
                        "statusArray",
                    ],
                    [
                        Sequelize.fn("MAX", Sequelize.col("created_at")),
                        "lastCreatedAt",
                    ],
                ],
                group: ["booking_id"],
                raw: true,
                nest: true,
            });

            console.log(bookingStatus);

            const tenMinutesAgo = moment().subtract(10, "minutes").toISOString();

            bookingStatus.forEach(async (booking) => {
                if (
                    booking.statusArray.length === 1 &&
                    booking.statusArray.includes("confirmed") &&
                    booking.lastCreatedAt < tenMinutesAgo
                ) {
                    await db.BookingStatus.create({
                        booking_id: booking.booking_id,
                        status: "cancelled",
                    });
                }
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

amenityWorkspace()
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });
