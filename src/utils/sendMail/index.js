import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

export const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        html: html,
    });
};

export const sendMailBookingStatus = async (to, subject, html) => {
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        html: html,
    });
};




