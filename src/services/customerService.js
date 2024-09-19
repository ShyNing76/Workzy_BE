import db from '../models'
import jwt from 'jsonwebtoken';

export const getProfile = (accessToken) => new Promise(async (resolve, reject) => {
    try {
        jwt.verify(accessToken.split(' ')[1], process.env.JWT_SECRET, async (err, decoded) => {
            console.log(decoded)
            if (err) {
                resolve({
                    err: 0,
                    message: 'Invalid access token'
                })
            } else {
                const customer = await db.Account.findOne({
                    where: {
                        account_id: decoded.account_id
                    },
                    raw: true
                });

                resolve({
                    err: 1,
                    message: 'Get profile successful',
                    data: {
                        email: customer.email,
                        name: customer.name,
                        role: customer.role,
                        status: customer.status
                    }
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
                let isUpdated = false;
                const {password, ...fieldsToUpdate} = updateFields;

                const affectedRows = await db.Account.update(fieldsToUpdate, {
                    where: {
                        account_id: decoded.account_id
                    }
                });

                const [customer, created] = await db.Customer.findOrCreate({
                    where: {
                        customer_id: decoded.account_id
                    },
                    defaults: {
                        account_id: decoded.account_id,
                        ...fieldsToUpdate
                    }
                });
                console.log(affectedRows)
                isUpdated = affectedRows[0] > 0;

                if (!created) {
                    isUpdated = await db.Customer.update(fieldsToUpdate, {
                        where: {
                            customer_id: decoded.account_id
                        }
                    }) > 0 || isUpdated;
                }

                resolve({
                    err: isUpdated ? 1 : 0,
                    message: isUpdated ? 'Update profile successful' : 'Update profile failed',
                    data: isUpdated ? {
                        ...updateFields
                    } : {}
                })
            }
        })
    } catch (error) {
        reject(error)
    }
});