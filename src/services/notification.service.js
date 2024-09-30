import db from '../models';

export const createNotificationService = (data) => new Promise(async (resolve, reject) => {
    try {
        const notification = await db.Notification.create(data);

        if (!notification) {
            return reject("Error while creating");
        }

        resolve({
            err: 0,
            message: "Notification created successfully"
        });
    } catch (error) {
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