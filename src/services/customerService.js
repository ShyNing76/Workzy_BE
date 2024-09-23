import db from '../models'
import jwt from 'jsonwebtoken';

export const getProfile = (accessToken) => new Promise(async (resolve, reject) => {
    try {
        jwt.verify(accessToken.split(' ')[1], process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                resolve({
                    err: 0,
                    message: 'Invalid access token'
                })
            } else {
                const customer = await db.User.findOne({
                    where: {
                        user_id: decoded.user_id
                    },
                    include: {
                        model: db.Customer,
                        attributes: {
                            exclude: ['created_at', 'updated_at', 'customer_id', 'createdAt', 'updatedAt']
                        }
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
            }
        })
    } catch (error) {
        reject(error)
    }
});

export const updateProfile = (accessToken, updateFields) => new Promise(async (resolve, reject) => {
    try {
        jwt.verify(accessToken.split(' ')[1], process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                resolve({
                    err: 0,
                    message: 'Invalid access token'
                })
            } else {
                let isUpdated = await db.Customer.update({
                    ...updateFields
                }, {
                    where: {
                        user_id: decoded.user_id
                    }
                });

                resolve({
                    err: isUpdated[0] ? 1 : 0,
                    message: isUpdated[0] ? 'Update profile successful' : 'Update profile failed'
                })
            }
        })
    } catch (error) {
        reject(error)
    }
});