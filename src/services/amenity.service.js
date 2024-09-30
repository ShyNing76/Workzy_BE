import db from '../models';
import {v4} from "uuid";

export const createAmenityService = async (data) => new Promise(async (resolve, reject) => {
    try {
        data.depreciation_price = data.original_price * 0.7;
        if(data.type == "service") data.depreciation_price = 0;

        const amenity = await db.Amenity.findOrCreate({
            where: {
                amenity_name: data.amenity_name
            },
            default: {
                amenity_id: v4(),
                amenity_name: data.amenity_name,
                image: data.image,
                original_price: data.original_price,
                depreciation_price: data.depreciation_price,
                type: data.type,
                status: "active"
            }
        })
        resolve({
            err: amenity[1] ? 0 : 1,
            message: amenity[1] ? 'Amenity created successfully!' : 'Amenity already exists',
            data: amenity
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
            return resolve({
                err: 1,
                message: `Amenity is already used`
            })
        
        
        const amenity = await db.Amenity.findOne({
            where: {
                amenity_id: amenity_id,
                type: data.type
            },
            raw: true
        });

        if(!amenity) return resolve({
            err: 1,
            message: "Amenity not found"
        });
        
        data.depreciation_price = data.original_price * 0.7;
        if(data.type == "service") data.depreciation_price = 0;

        await amenity.update({
            ...data
        })
        resolve({
            err: 0,
            message: "Update Successfully"
        })

    } catch (error) {
        console.log(error.message)
        reject(error)
    }
})

export const deleteAmenityService = async ({amenity_id}) => new Promise(async (resolve, reject) => {
    try {
        const amenities = await db.Amenity.findAll({
                where: {
                    amenity_id: amenity_id
                }
            }) 
            
        if (amenities.length === 0) 
            return resolve({
                err: 1,
                message: "No amenity found"
            })
        
        let alreadyInactiveCount = 0;
        let deletedCount = 0;

        for (const amenity of amenities) {
            if (amenity.status === "inactive") {
                alreadyInactiveCount++;
            } else {
                amenity.status = "inactive";
                await amenity.save(); // Save each image after updating
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            resolve({
                err: 0,
                message: `${deletedCount} amenity(s) deleted successfully!`
            });
        } else {
            resolve({
                err: 1,
                message: alreadyInactiveCount > 0 ? `${alreadyInactiveCount} selected amenities were already deleted.` : 'No images were deleted.'
            });
        }
    } catch (error) {
        reject(error)
    }
})

export const getAllAmenityService = ({page, limit, order, amenity_name, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const queries = { raw: true, nest: true };
        const offset = !page || +page <= 1 ? 0 : +page - 1;
        const finalLimit = +limit || +process.env.PAGE_LIMIT;
        queries.offset = offset * finalLimit;
        queries.limit = finalLimit;
        if (order) queries.order = [order];
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
