import db from '../models'
import jwt from 'jsonwebtoken';
import * as hashPassword from '../utils/hashPassword';
import {v4} from "uuid";
import {resolve} from "@babel/core/lib/vendor/import-meta-resolve";
import {reject} from "bcrypt/promises";

export const loginService = ({email, password}) => new Promise(async (resolve, reject) => {
    try {
        // Find the user equal email address in the database
        const user = await db.User.findOne({
            where: {
                email
            },
            raw: true
        });

        // Check if the user exists and the password is valid
        const isPasswordValid = user && hashPassword.comparePassword(password, user.password);
        // If the password is valid, generate an access token
        const accessToken = isPasswordValid ? jwt.sign({
            user_id: user.user_id,
            email: user.email,
            role_id: user.role_id
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        }) : null;

        resolve({
            err: accessToken ? 0 : 1,
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
                user_id: user.user_id,
                role_id: user.role_id
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            await db.Customer.create({
                customer_id: v4(),
                user_id: user.user_id,
                point: 0,
            }, {transaction: t})

            t.commit();

            resolve({
                err: 0,
                message: 'User registered successfully!',
                accessToken: 'Bearer ' + accessToken,
            })
        }
    } catch (error) {
        t.rollback();
        reject(error)
    }
});

export const loginGoogleService = (profile) => new Promise(async (resolve, reject) => {
    const t = await db.sequelize.transaction();
    try {
        const user = await db.User.findOrCreate({
            where: {
                email: profile.emails[0].value
            },
            defaults: {
                user_id: v4(),
                email: profile.emails[0].value,
                password: hashPassword.hashPassword(profile.id),
                name: profile.displayName,
                role_id: 4,
                google_token: profile.token
            },
            transaction: t
        });

        if (user[1]) {
            await db.Customer.create({
                customer_id: v4(),
                user_id: user[0].user_id,
                phone: "",
            }, {transaction: t})
        }else{
            await db.User.update({
                google_token: profile.token
            },{
                where: {
                    email: profile.emails[0].value
                },
                transaction: t
            })
        }

        t.commit();

        const accessToken = jwt.sign({
            email: user[0].email,
            user_id: user[0].user_id
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });


        resolve({
            err: 0,
            message: 'Login successful',
            accessToken: 'Bearer ' + accessToken
        })
    } catch (error) {
        reject(error)
    }
})