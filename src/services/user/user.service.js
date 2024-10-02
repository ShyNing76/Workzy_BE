import db from '../../models'
import moment from "moment";
import * as hashPassword from '../../utils/hashPassword';
import {isDuplicate} from '../../utils/checkDuplicate';


export const getProfile = (tokenUser) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({
            where: {
                user_id: tokenUser.user_id
            },
            attributes: {
                exclude: ['password', 'created_at', 'updated_at', 'createdAt', 'updatedAt']
            },
            raw: true,
            nest: true
        });

        let isCustomerExist = !!user;
        if (isCustomerExist) {
            user.date_of_birth = moment(user.date_of_birth).format('MM/DD/YYYY');
        }

        resolve({
            err: isCustomerExist ? 0 : 1,
            message: isCustomerExist ? 'Get profile successful' : 'Get profile failed',
            data: isCustomerExist ? {
                ...user
            } : {}
        })
    } catch(error) {
        reject(error)
    }
});

export const updateProfile = (updateFields) => new Promise(async (resolve, reject) => {
    const t = await db.sequelize.transaction();
    try {
        const {phone, email, password, ...customerFields} = updateFields;
        const user = await db.User.findOne({
            where: {
                user_id: updateFields.user_id
            }
        });
        if (!user) {
            return reject('User not found')
        }

        Object.assign(user, customerFields);

        await user.save({transaction: t});
        await t.commit();
        resolve({
            err: 0,
            message: 'Update profile successful'
        })
    } catch (error) {
        reject(error)
    }
});

export const updatePassword = (updateFields) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({
            where: {
                user_id: updateFields.user_id
            }
        });

        if (!user) {
            return reject('User not found')
        }

        const isPasswordCorrect = hashPassword.comparePassword(updateFields.current_password, user.password);

        if (!isPasswordCorrect) {
            return reject('Current password is incorrect')
        }

        user.password = hashPassword.hashPassword(updateFields.new_password);
        await user.save();

        resolve({
            err: 0,
            message: 'Update password successful'
        })
    } catch (error) {
        reject(error)
    }
});

export const updatePhone = (updateFields) => new Promise(async (resolve, reject) => {
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

        if (!customer) {
            return reject('User not found')
        }

        customer.phone = updateFields.phone;
        await customer.save();

        resolve({
            err: 0,
            message: 'Update phone successful'
        })
    } catch (error) {
        reject(error)
    }
});

export const updateEmail = (newEmail, userId) => new Promise(async (resolve, reject) => {
    try {
        const isEmailDuplicated = isDuplicate(db.User, 'email', newEmail);
        let check = await isEmailDuplicated;

        if (check) return reject("Email is already used");

        const user = await db.User.findOne({
            where: {
                user_id: userId
            }
        });

        if (!user) {
            return reject('User not found')
        }

        user.email = newEmail;
        await user.save();

        resolve({
            err: 0,
            message: 'Update email successful'
        })
    } catch (error) {
        reject(error)
    }
});

export const updateImage = (updateFields) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({
            where: {
                user_id: updateFields.user_id
            }
        });

        if (!user) {
            return reject('User not found')
        }

        user.image = updateFields.image;
        await user.save();

        resolve({
            err: 0,
            message: 'Update image successful'
        })
    } catch (error) {
        reject(error)
    }
});