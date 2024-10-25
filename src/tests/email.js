import { sendMail } from "../utils/sendMail";
import moment from "moment";
const booking = {
    booking_id: "123456",
    Customer: {
        User: {
            email: "tronglhqe180185@fpt.edu.vn",
            name: "Trong Le",
        },
    },
    Workspace: {
        workspace_name: "Workspace 1",
    },
    start_time: "2022-01-01T08:00:00.000Z",
    end_time: "2022-01-01T12:00:00.000Z",

    total_price: 100,
};

async function send(booking) {
    await sendMail(
        booking.Customer.User.email,
        "Booking Payment Successful",
        `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; background-color: #f4f4f4;">
      <!-- Header with logo -->
      <div style="text-align: center; padding-bottom: 20px;">
        <img src="https://workzy.vercel.app/WORKZY_SMALL_LOGO.png" alt="Workzy" style="width: 150px;">
      </div>

      <h2 style="text-align: center; color: #4CAF50; font-size: 24px; font-weight: bold; letter-spacing: 1px;">Payment Successful</h2>
      <p style="text-align: center; font-size: 16px; color: #555;">Dear <strong>${
          booking.Customer.User.name
      }</strong>,</p>
      <p style="text-align: center; font-size: 16px; color: #555;">We are pleased to inform you that your payment has been successfully processed. Below are the details of your booking:</p>
      
      <!-- Booking Details -->
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.05); margin-top: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Booking ID:</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${
                booking.booking_id
            }</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Workspace:</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${
                booking.Workspace.workspace_name
            }</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Start Time:</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
                booking.start_time
            ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">End Time:</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${moment(
                booking.end_time
            ).format("dddd, MMMM Do YYYY, h:mm A")}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #ddd;">Total Price:</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; color: #4CAF50;">${booking.total_price.toFixed(
                2
            )} VNĐ</td>
          </tr>
        </table>
      </div>
      
      <p style="text-align: center; font-size: 16px; color: #555; margin-top: 20px;">
        Your payment was processed successfully and your booking is confirmed. Thank you for choosing our service!
      </p>

      <!-- Call to action button -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://workzy.vercel.app/user/booking/${
            booking.booking_id
        }" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Track Your Booking</a>
      </div>

      <!-- Footer -->
      <p style="text-align: center; font-size: 14px; color: #777; margin-top: 30px;">If you have any questions, feel free to contact our support team at <strong>workzy.contact@gmail.com</strong> or call <strong>+1-800-123-4567</strong>.</p>

      <p style="text-align: center; font-size: 12px; color: #999;">© 2024 Your Company. All rights reserved.</p>
    </div>
  `
    );
}

send(booking);
