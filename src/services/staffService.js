import db from "../models";
import {Op} from "sequelize";
import moment from "moment";
import {v4} from "uuid"; 

export const createStaff = (data) => new Promise(async (resolve, reject) => {
    try {
        const isEmailDuplicated = db.User.findOne({
            where: {
                email: data.email,
            }
        });
        let checkEmail = !!isEmailDuplicated;
        if(checkEmail) resolve({
            err: 0,
            message: "Email is already used"
        });

        const isPhoneDuplicated = await db.Staff.findOne({
            where: {
                phone: data.phone,
            }
        });
        let checkPhone = !!isPhoneDuplicated;
        if(checkPhone) resolve({
            err: 0,
            message: "Phone is already used"
        });

        const staff = await db.User.create({
                user_id: v4(),
                name: data.name,
                email: data.email,
                password: data.password,
                role_id: 3,
                Staff: {
                    ...data,
                }
            },
            {
                include: db.Staff
            }, 
            {
                raw: true, nest: true
            } 
        );

        resolve({
            err: staff ? 1 : 0,
            message: staff ? "Staff created successfully" : "Cannot Create Staff",
            data: {
                user_id: staff.user_id,
                email: staff.email,
                name: staff.name,
                role_id: staff.role_id,
                status: staff.status,
                Staff: {
                    manager_id: staff.Staff.manager_id,
                    user_id: staff.Staff.user_id,
                    phone: staff.Staff.phone,
                    gender: staff.Staff.gender,
                    date_of_birth: moment(staff.Staff.date_of_birth).format("MM/DD/YYYY"),
                }
            }
        });
    } catch (error) {
        reject(error);
    }
})

export const getAllStaff = ({page, limit, order, name, ...query}) => new Promise(async (resolve, reject) => {
    try {
        const fLimit = limit ? Number(limit) : process.env.PAGE_LIMIT;
        const fPage = page ? Number(page) : 1;
        const name = name ? name : "";

        const staffs = await db.User.findAll({
            where: {
                query, 
                name: {
                    [Op.like] : name,
                },
                role_id: 2
            },
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

            order: [
                [order ? order : "email", "ASC"]
            ],
            limit: fLimit,
            offset: (fPage - 1) * fLimit,
            raw: true,
            nest: true,

        });

        let count = 0;
        staffs.forEach(staff => {
            staff.Staff.date_of_birth = moment(staff.Staff.date_of_birth).format("MM/DD/YYYY");
            count++;
        });

        resolve({
            err: staffs ? 0 : 1,
            message: staffs ? "Got" : "No Staff Exist",
            total: count,
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

export const updateStaff = (id, data) => new Promise((resolve, reject) => {
    try {
        // const isExist
    } catch (error) {
        reject(error)
    }
})