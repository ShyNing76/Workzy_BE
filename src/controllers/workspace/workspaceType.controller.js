import {badRequest, created, internalServerError, ok} from "../../middlewares/handle_error";
import {name} from "../../helper/joi_schema";
import * as services from "../../services";
import Joi from "joi";

export const createWorkspaceTypeController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_type_name: name
        }).validate({
            workspace_type_name: req.body.workspace_type_name
        }).error;
        if (error) return badRequest(res, error);

        const response = await services.createWorkspaceTypeService(req.body);
        return created(res, response);
    } catch (error) {
        if (error === "Workspace type name already exists") {
            return badRequest(res, error);
        }
        internalServerError(res, error);
    }
};

export const getAllWorkspaceTypeController = async (req, res) => {
    try {
        const response = await services.getAllWorkspaceTypeService(req.query);
        return ok(res, response);
    } catch (error) {
        if (error === "Failed to get workspace types") {
            return badRequest(res, error);
        }
        internalServerError(res, error);
    }
};

export const getWorkspaceTypeByIdController = async (req, res) => {
    try {
        const response = await services.getWorkspaceTypeService(req.params);
        return ok(res, response);
    } catch (error) {
        if (error === "Workspace type not found") {
            return badRequest(res, error);
        }
        internalServerError(res, error);
    }
};

export const updateWorkspaceTypeController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_type_name: name
        }).validate({
            workspace_type_name: req.body.workspace_type_name
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.updateWorkspaceTypeService(req.params, req.body);
        return ok(res, response);
    } catch (error) {
        if (error === "Workspace type not found") {
            return badRequest(res, error);
        }
        if (error === "Workspace type name already exists") {
            return badRequest(res, error);
        }
        internalServerError(res, error);
    }
};

export const deleteWorkspaceTypeController = async (req, res) => {
    try {
        const response = await services.deleteWorkspaceTypeService(req.params.id);
        return ok(res, response);
    } catch (error) {
        if (error === "Workspace type not found") {
            return badRequest(res, error);
        }
        internalServerError(res, error);
    }
}
