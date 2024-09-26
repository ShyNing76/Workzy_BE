import db from "../models";
import Op from "sequelize"

export const getStaff = ({id, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const queries = {raw: true, nest : true};
        if(id) queries.id = id;
        const staff = await db.Staff.findAll({
            where: query,
            ...queries,
            attributes: {
                exclude: ["building_id","createdAt", "updatedAt"]
            },
            include: [
                {
                    model: db.Building,
                    attributes: {exclude : ["createdAt", "updatedAt"]},
                },
            ]
        });
        resolve({
            err: staff ? 0 : 1,
            message: staff ? "Got" : "No Staff Exist",
        });
    } catch (error) {
        
    }
})