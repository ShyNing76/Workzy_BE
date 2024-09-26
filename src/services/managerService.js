import db from "../models";
import {v4} from "uuid";
import moment from "moment";
import {hashPassword} from "../utils/hashPassword";

export const createManagerService = (data) => new Promise(async (resolve, reject) => {
    try {
        const checkDuplicateEmail = await db.User.findOne({
            where: {
                email: data.email
            }
        });

        if (checkDuplicateEmail) {
            return reject({
                err: 0,
                message: "Email already exists"
            });
        }
        const user = await db.User.create({
                user_id: v4(),
                email: data.email,
                password: hashPassword(data.password),
                name: data.name,
                role_id: 2, // 2 is the role_id for manager
                Manager: {
                    ...data
                }
            },
            {
                include: db.Manager
            },
            {
                raw: true,
                nest: true
            }
        );

        resolve({
            err: 0,
            message: "Manager created successfully",
            data: {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                role_id: user.role_id,
                status: user.status,
                Manager: {
                    manager_id: user.Manager.manager_id,
                    user_id: user.Manager.user_id,
                    phone: user.Manager.phone,
                    gender: user.Manager.gender,
                    date_of_birth: moment(user.Manager.date_of_birth).format("MM/DD/YYYY"),
                }
            }
        });

    } catch (error) {
        reject(error);
    }
});

export const getManagerByIdService = (id) => new Promise(async (resolve, reject) => {
    try {
        const manager = await db.User.findOne({
            where: {
                user_id: id
            },
            include: {
                model: db.Manager,
                attributes: {
                    exclude: ["created_at", "updated_at", "manager_id", "createdAt", "updatedAt"]
                }
            },
            attributes: {
                exclude: ["password", "created_at", "updated_at", "user_id", "createdAt", "updatedAt"]
            },
            raw: true,
            nest: true
        });

        manager.Manager.date_of_birth = moment(manager.Manager.date_of_birth).format("MM/DD/YYYY");

        let isManagerExist = !!manager;

        resolve({
            err: isManagerExist ? 1 : 0,
            message: isManagerExist ? "Manager found" : "Manager not found",
            data: isManagerExist ? {
                ...manager
            } : {}
        });
    } catch (error) {
        reject(error);
    }
});

export const getAllManagersService = ({page, limit, order, name, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const fLimit = limit ? parseInt(limit) : process.env.PAGE_LIMIT;
        const fPage = page ? parseInt(page) : 1;
        const name = name ? name : "";

        const managers = await db.User.findAll({
            where: {
                name: {
                    [db.Sequelize.Op.like]: `%${name}%`
                },
                role_id: 2, // 2 is the role_id for manager
                ...query
            },
            include: {
                model: db.Manager,
                attributes: {
                    exclude: ["created_at", "updated_at", "manager_id", "createdAt", "updatedAt"]
                }
            },
            attributes: {
                exclude: ["password", "created_at", "updated_at", "user_id", "createdAt", "updatedAt"]
            },
            order: [
                [order ? order : "email", "ASC"]
            ],
            limit: fLimit,
            offset: (fPage - 1) * fLimit,
            raw: true,
            nest: true
        });

        let count = 0;
        managers.forEach(manager => {
            manager.Manager.date_of_birth = moment(manager.Manager.date_of_birth).format("MM/DD/YYYY");
            count++;
        });

        resolve({
            err: 0,
            message: managers.length ? "List of managers" : "No manager found",
            total: count,
            data: managers
        });
    } catch (error) {
        reject(error);
    }
});

export const updateManagerService = (id, data) => new Promise(async (resolve, reject) => {
    try {
        const manager = await db.User.findOne({
            where: {
                user_id: id
            },
            include: {
                model: db.Manager
            }
        });

        if (!manager) {
            return reject({
                err: 0,
                message: "Manager not found"
            });
        }

        const updatedManager = await manager.update({
            email: data.email,
            name: data.name
        });

        await manager.Manager.update({
            phone: data.phone,
            date_of_birth: data.date_of_birth,
        });

        resolve({
            err: 1,
            message: "Manager updated successfully",
            data: {
                user_id: updatedManager.user_id,
                email: updatedManager.email,
                name: updatedManager.name,
                role_id: updatedManager.role_id,
                status: updatedManager.status,
                Manager: {
                    manager_id: updatedManager.Manager.manager_id,
                    user_id: updatedManager.Manager.user_id,
                    phone: updatedManager.Manager.phone,
                    date_of_birth: moment(updatedManager.Manager.date_of_birth).format("MM/DD/YYYY"),
                }
            }
        });
    } catch (error) {
        reject(error);
    }
});

export const deleteManagerService = (id) => new Promise(async (resolve, reject) => {
    try {
        const manager = await db.User.findOne({
            where: {
                user_id: id
            },
            include: {
                model: db.Manager
            }
        });

        if (!manager) {
            return reject({
                err: 0,
                message: "Manager not found"
            });
        }

        await manager.Manager.destroy();
        await manager.destroy();

        resolve({
            err: 1,
            message: "Manager deleted successfully"
        });
    } catch (error) {
        reject(error);
    }
});