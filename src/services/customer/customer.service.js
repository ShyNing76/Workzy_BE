import db from "../../models";
import {
    handleLimit,
    handleOffset,
    handleSortOrder,
} from "../../utils/handleFilter";
import moment from "moment";

export const getAllUsersService = ({ page, limit, order, name, ...query }) =>
    new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAndCountAll({
                where: {
                    name: {
                        [db.Sequelize.Op.substring]: name || "",
                    },
                    role_id: 4,
                    ...query,
                },
                include: [
                    {
                        model: db.Customer,
                        attributes: {
                            exclude: [
                                "created_at",
                                "updated_at",
                                "createdAt",
                                "updatedAt",
                            ],
                        },
                    },
                ],
                attributes: {
                    exclude: [
                        "password",
                        "created_at",
                        "updated_at",
                        "createdAt",
                        "updatedAt",
                    ],
                },
                order: [handleSortOrder(order, "name")],
                limit: handleLimit(limit),
                offset: handleOffset(page, limit),
            });

            if (!users) {
                return reject("User not found");
            }

            // change date of birth format
            const formattedUsers = [];
            await users.rows.forEach((user) => {
                const plainUser = user.get({ plain: true });
                plainUser.date_of_birth = moment(
                    plainUser.date_of_birth
                ).format("MM/DD/YYYY");
                formattedUsers.push(plainUser);
            });

            resolve({
                err: 0,
                message: "User found",
                data: { ...users, rows: formattedUsers },
            });
        } catch (error) {
            reject(error);
        }
    });

export const removeUserService = (user_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const updateUser = await db.User.update(
                {
                    status: "inactive",
                },
                {
                    where: {
                        user_id: user_id,
                        status: "active",
                    },
                }
            );
            if (!updateUser) {
                return reject("User not found");
            }
            if (updateUser[0] === 0) return reject("User is already updated");

            resolve({
                err: 0,
                message: "Remove user successful",
            });
        } catch (error) {
            reject(error);
        }
    });

export const getMembershipService = (tokenUser) =>
    new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    user_id: tokenUser.user_id,
                },
                attributes: [],
                include: [
                    {
                        model: db.Customer,
                        attributes: {
                            exclude: [
                                "customer_id",
                                "user_id",
                                "createdAt",
                                "updatedAt",
                            ],
                        },
                        required: true,
                    },
                ],
                raw: true,
                nest: true,
            });

            if (!user) {
                return reject("User not found");
            }

            resolve({
                err: 0,
                message: "Get Membership successful",
                data: user.Customer,
            });
        } catch (error) {
            reject(error);
        }
    });

export const getUserByIdService = (customer_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const user = await db.Customer.findOne({
                where: {
                    customer_id,
                },
                include: [
                    {
                        model: db.User,
                        attributes: {
                            exclude: [
                                "password",
                                "created_at",
                                "updated_at",
                                "createdAt",
                                "updatedAt",
                            ],
                        },
                    },
                ],
                attributes: {
                    exclude: [
                        "created_at",
                        "updated_at",
                        "createdAt",
                        "updatedAt",
                    ],
                },
            });

            if (!user) {
                return reject("User not found");
            }

            const plainUser = user.get({ plain: true });
            plainUser.User.date_of_birth = moment(
                plainUser.User.date_of_birth
            ).format("MM/DD/YYYY");

            resolve({
                err: 0,
                message: "User found",
                data: plainUser,
            });
        } catch (error) {
            reject(error);
        }
    });

export const changeStatusService = ({ booking_id, user_id, status }) =>
    new Promise(async (resolve, reject) => {
        try {
            console.log(booking_id, user_id, status);
            const customer = await db.Customer.findOne({
                where: {
                    user_id,
                },
            });

            if (!customer) {
                return reject("Customer not found");
            }

            const booking = await db.Booking.findOne({
                where: {
                    booking_id,
                    customer_id: customer.customer_id,
                },
                include: [
                    {
                        model: db.BookingStatus,
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                        required: true,
                        attributes: ["status"],
                    },
                ],
            });

            if (!booking) {
                return reject("Booking not found");
            }

            const statusTransitions = {
                paid: "check-in",
                "in-process": "check-out",
            };

            const changeStatus = statusTransitions[booking.BookingStatuses[0].status];

            if (changeStatus !== status) {
                return reject("Invalid status");
            }

            if (changeStatus === "check-in") {
                const timeDifference = moment(booking.start_date_time).diff(moment(), "minutes");
                if (timeDifference < -15) {
                    return reject("Booking start time has passed more than 15 minutes ago");
                }
            }

            const createBookingStatus = await db.BookingStatus.create({
                booking_id,
                status: changeStatus,
            });

            if (!createBookingStatus) {
                return reject("Create booking status failed");
            }

            resolve({
                err: 0,
                message: `Change status ${changeStatus} successful`,
            });
        } catch (error) {
            reject(error);
        }
    });
