import {
    badRequest,
    created,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import { name } from "../../helper/joi_schema";
import * as services from "../../services";
import Joi from "joi";

export const createWorkspaceTypeController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_type_name: name,
        }).validate({
            workspace_type_name: req.body.workspace_type_name,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.createWorkspaceTypeService({
            ...req.body,
            image: req.file.firebaseUrl,
        });
        return created(res, response);
    } catch (error) {
        console.log(error);
        if (
            error === "Workspace type name already exists" ||
            error === "Failed to create workspace type"
        ) {
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
            workspace_type_name: name,
        }).validate({
            workspace_type_name: req.body.workspace_type_name,
        }).error;
        if (error) return badRequest(res, error);
        console.log(req.file.firebaseUrl);
        const response = await services.updateWorkspaceTypeService(req.params, {
            ...req.body,
            image: req.file?.firebaseUrl,
        });
        return ok(res, response);
    } catch (error) {
        console.log(error);
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
        console.log(req.params.id);
        const response = await services.updateWorkspaceTypeStatusService(
            req.params.id
        );
        return ok(res, response);
    } catch (error) {
        if (error === "Workspace type not found") {
            return badRequest(res, error);
        }
        internalServerError(res, error);
    }
};
