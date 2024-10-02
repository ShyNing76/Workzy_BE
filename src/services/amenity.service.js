import db from '../models';
import { Op } from 'sequelize';
import {v4} from "uuid";
import { handleLimit, handleOffset, handleSortOrder } from "../utils/handleFilter";

export const createAmenityService = async (data) => new Promise(async (resolve, reject) => {
    try {
        data.depreciation_price = data.original_price * 0.7;
        if(data.type == "service") data.depreciation_price = 0;
        console.log(data.image)
        console.log(data.original_price)
        console.log(data.depreciation_price)


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
        resolve({
            err: amenity[1] ? 0 : 1,
            message: amenity[1] ? 'Amenity created successfully!' : 'Amenity already exists',
            data: amenity[0] ? amenity : null,
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
            return reject({
                err: 1,
                message: `Amenity is already used`
            })
        
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
        resolve({
            err: updatedRowsCount > 0 ? 0 : 1,
            message: updatedRowsCount > 0 ? "Update Successfully" : "Cannot find any amenity to update",
        })

    } catch (error) {
        console.log(error.message)
        reject(error)
    }
})

export const deleteAmenityService = async ({amenity_ids}) => new Promise(async (resolve, reject) => {
    try {
        const [updatedRowsCount] = await db.Amenity.update({
            status: "inactive"
        },{
            where: {
                amenity_id: { [Op.in]: amenity_ids },
                status: "active"
            }
        }) 
        resolve({
            err: updatedRowsCount > 0 ? 0 : 1,
            message: updatedRowsCount > 0 ? `${updatedRowsCount} Amenity (s) deleted successfully!` : "Cannot find any amenity to delete",
        })
        
    } catch (error) {
        reject(error)
    }
})

export const getAllAmenityService = ({page, limit, order, amenity_name, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const queries = { raw: true, nest: true };
        queries.offset = handleOffset(page, limit);
        queries.limit = handleLimit(limit);
        if (order) queries.order = [handleSortOrder(order, "amenity_name")];
        if (amenity_name) query.amenity_name = amenity_name;

        const amenities = await db.Amenity.findAndCountAll({
            where: {
                ...query, 
            },
            ...queries,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
        });

        resolve({
            err: amenities.count > 0 ? 0 : 1,
            message: amenities.count > 0 ? "Got" : "No Amenity Exist",
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
        resolve({
            err: amenity ? 0 : 1,
            message: amenity ? "Got" : "No Amenity Exist",
            data: amenity
        });
    } catch (error) {
        reject(error)
    }
})
