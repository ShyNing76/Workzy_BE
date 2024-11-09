const moment = require("moment");
const db = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const { sendMail } = require("../utils/sendMail");

// function checkTimeOutBooking() {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const tenMinutesAgo = moment()
//                 .subtract(10, "minutes")
//                 .toISOString();

//             console.log("Ten minutes ago:", tenMinutesAgo);

//             const overdueBookings = await db.BookingStatus.findAll({
//                 attributes: [
//                     "booking_id",
//                     [
//                         Sequelize.fn("ARRAY_AGG", Sequelize.col("status")),
//                         "statusArray",
//                     ],
//                 ],
//                 include: [
//                     {
//                         model: db.Booking,
//                         where: {
//                             end_time_date: {
//                                 [Op.lte]: tenMinutesAgo,
//                             },
//                         },
//                     },
//                 ],
//                 group: ["BookingStatus.booking_id", "Booking.booking_id"],
//                 raw: true,
//                 nest: true,
//             });

//             let overdueBookingCount = 0;
//             const currentTimestamp = moment().toISOString();
//             // Duyệt qua danh sách booking quá hạn
//             overdueBookings.forEach(async (booking) => {
//                 if (
//                     booking.statusArray &&
//                     booking.statusArray.includes("paid", "check-in", "usage") &&
//                     !booking.statusArray.includes("cancelled") &&
//                     !booking.statusArray.includes("completed")
//                 ) {
//                     overdueBookingCount++;

//                     // Chuyển trạng thái booking sang completed nếu thời gian kết thúc booking đã qua
//                     // Quá giờ thì chuyển sang trạng thái completed
//                     if (
//                         moment(currentTimestamp).isAfter(
//                             booking.Booking.end_time_date
//                         )
//                     ) {
//                         await db.BookingStatus.create({
//                             booking_id: booking.booking_id,
//                             status: "completed",
//                         });
//                     }

//                     // Lấy thông tin khách hàng
//                     const customer = await db.Booking.findOne({
//                         where: { booking_id: booking.booking_id },
//                         include: [
//                             {
//                                 model: db.Customer,
//                                 include: [db.User],
//                             },
//                         ],
//                     });

//                     // Gửi email thông báo tới khách hàng
//                     await sendMail(
//                         customer.Customer.User.email,
//                         "Booking will expire soon",
//                         `
//                         <div style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; background-color: #f4f4f4;">
//                             <!-- Header with logo -->
//                             <div style="text-align: center; padding-bottom: 20px;">
//                                 <img src="https://workzy.vercel.app/WORKZY_SMALL_LOGO.png" alt="Company Logo" style="width: 150px;">
//                             </div>

//                             <h2 style="text-align: center; color: #dc3545; font-size: 24px; font-weight: bold; letter-spacing: 1px;">Booking Cancellation</h2>
//                             <p style="text-align: center; font-size: 16px; color: #555;">Dear <strong>${
//                                 customer.Customer.User.name
//                             }</strong>,</p>
//                             <p style="text-align: center; font-size: 16px; color: #555;">We regret to inform you that your booking has been cancelled due to non-payment within the allowed time. Below are the details of the booking:</p>

//                             <!-- Booking Details -->
//                             <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.05); margin-top: 20px;">
//                                 <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
//                                 <tr style="background-color: #f9f9f9;">
//                                     <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Booking ID:</td>
//                                     <td style="padding: 12px; border-bottom: 1px solid #ddd;">${
//                                         booking.booking_id
//                                     }</td>
//                                 </tr>
//                                 <tr style="background-color: #f9f9f9;">
//                                     <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Original Booking Date:</td>
//                                     <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
//                                         booking.start_time_date
//                                     ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
//                                 </tr>
//                                 <tr>
//                                     <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Cancellation Date:</td>
//                                     <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
//                                         booking.end_time_date
//                                     ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
//                                 </tr>
//                                 </table>
//                             </div>

//                             <!-- Payment Timeout Notice -->
//                             <p style="text-align: center; font-size: 16px; color: #555; margin-top: 20px;">
//                                 Unfortunately, we did not receive your payment within the required time. As a result, your booking has been cancelled automatically.
//                             </p>

