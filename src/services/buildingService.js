import db from "../models";
import jwt from "jsonwebtoken";

export const createBuildingService = (data) => new Promise(async (resolve, reject) => {
    try {
        const building = await db.Building.findOrCreate({
            where: {
                building_name: data.building_name
            },
            defaults: {
                building_name: data.building_name,
                location: data.location,
                address: data.address,
                ...data
            }
        }).then(([building, created]) => {
            if (!created) {
                return reject({
                    err: 1,
                    message: "Building name already exists"
                });
            }
            return building;
        })

        resolve({
            err: 0,
            message: "Building created successfully",
            data: {
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
            return reject({
                err: 0,
                message: "Building not found"
            });
        }

        await db.Building.update({
            building_name: data.building_name,
            location: data.location,
            address: data.address,
            description: data.description,
            rating: data.rating,
            status: data.status
        }, {
            where: {
                building_id: id
            }
        });

        resolve({
            err: 1,
            message: "Building updated successfully"
        });
    } catch (error) {
        reject(error);
    }
})