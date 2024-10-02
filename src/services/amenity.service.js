import db from '../models';
import { Op } from 'sequelize';
import {v4} from "uuid";
import { handleLimit, handleOffset, handleSortOrder } from "../utils/handleFilter";

export const createAmenityService = (data) => new Promise(async (resolve, reject) => {
    try {
        data.depreciation_price = data.original_price * 0.7;
        if(data.type == "service") data.depreciation_price = 0;

        const amenity = await db.Amenity.findOrCreate({
            where: {
                amenity_name: data.amenity_name
            },
            defaults: {
                amenity_id: v4(),
                amenity_name: data.amenity_name,
                image: data.image,
                original_price: data.original_price,
                depreciation_price: data.depreciation_price,
                ...data,
                status: "active"
            }
        })
        if(amenity[1]) return reject("Amenity already exists")
        resolve({
            err: 0,
            message: 'Amenity created successfully!',
            data: amenity[0],
        })

    } catch (error) {
        reject(error)
    }
})

export const updateAmenityService = (amenity_id, data) => new Promise(async (resolve, reject) => {
    try {
        const isDuplicated = await db.Amenity.findOne({
            where: {
                amenity_name: data.amenity_name,
                amenity_id: { [Op.ne]: amenity_id }
            },
            raw: true
        });

        if(isDuplicated)
            return reject(`Amenity is already used`)
        
        data.depreciation_price = data.original_price * 0.7;
        if(data.type == "service") data.depreciation_price = 0;

        const [updatedRowsCount] = await db.Amenity.update(
            {
                ...data
            },
            {
                where: {
                    amenity_id: amenity_id,
                },
            raw: true
        });        
        if(updatedRowsCount === 0) return reject("Cannot find any amenity to update")
        resolve({
            err: 0,
            message: "Update Successfully",
        })

    } catch (error) {
        console.log(error.message)
        reject(error)
    }
})

export const deleteAmenityService = ({amenity_ids}) => new Promise(async (resolve, reject) => {
    try {
        const [updatedRowsCount] = await db.Amenity.update({
            status: "inactive"
        },{
            where: {
                amenity_id: { [Op.in]: amenity_ids },
                status: "active"
            }
        }) 
        if(updatedRowsCount === 0) return reject("Cannot find any amenity to delete")
        resolve({
            err: 0,
            message: `${updatedRowsCount} Amenity (s) deleted successfully!`,
        })
        
    } catch (error) {
        reject(error)
    }
})

export const getAllAmenityService = ({page, limit, order, amenity_name, ...query}) => new Promise(async (resolve, reject) => {
    try {
        

        const amenities = await db.Amenity.findAndCountAll({
            where: {
                amenity_name: {
                    [Op.substring]: amenity_name || ""
                },
                ...query, 
            },
            offset: handleOffset(page, limit),
            limit: handleLimit(limit),
            order: [handleSortOrder(order, "amenity_name")],
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
        });
        if(amenities.count === 0) return reject("No Amenity Exist")
        resolve({
            err: 0,
            message: "Got",
            data: amenities
        });
    } catch (error) {
        reject(error)
    }
})

export const getAmenityByIdService = (amenity_id) => new Promise(async (resolve, reject) => {
    try {
        const amenity = await db.Amenity.findOne({
            where: {
                amenity_id: amenity_id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            raw: true
        });
        if(!amenity) return reject("No Amenity Exist")
        resolve({
            err: 0,
            message: "Got",
            data: amenity
        });
    } catch (error) {
        reject(error)
    }
})
