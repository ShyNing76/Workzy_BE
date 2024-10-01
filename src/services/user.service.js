import db from '../models'
import moment from "moment";
import {hashPassword} from '../utils/hashPassword';
import {isDuplicate} from '../utils/checkDuplicate';


export const updateUserProfileService = (updateFields) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({
            where: {
                user_id: updateFields.user_id
            }
        });

        if(!user) return resolve({
            err: 1,
            message: "User not found"
        });
        await staff.update({
            ...updateFields
        })
        resolve({
            err: 0,
            message: "Update Successfully"
        })

    } catch (error) {
        reject(error)
    }
})

export const updateUserPassword = (updateFields) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({
            where: {
                user_id: updateFields.user_id
            }
        });

        if (!user) {
            resolve({
                err: 1,
                message: 'User not found'
            })
        }

        user.password = hashPassword(updateFields.password);
        await user.save();

        resolve({
            err: 0,
            message: 'Update password successful'
        })
    } catch (error) {
        reject(error)
    }
})

export const updateUserPhone = (updateFields) => new Promise(async (resolve, reject) => {
    try {
        const isPhoneDuplicated = isDuplicate(db.User, 'phone', updateFields.phone);
        let check = await isPhoneDuplicated;
        if (check) return resolve({
            err: 1,
            message: "Phone is already used"
        });

        const customer = await db.User.findOne({
            where: {
                user_id: updateFields.user_id
            }
        });

        if (!customer) return resolve({err: 1, message: 'User not found'})

        customer.phone = updateFields.phone;
        await customer.save();

        resolve({
            err: 0,
            message: 'Update phone successful'
        })
    } catch (error) {
        reject(error)
    }
})

export const updateUserEmail = (newEmail, userId) => new Promise(async (resolve, reject) => {
    try {
        const isEmailDuplicated = isDuplicate(db.User, 'email', newEmail);
        let check = await isEmailDuplicated;

        if (check) return resolve({
            err: 1,
            message: "Email is already used"
        });

        const user = await db.User.findOne({
            where: {
                user_id: userId
            },
            raw: true
        });

        if (!user) return resolve({err: 1, message: 'User not found'})

        user.email = newEmail;
        await user.save();

        resolve({
            err: 0,
            message: 'Update email successful'
        })
    } catch (error) {
        reject(error)
    }
})

export const updateUserImage = (updateFields) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({
            where: {
                user_id: updateFields.user_id
            }
        });

        if (!user) return resolve({err: 1, message: 'User not found'})

        user.image = updateFields.image;
        await user.save();

        resolve({
            err: 0,
            message: 'Update image successful'
        })
    } catch (error) {
        reject(error)
    }
})
