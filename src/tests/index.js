const moment = require("moment");
import db from "../models";
import { Op } from "sequelize";
// function cancelBooking(bookingDate) {
//     const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
//     console.log("Current Date: " + currentDate);

//     const start_time_date = moment(bookingDate).format("YYYY-MM-DD HH:mm:ss");
//     console.log("Start Time Date: " + start_time_date);
//     const diff = moment(currentDate).diff(moment(start_time_date), "days");

//     if (diff > 1) {
//         console.log(
//             "You are late by " +
//                 diff +
//                 " days. Booking canceled but cannot refund."
//         );
//     } else {
//         console.log("You are on time. Booking confirmed.");
//     }

//     console.log("Difference in days: " + diff);
// }

// // Example usage
// cancelBooking("2024-11-20T12:00:00Z");

// function totalPricesInMonth() {
//     const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
//     const currentMonth = new Date().getMonth(); // Lấy tháng hiện tại (0-11)
    
//      // Ngày đầu tháng (UTC)
//      const startDate = new Date(Date.UTC(currentYear, currentMonth, 1)).toISOString();
//      // Ngày cuối tháng (UTC)
//      const endDate = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59)).toISOString();
    
//     console.log("Start Date: " + startDate);
//     console.log("End Date: " + endDate);
    
//     const booking = db.Booking.findAll({
//         include: [
//             {
//                 model: db.BookingStatus,
//                 order: [["createdAt", "DESC"]],
//                 limit: 1,
//                 where: {
//                     status: "completed",
//                 },
//                 required: false,
//             },
//         ],
//     }).then(result => {
//         console.log("Booking: " + result);
//     }).catch(error => {
//         console.error("Error while fetching booking:", error);
//     });

//     const totalPrice = db.Booking.sum("total_price", {
//         where: {
//             createdAt: {
//                 [Op.between]: [startDate, endDate],
//             },
//         },
//         include: [
//             {
//                 model: db.BookingStatus,
//                 order: [["createdAt", "DESC"]],
//                 limit: 1,
//                 where: {
//                     status: "completed",
//                 },
//                 required: false,
//             },
//         ],
//     }).then(result => {
//         console.log("Total Price: " + result);
//     }).catch(error => {
//         console.error("Error fetching total price: ", error);
//     });
// }

// totalPricesInMonth();

function getTotalBookingByManager() {
    const booking = db.Booking.findAll({
        attributes: ["workspace_id"],
        include: [
            {
                model: db.BookingStatus,
                order: [["createdAt", "DESC"]],
                limit: 1,
                where: {
                    status: {[Op.in]: ["confirmed", "paid", "check-in", "completed", "check-out", "check-amenities", "damaged-payment"]},
                },
                required: false,
            },{
                model: db.Workspace,
                required: true,
                include: [
                    {
                        model: db.Building,
                        required: true,
                        attributes: ["building_id"],
                        where: {
                            building_id: "48ef4ba5-5a39-4d0b-a860-bb264fe364c1",
                        },
                    },
                ],
            }
        ],
    })
    
        .then((booking) => {
            const bookedWorkspaceIds = booking.map(b => b.workspace_id);
    const totalWorkspaces = db.Workspace.count({
        where: {
            workspace_id: {
                [Op.notIn]: bookedWorkspaceIds,
            },
        },
    }).then((result) => {
        console.log("Total workspaces: " + result);
    }).catch((error) => {
        console.error("Error fetching total workspaces: ", error);
    });
        }).catch((error) => {
            console.error("Error fetching total price: ", error);
        });
    }
getTotalBookingByManager();
