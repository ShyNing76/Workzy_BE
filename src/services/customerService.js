import db from '../models'
import jwt from 'jsonwebtoken';

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

export const updateProfile = (updateFields) => new Promise(async (resolve, reject) => {
    try {
        const customer = await db.Customer.update(updateFields, {
            where: {
                user_id: updateFields.user_id
            }
        });

        let isCustomerExist = !!customer;
        resolve({
            err: isCustomerExist ? 1 : 0,
            message: isCustomerExist ? 'Update profile successful' : 'Update profile failed',
        })
    } catch (error) {
        reject(error)
    }
});