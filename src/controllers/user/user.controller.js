import Joi from "joi";
import { email, phone } from "../../helper/joi_schema";
import {
    badRequest,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import * as services from "../../services";

export const getUser = async (req, res) => {
    try {
        const response = await services.getProfile(req.user);

        // Return the response
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const updateUser = async (req, res) => {
    try {
        const response = await services.updateProfile({
            ...req.body,
            ...req.user,
        });

        // Return the response
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const updatePassword = async (req, res) => {
    try {
        // Validate the request body
        const error = Joi.object({
            current_password: Joi.string().required(),
            new_password: Joi.string().required(),
        }).validate(req.body).error;
        if (error) return badRequest(res, error.message);
        const response = await services.updatePassword({
            ...req.body,
            ...req.user,
        });

        // Return the response
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const updatePhone = async (req, res) => {
    try {
        // Validate the request body
        const error = Joi.object({
            phone,
        }).validate(req.body).error;
        if (error) return badRequest(res, error.message);
        const response = await services.updatePhone({
            ...req.body,
            ...req.user,
        });

        // Return the response
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const updateEmail = async (req, res) => {
    try {
        // Validate the request body
        const error = Joi.object({
            email,
        }).validate(req.body).error;
        if (error) return badRequest(res, error.message);
        const response = await services.updateEmail(
            req.body.email,
            req.user.user_id
        );

        // Return the response
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const updateImage = async (req, res) => {
    try {
        const error = Joi.object({
            image: Joi.required(),
        }).validate({ image: req.file.firebaseUrl }).error;
        if (error) return badRequest(res, error.message);

        const response = await services.updateImage({
            image: req.file.firebaseUrl,
            user_id: req.user.user_id,
        });

        // Return the response
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const getTotalUserController = async (req, res) => {
    try {
        const response = await services.getTotalUserService();
        // Return the response
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}
