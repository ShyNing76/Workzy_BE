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

function top5Booking() {
    const bookings = db.Booking.findAll({
        order: [["createdAt", "DESC"]],
        limit: 5,
        include: [
            {
                model: db.BookingStatus,
                as: "BookingStatuses",
                order: [["createdAt", "DESC"]],
                limit: 1,
                require: true,
            },
            {
                model: db.Customer,
                attributes: ["user_id"],
                include: [
                    {
                        model: db.User,
                        attributes: ["name"],
                    },
                ],
            },
            {
                model: db.Workspace,
                attributes: ["workspace_name"],
                include: [
                    {
                        model: db.WorkspaceType,
                        attributes: ["workspace_type_name"],
                    },
                ],
            },
        ],
    }).then(result => {
        console.log("Top 5 Booking: " + result);
        console.log("==================================");
        for (let i = 0; i < result.length; i++) {
            console.log("Booking ID: " + result[i].id);
            console.log("Customer Name: " + result[i].Customer.User.name);
            console.log("Workspace Name: " + result[i].Workspace.workspace_name);
            console.log("Workspace Type: " + result[i].Workspace.WorkspaceType.workspace_type_name);
            console.log("Total Price: " + result[i].total_price);
            for (let j = 0; j < result[i].BookingStatuses.length; j++) {
                console.log("Booking Status: " + result[i].BookingStatuses[j].status);
            }
            console.log("==================================");
        }
    }).catch(error => {
        console.error("Error while fetching top 5 booking:", error);
    });
}

top5Booking();