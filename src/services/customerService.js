import db from '../models'
import jwt from 'jsonwebtoken';
import moment from "moment";
import * as hashPassword from '../utils/hashPassword';


export const getProfile = (user) => new Promise(async (resolve, reject) => {
        try {
            const customer = await db.User.findOne({
                where: {
                    user_id: user.user_id
                },
                include: {
                    model: db.Customer,
                    attributes: {
                        exclude: ['created_at', 'updated_at', 'customer_id', 'createdAt', 'updatedAt']
                    }
                },
                attributes: {
                    exclude: ['password', 'created_at', 'updated_at', 'user_id', 'createdAt', 'updatedAt']
                },
                raw: true,
                nest: true
            });

            let isCustomerExist = !!customer;
            if (isCustomerExist) {
                customer.date_of_birth = moment(customer.date_of_birth).format('MM/DD/YYYY');
            }

            resolve({
                err: isCustomerExist ? 1 : 0,
                message: isCustomerExist ? 'Get profile successful' : 'Get profile failed',
                data: isCustomerExist ? {
                    ...customer
                } : {}
            })
        } catch
            (error) {
            reject(error)
        }
    })
;

const isDuplicate = async (model, field, value) => {
    const isDuplicated = await model.findOne({
        where: {
            [field]: value
        }
    });
    return !!isDuplicated;
}

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
            resolve({
                err: 0,
                message: 'User not found'
            })
        }

        user.set(
            {
                ...user,
                ...customerFields
            }
        );
        await user.save({transaction: t});
        await t.commit();
        resolve({
            err: 1,
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
            resolve({
                err: 0,
                message: 'User not found'
            })
        }

        const isPasswordCorrect = hashPassword.comparePassword(updateFields.current_password, user.password);

        if (!isPasswordCorrect) {
            resolve({
                err: 0,
                message: 'Current password is incorrect'
            })
        }

        user.password = hashPassword.hashPassword(updateFields.new_password);
        await user.save();

        resolve({
            err: 1,
            message: 'Update password successful'
        })
    } catch (error) {
        reject(error)
    }
})

export const updatePhone = (updateFields) => new Promise(async (resolve, reject) => {
    try {
        const isPhoneDuplicated = await db.User.findOne({
            where: {
                phone: updateFields.phone,
            }
        });
        let check = !!isPhoneDuplicated;
        if (check) resolve({
            err: 0,
            message: "Phone is already used"
        });

        const customer = await db.User.findOne({
            where: {
                user_id: updateFields.user_id
            }
        });

        if (!customer) {
            resolve({
                err: 0,
                message: 'User not found'
            })
        }

        customer.phone = updateFields.phone;
        await customer.save();

        resolve({
            err: 1,
            message: 'Update phone successful'
        })
    } catch (error) {
        reject(error)
    }
})

export const updateEmail = (newEmail, userId) => new Promise(async (resolve, reject) => {
    try {
        const isEmailDuplicated = await db.User.findOne({
            where: {
                email: newEmail,
            }
        });
        console.log(!!isEmailDuplicated);
        let check = !!isEmailDuplicated;

        if (check) resolve({
            err: 0,
            message: "Email is already used"
        });

        const user = await db.User.findOne({
            where: {
                user_id: userId
            }
        });

        if (!user) {
            resolve({
                err: 0,
                message: 'User not found'
            })
        }

        user.email = newEmail;
        await user.save();

        resolve({
            err: 1,
            message: 'Update email successful'
        })
    } catch (error) {
        reject(error)
    }
})

export const updateImage = (updateFields) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.User.findOne({
            where: {
                user_id: updateFields.user_id
            }
        });

        if (!user) {
            resolve({
                err: 0,
                message: 'User not found'
            })
        }

        user.image = updateFields.image;
        await user.save();

        resolve({
            err: 1,
            message: 'Update image successful'
        })
    } catch (error) {
        reject(error)
    }
})