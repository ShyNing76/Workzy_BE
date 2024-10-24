import jwt from "jsonwebtoken";
import { notAuthorized } from "./handle_error";

require("dotenv").config();

export const verify_token = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return notAuthorized("No access token provided", res, false);
    }
    const accessToken = authHeader.split(" ")[1];

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
};

export const verify_role = (roles) => {
    const allowedRoles = [...roles]; // Copy mảng roles để tránh shared reference

    return (req, res, next) => {
        console.log(allowedRoles);

        const role_ids = {
            1: "admin",
            2: "manager",
            3: "staff",
            4: "customer",
        };

        const userRole = role_ids[req.user.role_id];

        if (!userRole || !allowedRoles.includes(userRole)) {
            return notAuthorized(
                `Access denied. Required roles: ${allowedRoles.join(", ")}`,
                res,
                false
            );
        } else {
            next();
        }
    };
};
