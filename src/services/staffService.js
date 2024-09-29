import db from "../models";
import {Op} from "sequelize";
import moment from "moment";
import {v4} from "uuid"; 
import {hashPassword} from "../utils/hashPassword";

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
            const field = isDuplicated.email == data.email ? "Email" : "Phone";
            return resolve({
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
            include: db.Staff, 
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
        if (order) queries.order = [order || "email"];
        if (name) query.name = { [Op.substring]: name };

        const staffs = await db.User.findAndCountAll({
            where: {
            role_id: 3,
                ...query, 
            },
            ...queries,
            attributes: {
                exclude: ["building_id","createdAt", "updatedAt"]
            },
            include: [
                {
                    model: db.Staff,
                    attributes: {exclude: ["building_id","createdAt", "updatedAt"]},
                    include: [
                        {
                            model: db.Building,
                            attributes: {exclude : ["createdAt", "updatedAt"]},
                        },
                    ]
                }, 
            ],
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
                exclude: ["createdAt", "updatedAt"]
            },
            include: {
                model: db.Staff,
                attributes: {
                   exclude: ["buildingId","staff_id","createdAt","updatedAt"]
                },
                include: {
                    model: db.Building,
                    attributes: {
                        exclude: ["buildingId","manager_id","status","createdAt","updatedAt"]
                    },
                }
            }
        });
        resolve({
            err: staff ? 0 : 1,
            message: staff ? "Got" : "No Staff Exist",
            data: staff
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
            }
        });

        if(isDuplicated){
            const field = isDuplicated.email == data.email ? "Email" : "Phone";
            return resolve({
                err: 1,
                message: `${field} is already used`
            })
        }

        const staff = await db.User.findOne({
            where: {
                user_id: id,
                role_id: 3
            }
        });

        if(!staff) return resolve({
            err: 1,
            message: "Staff not found"
        });
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

export const updateStaffProfileService = (id, data) => new Promise(async (resolve, reject) => {
    try {
        const staff = await db.User.findOne({
            where: {
                user_id: id,
                role_id: 3
            }
        });

        if(!staff) return resolve({
            err: 1,
            message: "Staff not found"
        });

        await staff.update({
            ...data
        })
        resolve({
            err: 0,
            message: "Update Successfully"
        })

    } catch (error) {
        reject(error)
    }
})

export const updateStaffPasswordService = (id, password) => new Promise(async (resolve, reject) => {
    try {
        const staff = await db.User.findOne({
            where: {
                user_id: id,
                role_id: 3
            }
        });

        if(!staff) return resolve({
            err: 1,
            message: "Staff not found"
        });

        staff.password = password;
        await staff.save();
        resolve({
            err: 0,
            message: "Update Successfully"
        })

    } catch (error) {
        reject(error)
    }
})

export const deleteStaffService = ({ids}) => new Promise(async (resolve, reject) => {
    try {

        const user = await db.User.findOne({
            where: {user_id: ids, role_id: 3}
        })
        if(!user) return resolve({
            err: 0,
            message: "User not found"
        })

        const staff = await db.Staff.destroy({
            where : {user_id : ids}
        });

        await user.destroy({
            where : {user_id : ids}
        });

        resolve({
            err: staff > 0  && user > 0 ? 0 : 1,
            message: staff > 0  && user > 0 ? `${staff} deleted` : "Cannot delete staff"
        })
    } catch (error) {
        reject(error)
    }
})

export const assignStaffToBuildingService = async (id, building_id) => new Promise(async (resolve, reject) => {
    try {

        const [staff, isBuildingExist] = await Promise.all([
            db.Staff.findOne({
                where: {
                    staff_id: id
                }
            }), 
            db.Building.findOne({
                where: {
                    building_id: building_id
                }
            })
        ])
        if(!staff) return resolve({
            err: 1,
            message: "Staff is not exist"
        })
        if(!isBuildingExist) return resolve({
            err: 1,
            message: "Building is not exist"
        })

        staff.building_id = building_id;
        await staff.save();
        
        resolve({
            err: 0,
            message: 'Staff updated successfully!',
        })

    } catch (error) {
        reject(error)
    }
})