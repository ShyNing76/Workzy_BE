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
                const user = await db.Account.findOne({
                    where: {
                        account_id: decoded.account_id
                    },
                    raw: true
                });

                resolve({
                    err: 1,
                    message: 'Get profile successful',
                    data: {
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        status: user.status
                    }
                })
            }
        })
    } catch (error) {
        reject(error)
    }
});