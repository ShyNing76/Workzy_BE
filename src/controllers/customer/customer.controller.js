import Joi from "joi";
import {
    badRequest,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import * as services from "../../services";

export const getAllUsersController = async (req, res) => {
    try {
        const response = await services.getAllUsersService(req.query);

        // Return the response
        return ok(res, response);
    } catch (error) {
        console.log(error);
        if (error === "User not found") return badRequest(res, error);
        internalServerError(res, error);
    }
};

export const removeUserController = async (req, res) => {
    try {
        const response = await services.removeUserService(req.params.id);

        // Return the response
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const getMembershipController = async (req, res) => {
    try {
        const response = await services.getMembershipService(req.user);
        return ok(res, response);
    } catch (error) {
        console.log(error);
        if (error === "User not found") return badRequest(res, error);
        internalServerError(res, error);
    }
};

export const getUserByIdController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
        }).validate({ id: req.params.id }).error;
        if (error) return badRequest(res, error.message);
        const response = await services.getUserByIdService(req.params.id);
        return ok(res, response);
    } catch (error) {
        console.log(error);
        if (error === "User not found") return badRequest(res, error);
        internalServerError(res, error);
    }
};
