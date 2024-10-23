import Joi from "joi";
import {workspace_name, workspace_price} from "../../helper/joi_schema";
import {badRequest , created, internalServerError, ok} from "../../middlewares/handle_error";
import * as services from "../../services";

export const createWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_name,
            workspace_price,
        }).validate({workspace_name: req.body.workspace_name, workspace_price: req.body.workspace_price}).error;
        if(error) return badRequest(res, error);
        console.log(req.images)
        const response = await services.createWorkspaceService({...req.body, images: req.images});
        return created(res, response);
    } catch (error) {
        internalServerError(res, error)
    }
}

export const updateWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_name,
            workspace_price,
            building_id: Joi.required(),
            workspace_type_id: Joi.required(),
        }).validate({workspace_name: req.body.workspace_name, workspace_price: req.body.workspace_price, building_id: req.body.building_id, workspace_type_id: req.body.workspace_type_id}).error;
        if(error) return badRequest(res, error);
        const response = await services.updateWorkspaceService(req.params.id, req.body);
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error)
    }
}

export const deleteWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_id: Joi.string().uuid().required()
        }).validate({workspace_id: req.params.id}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteWorkspaceService(req.params.id);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const getAllWorkspaceController = async (req, res) => {
    try {
        const response = await services.getAllWorkspaceService(req.query);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const getWorkspaceByIdController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.string().required(),
        }).validate({
            id: req.params.id,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.getWorkspaceByIdService(req.params.id);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const assignWorkspaceToBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
            building_id: Joi.required()
        }).validate({
            id: req.params.id,
            building_id: req.body.building_id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.assignWorkspacetoBuildingService(req.params.id, req.body.building_id);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const getTotalWorkspaceController = async (req, res) => {
    try {
        const response = await services.getTotalWorkspaceService(req.user);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}