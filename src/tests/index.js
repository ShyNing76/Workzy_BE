const db = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const moment = require("moment");

const amenityWorkspace = () =>
    new Promise(async (resolve, reject) => {
        try {
            const workspace_id = "c8b6c143-38bf-4528-9d02-67af82bee501";
            const start_time = "2023-10-02T14:00:00+07:00";
            const end_time = "2023-10-02T16:00:00+07:00";

            const bookingStatues = await db.Booking.findAll({
                attributes: [
                    "booking_id",
                    "workspace_id",
                    "start_time_date",
                    "end_time_date",
                ],
                where: {
                    workspace_id: workspace_id,
                    start_time_date: {
                        [db.Sequelize.Op.lt]: end_time,
                    },
                    end_time_date: {
                        [db.Sequelize.Op.gt]: start_time,
                    },
                },
                include: [
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        attributes: [
                            [
                                Sequelize.fn(
                                    "ARRAY_AGG",
                                    Sequelize.col("BookingStatuses.status")
                                ),
                                "statusArray",
                            ],
                        ],
                    },
                ],
                group: [
                    "Booking.booking_id",
                    "Booking.workspace_id",
                    "Booking.start_time_date",
                    "Booking.end_time_date",
                ],
                raw: true,
            });

            if (bookingStatues.length === 0) {
                resolve("Phòng trống");
            }

            let isBooking = false;
            for (const bookingStatus of bookingStatues) {
                console.log(bookingStatus);

                // Check if BookingStatuses and statusArray exist before accessing
                if (
                    bookingStatus.BookingStatuses &&
                    bookingStatus.BookingStatuses.statusArray &&
                    bookingStatus.BookingStatuses.statusArray.includes(
                        "cancelled"
                    )
                ) {
                    isBooking = false;
                } else {
                    isBooking = true;
                }
            }

            resolve(isBooking);
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
