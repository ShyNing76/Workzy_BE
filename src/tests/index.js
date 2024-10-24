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
    const rating = db.Review.findAll({
        attributes: ["rating"],
        limit: 5,
        order: [["rating", "DESC"]], // Changed 'Order' to 'order'
        include: [
            {
                model: db.Booking,
                attributes: ["booking_id"],
                required: true,
            },
        ],
    }).then(ratings => { // Added .then to handle the resolved promise
        const bookings = db.Booking.findAll({
            where: {
                booking_id: { [Op.in]: ratings.map(r => r.booking_id) } // Use 'ratings' instead of 'rating'
            },
            attributes: ["workspace_id"],
        }).then(bookings => { // Added .then to handle the resolved promise
            const top5WorkspaceReview = db.Workspace.count({
                where: {
                    workspace_id: { [Op.in]: bookings.map(b => b.workspace_id) }, // Use 'bookings' instead of 'bookings'
                    status: "active",
                },
                limit: 5,
            })
            .then(result => {
                console.log("Total Workspaces not in bookings: " + result);
            }).catch(error => {
                console.error("Error while fetching total workspaces:", error);
            });
        });
    }).catch(error => {
        console.error("Error while fetching ratings:", error); // Added error handling for ratings
    });
}

getTotalBookingByManager();
