import db from '../models'
import jwt from 'jsonwebtoken';
import * as hashPassword from '../utils/hashPassword';
import {v4} from "uuid";

export const loginService = ({email, password}) => new Promise(async (resolve, reject) => {
    try {
        // Find the user equal email address in the database
        const user = await db.User.findOne({
            where: {
                email
            },
            raw: true
        });

        console.log(user)

        // Check if the user exists and the password is valid
        const isPasswordValid = user && hashPassword.comparePassword(password, user.password);
        // If the password is valid, generate an access token
        const accessToken = isPasswordValid ? jwt.sign({
            user_id: user.user_id,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        }) : null;

        resolve({
            err: accessToken ? 1 : 0,
            message: accessToken ? 'Login successful' : 'Invalid email or password',
            accessToken: 'Bearer ' + accessToken
        })

    } catch (error) {
        reject(error)
    }
});

export const registerService = ({email, password, name}) => new Promise(async (resolve, reject) => {
    const t = await db.sequelize.transaction();

    try {
        const user = await db.User.findOne({
            where: {
                email
            },
            raw: true
        });

        if (user) {
            resolve({
                err: 0,
                message: 'Email already exists'
            })
        } else {
            const hash = hashPassword.hashPassword(password);

            const user = await db.User.create({
                user_id: v4(),
                email,
                password: hash,
                name,
                role_id: 4
            }, {transaction: t});
            const accessToken = jwt.sign({
                email: user.email,
                user_id: user.user_id
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            await db.Customer.create({
                customer_id: v4(),
                user_id: user.user_id,
                phone: "",
            }, {transaction: t})

            t.commit();

            resolve({
                err: 1,
                message: 'User registered successfully!',
                accessToken: 'Bearer ' + accessToken,
            })
        }
    } catch (error) {
        t.rollback();
        reject(error)
    }
})