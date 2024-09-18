import db from '../models'
import jwt from 'jsonwebtoken';
import * as hashPassword from '../utils/hashPassword';

export const loginService = ({email, password}) => new Promise(async (resolve, reject) => {
    try {
        // Find the user equal email address in the database
        const user = await db.Account.findOne({
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
            email: user.email,
            id: user.id
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

export const registerService = ({email, password}) => new Promise(async (resolve, reject) => {
    try {
        const user = await db.Account.findOrCreate({
            where: {
                email
            },
            defaults: {
                email,
                password: hashPassword.hashPassword(password),
            }
        });

        const accessToken = jwt.sign({
            email: user.email,
            id: user.id
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        resolve({
            err: 1,
            message: user[1] ? 'Register successful' : 'Email already exists',
            accessToken: 'Bearer ' + accessToken
        })
    } catch (error) {
        reject(error)
    }
})