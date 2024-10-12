import Joi from "joi";
import { email, password, phone } from "../../helper/joi_schema";
import { badRequest, created, internalServerError, ok } from "../../middlewares/handle_error";
import * as services from "../../services";

export const createManagerController = async (req, res) => {
    try {
        const error = Joi.object({
            email,
            password,
            phone
        }).validate({email: req.body.email, password: req.body.password, phone: req.body.phone}).error;
        if (error) return badRequest(res, error.details[0].message);

        const response = await services.createManagerService(req.body);
        return created(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}

export const getManagerByIdController = async (req, res) => {
    try {
        const response = await services.getManagerByIdService(req.params.id);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const getAllManagersController = async (req, res) => {
    try {
        const response = await services.getAllManagersService(req.query);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const updateManagerController = async (req, res) => {
    try {
        const error = Joi.object({
            email,
            phone,
        }).validate({email: req.body.email, phone: req.body.phone}).error;
        if (error) return badRequest(res, error.details[0].message);

        const response = await services.updateManagerService(req.params.id, req.body);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const deleteManagerController = async (req, res) => {
    try {
        const response = await services.deleteManagerService(req.params.id);
        return ok(res, response)
    } catch (error) {
        if(error === "Manager not found" || error === "Building not found") return badRequest(res, error);
        internalServerError(res, error)
    }
}