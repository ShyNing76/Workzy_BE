import db from "../models";
import {isDuplicate} from "../utils/checkDuplicate";

export const getBuildingService = ({
                                       page, limit, order, building_name, ...query
                                   }) => new Promise(async (resolve, reject) => {
    try {
        const fLimit = parseInt(limit) || 10;
        const fPage = parseInt(page) || 1;
        const [fOrder, fSort] = order || ["building_name", "ASC"];
        const fName = building_name || "";

        const buildings = await db.Building.findAndCountAll({
            where: {
                building_name: {
                    [db.Sequelize.Op.like]: `%${fName}%`
                }, ...query
            }, attributes: {
                exclude: ["created_at", "updated_at", "createdAt", "updatedAt"]
            }, order: [[fOrder, fSort]], limit: fLimit, offset: (fPage - 1) * fLimit
        });

        if (buildings.count === 0) {
            return reject({
                err: 1, message: "No building found"
            });
        }

        resolve({
            err: 0, message: "Buildings found", data: buildings.rows
        });
    } catch (error) {
        reject(error);
    }
});

export const getBuildingByIdService = (id) => new Promise(async (resolve, reject) => {
    try {
        const building = await db.Building.findOne({
            where: {
                building_id: id
            }, attributes: {
                exclude: ["created_at", "updated_at", "createdAt", "updatedAt"]
            }
        });

        if (!building) {
            return resolve({
                err: 1, message: "Building not found"
            });
        }

        resolve({
            err: 0, message: "Building found", data: building
        });
    } catch (error) {
        reject(error);
    }
})

export const createBuildingService = (data) => new Promise(async (resolve, reject) => {
    try {
        const building = await db.Building.findOrCreate({
            where: {
                building_name: data.building_name
            }, defaults: {
                building_name: data.building_name, location: data.location, address: data.address, ...data
            }
        }).then(([building, created]) => {
            if (!created) {
                return reject({
                    err: 1, message: "Building name already exists"
                });
            }
            return building;
        })

        resolve({
            err: 0, message: "Building created successfully", data: {
                building_id: building.building_id,
                building_name: building.building_name,
                location: building.location,
                address: building.address,
                description: building.description,
                rating: building.rating,
                status: building.status
            }
        });
    } catch (error) {
        reject(error);
    }
});


export const updateBuildingService = (id, data) => new Promise(async (resolve, reject) => {
    try {
        const building = await db.Building.findOne({
            where: {
                building_id: id
            }
        });
        if (!building) {
            return resolve({
                err: 1, message: "Building not found"
            });
        }

        const isBuildingNameExist = await isDuplicate(db.Building, "building_name", data.building_name);
        if (isBuildingNameExist) {
            return resolve({
                err: 1, message: "Building name already exists"
            });
        }

        building.set({...building.dataValues, ...data});
        await building.save();

        resolve({
            err: 0, message: "Building updated successfully", data: {
                ...building.dataValues, ...data
            }
        });
    } catch (error) {
        reject(error);
    }
})

export const assignManagerService = (data) => new Promise(async (resolve, reject) => {
    try {
        const building = await db.Building.findOne({
            where: {
                building_id: data.building_id
            }
        });
        if (!building) {
            return resolve({
                err: 1, message: "Building not found"
            });
        }

        const manager = await db.Manager.findOne({
            where: {
                manager_id: data.manager_id
            }
        });
        if (!manager) {
            return resolve({
                err: 1, message: "Manager not found"
            });
        }

        building.setManager(manager.manager_id);
        await building.save();

        resolve({
            err: 0, message: "Manager assigned successfully"
        });
    } catch (error) {
        reject(error);
    }
})

export const deleteBuildingService = (id) => new Promise(async (resolve, reject) => {
    try {
        const building = await db.Building.findOne({
            where: {
                building_id: id
            }
        });
        if (!building) {
            return resolve({
                err: 1, message: "Building not found"
            });
        }

        await db.Building.destroy({
            where: {
                building_id: id
            }
        });

        resolve({
            err: 0, message: "Building deleted successfully"
        });
    } catch (error) {
        reject(error);
    }
})