//                             <!-- Call to action button -->
//                             <div style="text-align: center; margin-top: 30px;">
//                                 <a href="https://workzy.vercel.app/" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Book Again</a>
//                             </div>

//                             <!-- Footer -->
//                             <p style="text-align: center; font-size: 14px; color: #777; margin-top: 30px;">If you have any questions, feel free to contact our support team at <strong>support@yourwebsite.com</strong> or call <strong>+1-800-123-4567</strong>.</p>

//                             <p style="text-align: center; font-size: 12px; color: #999;">© 2024 Your Company. All rights reserved.</p>
//                         </div>
//                         `
//                     );

//                     // Lấy thông tin building và nhân viên
//                     const [building, staffUser] = await Promise.all([
//                         db.Building.findOne({
//                             include: [
//                                 {
//                                     model: db.Workspace,
//                                     where: {
//                                         workspace_id:
//                                             booking.Booking.workspace_id,
//                                     },
//                                     required: true,
//                                 },
//                             ],
//                             raw: true,
//                         }),
//                         db.User.findOne({
//                             include: [
//                                 {
//                                     model: db.Staff,
//                                     where: {
//                                         building_id:
//                                             booking.Booking.Workspace
//                                                 .building_id,
//                                     },
//                                     required: true,
//                                 },
//                             ],
//                             raw: true,
//                         }),
//                     ]);

//                     if (!building || !staffUser) {
//                         console.error(
//                             "Building or staff information not found for booking:",
//                             booking.booking_id
//                         );
//                         return;
//                     }

//                     // Gửi email thông báo tới nhân viên
//                     await sendMail(
//                         staffUser.email,
//                         "Booking will expire soon",
//                         `
//                             <div style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; background-color: #f4f4f4;">
//                             <!-- Header with logo -->
//                             <div style="text-align: center; padding-bottom: 20px;">
//                                 <img src="https://workzy.vercel.app/WORKZY_SMALL_LOGO.png" alt="Company Logo" style="width: 150px;">
//                             </div>

//                             <h2 style="text-align: center; color: #dc3545; font-size: 24px; font-weight: bold; letter-spacing: 1px;">Booking Will Expire Soon</h2>
//                             <p style="text-align: center; font-size: 16px; color: #555;">Dear <strong>${
//                                 staffUser.name
//                             }</strong>,</p>
//                             <p style="text-align: center; font-size: 16px; color: #555;">We regret to inform you that the booking of <strong>${
//                                 customer.Customer.User.name
//                             }</strong> has been cancelled due to non-payment within the allowed time. Below are the details of the booking:</p>

//                             <!-- Booking Details -->
//                             <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.05); margin-top: 20px;">
//                                 <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
//                                 <tr style="background-color: #f9f9f9;">
//                                     <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Booking ID:</td>
//                                     <td style="padding: 12px; border-bottom: 1px solid #ddd;">${
//                                         booking.booking_id
//                                     }</td>
//                                 </tr>
//                                 <tr style="background-color: #f9f9f9;">
//                                     <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Original Booking Date:</td>
//                                     <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
//                                         booking.start_time_date
//                                     ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
//                                 </tr>
//                                 <tr>
//                                     <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Cancellation Date:</td>
//                                     <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
//                                         booking.end_time_date
//                                     ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
//                                 </tr>
//                                 </table>
//                             </div>
//                             `
//                     );

//                     const booking = await db.Booking.findOne({
//                         where: { booking_id: booking.booking_id },
//                     });

//                     // Chuyển trạng thái booking sang cancelled
//                     await db.BookingStatus.create({
//                         booking_id: booking.booking_id,
//                         status: "cancelled",
//                     });
//                 }
//             });

//             resolve(overdueBookingCount);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

// checkTimeOutBooking()
//     .then((bookings) => {
//         console.log("Bookings retrieved:", bookings);
//     })
//     .catch((error) => {
//         console.error("Error retrieving bookings:", error);
//     });

function getAll(){
    const data = db.Workspace.findAll({
        attributes: ["workspace_id"],
        include: [
            {
                model: db.AmenitiesWorkspace,
                attributes: ["amenity_id", "quantity"],
                include: [
                    {
                        model: db.Amenity,
                        attributes: ["amenity_id"],
                    },
                ],
            },
        ]
    }).then((data) => {
        console.log(data);
    });
}

getAll();