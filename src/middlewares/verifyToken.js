import jwt from "jsonwebtoken";
import {notAuthorized} from "./handle_error";

require('dotenv').config();

export const verify_token = (req, res, next) => {
    const accessToken = req.headers['authorization'];
    if (!accessToken) {
        return notAuthorized("No access token provided", res, false);
    }
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        const isChecked = err instanceof jwt.TokenExpiredError;
        if (isChecked) {
            return notAuthorized("Access token expired", res, true);
        }
        if (!isChecked)
            return notAuthorized("Invalid access token", res, false);
        req.user = user;
        next();
    });
}

