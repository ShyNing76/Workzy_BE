import db from "../models";
import {Op} from "sequelize";
import moment from "moment";
import {v4} from "uuid"; 
import {hashPassword} from "../utils/hashPassword";
import { raw } from "body-parser";

export const createStaffService = ({password, ...data}) => new Promise(async (resolve, reject) => {
    try {
        const isDuplicated = await db.User.findOne({
            where: {
                [Op.or]: [{
                    email: data.email 
                },
                {
                    phone: data.phone
                }]
            },
            raw: true
        });
        
        if(isDuplicated){
            const field = isDuplicated.email === data.email ? "Email" : "Phone";
            return reject({
                err: 1,
                message: `${field} is already used`
            })
        }
        
        const staff = await db.User.create({
            user_id: v4(),
            password: hashPassword(password),
            ...data,
            role_id: 3,
            Staff: {
                staff_id: v4()
            }
        } ,
        {
            include: [{model: db.Staff}], 
            raw: true,
            nest: true
        },
        );

        resolve({
            err: 0,
            message: "Staff created successfully",
            data: {
                user_id: staff.user_id,
                email: staff.email,
                name: staff.name,
                phone: staff.phone,
                date_of_birth: moment(staff.date_of_birth).format("MM/DD/YYYY"),
                role_id: staff.role_id,
                staff_id: staff.Staff.staff_id
            }
        });
    } catch (error) {
        reject(error);
    }
})

export const getAllStaffService = ({page, limit, order, name, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const queries = { raw: true, nest: true };
        const offset = !page || +page <= 1 ? 0 : +page - 1;
        const finalLimit = +limit || +process.env.PAGE_LIMIT;
        queries.offset = offset * finalLimit;
        queries.limit = finalLimit;
        if (order) queries.order = [order];
        if (name) query.name = { [Op.substring]: name };

        const staffs = await db.User.findAndCountAll({
            where: {
            role_id: 3,
                ...query, 
            },
            ...queries,
            attributes: {
                exclude: ["password","google_token","building_id","createdAt", "updatedAt"]
            },
            include: [
                {
                    model: db.Staff,
                    attributes: {exclude: ["building_id","createdAt", "updatedAt"]},
                    include: [
                        {
                            model: db.Building,
                            attributes: {exclude : ["manager_id","status","createdAt", "updatedAt"]},
                        },
                    ]
                }, 
            ],
            raw: true
        });
        staffs.rows.forEach(staff => {
            if (staff.date_of_birth) {
                staff.date_of_birth = moment(staff.date_of_birth).format('MM/DD/YYYY');
            }
        });
        resolve({
            err: staffs ? 0 : 1,
            message: staffs ? "Got" : "No Staff Exist",
            data: staffs
            
        });
    } catch (error) {
        reject(error)
    }
})

export const getStaffByIdService = (id) => new Promise(async (resolve, reject) => {
    try {
        const staff = await db.User.findOne({
            where: {
                user_id: id,
                role_id: 3
            },
            attributes: {
                exclude: ["password","google_token","createdAt", "updatedAt"]
            },
            include: {
                model: db.Staff,
                attributes: {
                   exclude: ["user_id","createdAt","updatedAt"]
                },
                include: {
                    model: db.Building,
                    attributes: {
                        exclude: ["building_id","manager_id","status","createdAt","updatedAt"]
                    },
                }
            },
            raw: true
        });
        resolve({
            err: staff ? 0 : 1,
            message: staff ? "Got" : "No Staff Exist",
            data: staff ? {
                user_id: staff.user_id,
                role_id: staff.role_id,
                name: staff.name,
                email: staff.email,
                phone: staff.phone,
                gender: staff.gender,
                date_of_birth: moment(staff.date_of_birth).format("MM/DD/YYYY"),
                image: staff.image,
                status: staff.status,
                staff_id: staff.Staff.staff_id,
                building_id: staff.Staff.building_id
            } : {}
        });
    } catch (error) {
        reject(error)
    }
})

export const updateStaffService = (id, data) => new Promise(async (resolve, reject) => {
    try {

        const isDuplicated = await db.User.findOne({
            where: {
                [Op.or]: [
                    {
                        email: data.email
                    },
                    {
                        phone: data.phone
                    }   
                ],
                user_id: { [Op.ne]: id }
            },
            raw: true
        });

        if(isDuplicated){
            const field = isDuplicated.email === data.email ? "Email" : "Phone";
            return resolve({
                err: 1,
                message: `${field} is already used`
            })
        }

        const staff = await db.User.findOne({
            where: {
                user_id: id,
                role_id: 3
            },
            raw: true
        });

        if(!staff) return resolve({
            err: 1,
            message: "Staff not found"
        });

        if(data.password) data.password = hashPassword(data.password);

        await staff.update({
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

export const deleteStaffService = (id) => new Promise(async (resolve, reject) => {
    try {

        const user = await db.User.findOne({
            where: {user_id: id, role_id: 3},
            raw: true
        })
        if(!user) return resolve({
            err: 1,
            message: "User not found"
        })
        if(user.status === "inactive") return resolve({
            err: 1,
            message: "Staff is already deleted"
        })
        user.status = "inactive";
        await user.save();

        resolve({
            err: 0,
            message: "Staff deleted"
        })
    } catch (error) {
        reject(error)
    }
})

export const assignStaffToBuildingService = async (id, building_id) => new Promise(async (resolve, reject) => {
    try {

        const [staff, isBuildingExist] = await Promise.all([
            db.User.findOne({
                where: {
                    user_id: id,
                    role_id: 3
                },
                include: [{
                    model: db.Staff,
                }],
                raw: true
            }), 
            db.Building.findOne({
                where: {
                    building_id: building_id
                },
                raw: true
            })
        ])
        if(!staff || staff.status == "inactive") return resolve({
            err: 1,
            message: "Staff is not exist"
        })
        if(!isBuildingExist) return resolve({
            err: 1,
            message: "Building is not exist"
        })
        staff.Staff.building_id = building_id;
        await staff.Staff.save();
        
        resolve({
            err: 0,
            message: 'Staff updated successfully!',
        })

    } catch (error) {
        reject(error)
    }
})