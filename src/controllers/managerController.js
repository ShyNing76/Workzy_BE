import Joi from "joi";
import {email, password, name} from "../helper/joi_schema";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

export const createManagerController = async (req, res) => {
    try {
        const error = Joi.object({
            email,
            password,
        }).validate({email: req.body.email, password: req.body.password}).error;
        if (error) return badRequest(res, error.details[0].message);

        const response = await services.createManagerService(req.body);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const getManagerByIdController = async (req, res) => {
    try {
        const response = await services.getManagerByIdService(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const getAllManagersController = async (req, res) => {
    try {
        const error = Joi.object({
            order: Joi.string().valid("email", "name", "role_id", "status"),
        }).validate({order: req.query}).error;

        const response = await services.getAllManagersService(req.query);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const updateManagerController = async (req, res) => {
    try {
        const response = await services.updateManagerService(req.params.id, req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const deleteManagerController = async (req, res) => {
    try {
        const response = await services.deleteManagerService(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}