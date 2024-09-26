import jwt from "jsonwebtoken";
import {notAuthorized} from "./handle_error";

require('dotenv').config();

export const verify_token = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return notAuthorized("No access token provided", res, false);
    }
    const accessToken = authHeader.split(' ')[1];

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return notAuthorized("Access token expired", res, true);
            }
            if (err instanceof jwt.JsonWebTokenError) {
                return notAuthorized("Invalid access token", res, false);
            }
            return notAuthorized("Token verification failed", res, false);
        }
        req.user = user;
        next();
    });
}

export const verify_admin = (req, res, next) => {
    if (req.user.role_id !== 1) { // Admin role_id is 1
        return notAuthorized("Unauthorized", res, false);
    }
    next();
}

export const verify_manager = (req, res, next) => {
    if (req.user.role_id !== 2) { // Manager role_id is 2
        return notAuthorized("Unauthorized", res, false);
    }
    next();
}

export const verify_staff = (req, res, next) => {
    if (req.user.role_id !== 3) { // Staff role_id is 3
        return notAuthorized("Unauthorized", res, false);
    }
    next();
}

export const verify_customer = (req, res, next) => {
    if (req.user.role_id !== 4) { // Customer role_id is 4
        return notAuthorized("Unauthorized", res, false);
    }
    next();
}

