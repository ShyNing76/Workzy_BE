import db from "../../models";
import { handleLimit, handleOffset, handleSortOrder } from "../../utils/handleFilter";
import { v4 } from "uuid";
import { Op } from "sequelize";

export const createVoucherService = ({voucher_name, voucher_code, description, discount, quantity, expired_date}) => new Promise(async (resolve, reject) => {
    try {
        const [voucher, created] = await db.Voucher.findOrCreate({
            where: {
                voucher_code : voucher_code
            }, 
            defaults: {
                voucher_id: v4(), 
                voucher_name : voucher_name, 
                voucher_code : voucher_code, 
                description : description,
                discount : discount, 
                quantity : quantity,
                expired_date : expired_date,
                status : "active"
            }
        });
        if(!created) return reject("Voucher already exists");
        resolve({
            err: 0,
            message: "Create voucher successfully",
        });
    } catch (error) {
        reject(error);
    }
})

export const getAllVoucherService = ({page, limit, order, status, ...query}) => new Promise(async (resolve, reject) => {
    try {
        query.status = status ? status : {[Op.ne]: null};
        const vouchers = await db.Voucher.findAndCountAll({
            where: query,
            offset: handleOffset(page, limit),
            limit: handleLimit(limit),
            order: [handleSortOrder(order, "voucher_name")],
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            raw: true,
            nest: true
        });
        if(vouchers.count === 0) return reject("No Voucher Exist");
        resolve({
            err: 0,
            message: "Get all vouchers successfully",
            data: vouchers
        });
    } catch (error) {
        console.log(error);
        reject(error);
    }
})

export const getVoucherByIdService = (voucher_id) => new Promise(async (resolve, reject) => {
    try {
        const voucher = await db.Voucher.findOne({where: {voucher_id}, attributes: {exclude: ["createdAt", "updatedAt"]}, raw: true, nest: true});
        if(!voucher) return reject("Voucher not found");
        resolve({
            err: 0,
            message: "Get voucher by id successfully",
            data: voucher
        });
    } catch (error) {
        reject(error);
    }
})

export const updateVoucherService = (voucher_id, {voucher_name, voucher_code, description, discount, quantity, expired_date, status}) => new Promise(async (resolve, reject) => {
    try {
        const updatedColumns = {};
        if(voucher_name) updatedColumns.voucher_name = voucher_name;
        if(voucher_code) updatedColumns.voucher_code = voucher_code;
        if(description) updatedColumns.description = description;
        if(discount) updatedColumns.discount = discount;
        if(quantity) updatedColumns.quantity = quantity;
        if(expired_date) updatedColumns.expired_date = expired_date;
        if(status) updatedColumns.status = status;
        const [updated, data] = await db.Voucher.update(updatedColumns, {where: {voucher_id}, returning: true});
        if(!updated) return reject("Update voucher failed");
        resolve({
            err: 0,
            message: "Update voucher successfully",
            data
        });
    } catch (error) {
        reject(error);
    }
})

export const deleteVoucherService = (voucher_id) => new Promise(async (resolve, reject) => {
    try {
        const deleted = await db.Voucher.update({status: "inactive"}, {where: {voucher_id, status: "active"}});
        if(!deleted) return reject("Delete voucher failed");
        resolve({
            err: 0,
            message: "Delete voucher successfully"
        });
    } catch (error) {
        reject(error);
    }
})
