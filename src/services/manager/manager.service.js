import db from "../../models";
import {v4} from "uuid";
import moment from "moment";
import {comparePassword, hashPassword} from "../../utils/hashPassword";
import {handleLimit, handleOffset, handleSortOrder} from "../../utils/handleFilter";

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
        const {password, ...rest} = data;
        rest.password = hashPassword(password);
        const user = await db.User.create(
            {
                user_id: v4(),
                ...rest,
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
        const fName = name ? name : "";

        const managers = await db.User.findAll({
            where: {
                name: {
                    [db.Sequelize.Op.substring]: fName
                },
                role_id: 2, // 2 is the role_id for manager
                ...query
            },
            include: {
                model: db.Manager,
                attributes: {
                    exclude: ["created_at", "updated_at", "createdAt", "updatedAt"]
                }
            },
            attributes: {
                exclude: ["password", "created_at", "updated_at", "user_id", "createdAt", "updatedAt"]
            },
            order: [handleSortOrder(order, "name")],
            limit: handleLimit(limit),
            offset: handleOffset(page, limit),
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

        const isDuplicated = await db.User.findOne({
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

        if (isDuplicated && isDuplicated.user_id !== id) {
            return reject(isDuplicated.email === data.email ? "Email already exists" : "Phone already exists");
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

        manager.status = "inactive";
        const building = await db.Building.update({
            manager_id: null
        }, {
            where: {
                manager_id: manager.Manager.manager_id
            }
        });
        if(!building) {
            return reject("Building not found");
        }

        await manager.save();

        resolve({
            err: 0,
            message: "Manager deleted successfully"
        });
    } catch (error) {
        reject(error);
    }
});

export const getBuildingByManagerIdService = (tokenUser) => new Promise(async (resolve, reject) => {
    try {
        const manager = await db.Manager.findOne({
            where: {
                user_id: tokenUser.user_id,
            },
            attributes: ["manager_id"],
            include: {
                model: db.User,
                where: {
                    status: "active",
                    role_id: 2
                },
                required: true,
            }
        });
        if(!manager) return reject("Manager not found");

        const building = await db.Building.findAll({
            where: {
                manager_id: manager.manager_id
            },
        });
        if(!building) return reject("Building not found");
        resolve({
            err: 0,
            message: "List of buildings",
            data: building
        });
    } catch (error) {
        console.log(error)
        reject(error);
    }
})