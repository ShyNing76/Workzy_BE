import db from '../../models';
import { sendMail } from '../../utils/sendMail';

export const createNotificationService = (data) => new Promise(async (resolve, reject) => {
    try {
            const wishlist = await db.Wishlist.findOne({
                where: {
                    wishlist_id: data.wishlist_id,
                }
            });
            if(!wishlist) return reject("Wishlist not found");
            const customer = await db.Customer.findOne({
                where: { customer_id: wishlist.customer_id },
                include: [{
                    model: db.User,
                    attributes: ["email"],
                    where: {
                        status: "active"
                    }
                }]
            });
            if(!customer) return reject("Customer not found");
            const workspace = await db.Workspace.findOne({
                where: {
                    workspace_id: wishlist.workspace_id,
                    status: "active"
                }
            });
            if(!workspace) return reject("Workspace not found");
            await db.Notification.create({
                type: data.type,
                description: data.description,
                customer_id: wishlist.customer_id
            });
            await sendMail(
                customer.User.email,
                "Your Workspace Is Available",
                `Workspace Name: ${workspace.workspace_name} is available now. Come to our website to book it right now! <a href="https://workzy.vercel.app/">Click here</a>`
            );
        resolve({
            err: 0,
            message: "Notification created successfully"
        });
    } catch (error) {
        console.log(error);
        reject(error);
    }
});

export const createNotificationBySendMailService = (data) => new Promise(async (resolve, reject) => {
    try {
        await sendMail(
            "workzy.contact@gmail.com",
            `Contact From ${data.email}`,
            `${data.message}`
        );
        await sendMail(
            data.email,
            "Thank you for your Contact",
            `Dear, ${data.name} We will contact you as soon as possible. Thank you for your interest in our services`
        );
        resolve({
            err: 0,
            message: "Notification created successfully"
        });
    } catch (error) {
        console.log(error);
        reject(error);
    }
});

export const getNotificationByIdService = (id) => new Promise(async (resolve, reject) => {
    try {
        const notification = await db.Notification.findOne({
            where: {
                notification_id: id
            }
        });

        if (!notification) {
            return reject("Notification not found");
        }

        resolve({
            err: 0,
            message: "Notification found",
            data: notification
        });
    } catch (error) {
        reject(error);
    }
});

export const getAllNotificationsService = ({page, limit, order, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const fLimit = limit ? parseInt(limit) : process.env.PAGE_LIMIT;
        const fPage = page ? parseInt(page) : 1;
        const fOrder = order ? order : "type";

        const notifications = await db.Notification.findAndCountAll({
            where: {
                ...query
            },
            order: [
                [fOrder, "ASC"]
            ],
            attributes: ["notification_id", "type", "description"],
            limit: fLimit,
            offset: (fPage - 1) * fLimit
        });

        if (!notifications) {
            return reject("Error while fetching notifications");
        }

        resolve({
            err: 0,
            message: "Notifications found",
            data: notifications
        });
    } catch (error) {
        reject(error);
    }
});

export const updateNotificationService = (id, data) => new Promise(async (resolve, reject) => {
    try {
        const notification = await db.Notification.findOne({
            where: {
                notification_id: id
            }
        });

        if (!notification) {
            return reject("Notification not found");
        }

        const updatedNotification = await notification.update(data);

        if (!updatedNotification) {
            return reject("Error while updating notification");
        }

        resolve({
            err: 0,
            message: "Notification updated successfully"
        });
    } catch (error) {
        reject(error);
    }
});

export const deleteNotificationService = (id) => new Promise(async (resolve, reject) => {
    try {
        const notification = await db.Notification.findOne({
            where: {
                notification_id: id
            }
        });

        if (!notification) {
            return reject("Notification not found");
        }

        await notification.destroy();

        resolve({
            err: 0,
            message: "Notification deleted successfully"
        });
    } catch (error) {
        reject(error);
    }
});