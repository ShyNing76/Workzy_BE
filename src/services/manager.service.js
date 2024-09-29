import db from "../models";
import {v4} from "uuid";
import moment from "moment";
import {comparePassword, hashPassword} from "../utils/hashPassword";

export const createManagerService = (data) => new Promise(async (resolve, reject) => {
    try {
        const isDuplicate = await db.User.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    {
                        email: data.email || ""
                    },
                    {
                        phone: data.phone || ""
                    }
                ]
            }
        });

        if (isDuplicate && isDuplicate.user_id) {
            return reject(isDuplicate.email === data.email ? "Email already exists" : "Phone already exists");
        }
        const user = await db.User.create(
            {
                user_id: v4(),
                ...data,
                role_id: 2,
                Manager: {
                    manager_id: v4(),
                },
            },
            {
                include: [{model: db.Manager}],
                raw: true,
                nest: true,
            }
        )

        resolve({
            err: 0,
            message: "Manager created successfully",
            data: {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                date_of_birth: moment(user.date_of_birth).format("MM/DD/YYYY"),
                role_id: user.role_id,
                manager_id: user.Manager.manager_id
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
                user_id: id,
                role_id: 2
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

        let isManagerExist = !!manager;
        if (isManagerExist) {
            manager.date_of_birth = moment(manager.date_of_birth).format("MM/DD/YYYY");
        }

        resolve({
            err: isManagerExist ? 0 : 1,
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
        const fName = name ? name : "";
        const fOrder = order ? order : "email";

        const managers = await db.User.findAll({
            where: {
                name: {
                    [db.Sequelize.Op.like]: `%${fName}%`
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
                [fOrder, "ASC"]
            ],
            limit: fLimit,
            offset: (fPage - 1) * fLimit,
            raw: true,
            nest: true
        });

        if (!managers) {
            return reject("No manager found");
        }
        let count = 0;
        managers.forEach(manager => {
            manager.date_of_birth = moment(manager.date_of_birth).format("MM/DD/YYYY");
            count++;
        });

        resolve({
            err: managers.length ? 0 : 1,
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
        const {password, ...rest} = data;
        const manager = await db.User.findOne({
            where: {
                user_id: id,
                role_id: 2
            },
        });

        if (!manager) {
            return reject("Manager not found");
        }

        const isDuplicateEmail = await db.User.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    {
                        email: data.email
                    },
                    {
                        phone: data.phone
                    }
                ]
            }
        });

        if (isDuplicateEmail && isDuplicateEmail.user_id !== id) {
            return reject(isDuplicateEmail.email === data.email ? "Email already exists" : "Phone already exists");
        }

        if (password) {
            let checkPassword = comparePassword(password, manager.password);
            if (checkPassword) {
                return reject("Invalid password");
            }
            rest.password = hashPassword(password);
        }

        await manager.update({
            ...manager,
            ...rest,
        });

        resolve({
            err: 0,
            message: "Manager updated successfully",
            data: {
                user_id: manager.user_id,
                email: manager.email,
                name: manager.name,
                phone: manager.phone,
                date_of_birth: moment(manager.date_of_birth).format("MM/DD/YYYY"),
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
            return reject("Manager not found");
        }

        manager.setStatus("inactive");
        const building = await db.Building.update({
            manager_id: null
        }, {
            where: {
                manager_id: manager.Manager.manager_id
            }
        });

        await manager.save();

        resolve({
            err: 0,
            message: "Manager deleted successfully"
        });
    } catch (error) {
        reject(error);
    }
});
