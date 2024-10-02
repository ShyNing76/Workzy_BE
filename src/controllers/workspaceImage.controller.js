import Joi from "joi";
import {workspace_images} from "../helper/joi_schema";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

export const createWorkspaceImageController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_images,
            workspace_id: Joi.number().required(),
        }).validate({workspace_id: req.body.workspace_id, workspace_images: req.body.workspace_images}).error;
        if(error) return badRequest(res, error);
        const response = await services.createWorkspaceImageService(req.body);
        return created(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const deleteWorkspaceImageController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_images,
        }).validate({workspace_images: req.query.workspace_images}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteWorkspaceImageService(req.query);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const getAllWorkspaceImageController = async (req, res) => {
    try {
        const response = await services.getAllWorkspaceImageService(req.query);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const getWorkspaceImageByWorkspaceIdController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required()
        }).validate({
            id: req.params.id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.getWorkspaceImageByWorkspaceIdService(req.params.id);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}