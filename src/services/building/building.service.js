import db from "../../models";
import {isDuplicate} from "../../utils/checkDuplicate";
import {handleLimit, handleOffset, handleSortOrder} from "../../utils/handleFilter";

export const getBuildingService = ({
                                       page,
                                       limit,
                                       order,
                                       building_name,
                                       ...query
                                   }) => new Promise(async (resolve, reject) => {
    try {

        const fName = building_name || "";

        const buildings = await db.Building.findAndCountAll({
            where: {
                building_name: {
                    [db.Sequelize.Op.substring]: fName
                },
                ...query
            },
            attributes: {
                exclude: ["created_at", "updated_at", "createdAt", "updatedAt"]
            },
            order: [handleSortOrder(order, "building_name")],
            limit: handleLimit(limit),
            offset: handleOffset(page, limit)
        });

        if (buildings.count === 0) {
            return reject("No building found");
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
            return reject("Building not found");
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
                building_name: data.building_name,
                location: data.location,
                address: data.address,
                ...data
            }
        }).then(([building, created]) => {
            if (!created) {
                return reject("Building name already exists");
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
        reject(error)
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
            return reject("Building not found");
        }

        const isBuildingNameExist = await isDuplicate(db.Building, "building_name", data.building_name);
        if (isBuildingNameExist) {
            return reject("Building name already exists");
        }

        building.set({...building.dataValues, ...data});
        await building.save();

        resolve({
            err: 0, message: "Building updated successfully", data: {
                ...building.dataValues, ...data
            }
        });
    } catch (error) {
        reject(error)
    }
})

export const assignManagerService = (building_id, manager_id) => new Promise(async (resolve, reject) => {
    try {
        const building = await db.Building.findOne({
            where: {
                building_id
            }
        });
        if (!building) {
            return reject("Building not found");
        }

        const manager = await db.Manager.findOne({
            where: {
                manager_id
            }
        });
        if (!manager) {
            return reject("Manager not found");
        }

        building.setManager(manager.manager_id);
        await building.save();

        resolve({
            err: 0, message: "Manager assigned successfully"
        });
    } catch (error) {
        reject(error)
    }
})

export const updateBuildingImageService = (id, images) => new Promise(async (resolve, reject) => {
    try {
        const building = await db.Building.findOne({
            where: {
                building_id: id
            },
            include: {
                model: db.BuildingImage,
                as: "images"
            }
        });
        if (!building) {
            return reject("Building not found");
        }
        // image is a list like ["image1", "image2"]
        images.forEach(image => {
            //     add image to models buildingImage
            db.BuildingImage.create({
                building_id: building.building_id,
                image
            })
        })

        resolve({
            err: 0, message: "Building image updated successfully"
        });
    } catch (error) {
        reject(error)
    }
});

export const removeManagerService = (id) => new Promise(async (resolve, reject) => {
    try {
        const building = await db.Building.findOne({
            where: {
                building_id: id
            }
        });
        if (!building) {
            return reject("Building not found");
        }

        building.setManager(null);
        await building.save();

        resolve({
            err: 0, message: "Manager removed successfully"
        });
    } catch (error) {
        reject(error)
    }
});

export const updateBuildingStatusService = (id, status) => new Promise(async (resolve, reject) => {
    try {
        const building = await db.Building.findOne({
            where: {
                building_id: id
            }
        });
        if (!building) {
            return reject("Building not found");
        }

        building.status = status;
        await building.save();

        resolve({
            err: 0, message: "Building status updated successfully"
        });
    } catch (error) {
        reject(error)
    }
});

export const deleteBuildingService = (id) => new Promise(async (resolve, reject) => {
    try {
        const building = await db.Building.findOne({
            where: {
                building_id: id
            }
        });
        if (!building) {
            return reject("Building not found");
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
        reject(error)
    }
})