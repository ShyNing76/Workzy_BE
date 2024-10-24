import db from '../../models';
import { Op } from 'sequelize';
import {v4} from "uuid";
import { handleLimit, handleOffset, handleSortOrder } from "../../utils/handleFilter";

export const createAmenityService = (data) => new Promise(async (resolve, reject) => {
    try {
        data.depreciation_price = data.original_price * 0.7;

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
                rent_price: data.rent_price,
                ...data,
                status: "active"
            }
        })

        if(amenity[1] === false) return reject("Amenity already exists")
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

        const amenity = await db.Amenity.findOne({
            where: {
                amenity_id: amenity_id,
            }
        });
        if(!amenity) return reject("Cannot find any amenity to update")
        
        // deleteImage(amenity.image);
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

export const updateStatusAmenityService = (id) => new Promise(async (resolve, reject) => {
    try {
        const [updatedInactive] = await db.Amenity.update({
            status: "inactive"
        },{
            where: {
                amenity_id: id,
                status: "active"
            }
        }) 
        if(updatedInactive === 0) {
            const [updatedActive] = await db.Amenity.update({
                status: "active"
            },{
                where: {
                    amenity_id: id,
                    status: "inactive"
                }
            }) 
            if(updatedActive === 0) return reject("No Amenity Exist")
        }

            
        resolve({
            err: 0,
            message: `Amenity updated successfully!`,
        })
        
    } catch (error) {
        console.log(error.message)
        reject(error)
    }
})

export const getAllAmenityService = ({page, limit, order, amenity_name, status, ...query}) => new Promise(async (resolve, reject) => {
    try {
        if(status) query.status = status ? status : {[Op.ne]: null};
        const amenities = await db.Amenity.findAndCountAll({
            where: {
                amenity_name: {
                    [Op.iLike]: `%${amenity_name || ""}%`
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

export const getAmenityByIdService = (id) => new Promise(async (resolve, reject) => {
    try {
        const amenity = await db.Amenity.findOne({
            where: {
                amenity_id: id
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

//lấy tổng số amenity
export const getTotalAmenityService = () => new Promise(async (resolve, reject) => {
    try {
        
        const totalAmenities = await db.Amenity.count({
            where: {
                status: "active",
            },
        });
        resolve({
            err: 0,
            message: "Got Total Amenity successfully",
            data: totalAmenities
        });
    } catch (error) {
        reject(error)
    }
})
