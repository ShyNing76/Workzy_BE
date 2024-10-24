import Joi from "joi";
import { workspace_name, workspace_price } from "../../helper/joi_schema";
import {
    badRequest,
    created,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import * as services from "../../services";

export const createWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_name,
            workspace_price,
            images: Joi.required(),
        }).validate({
            workspace_name: req.body.workspace_name,
            workspace_price: req.body.workspace_price,
            images: req.images,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.createWorkspaceService({
            ...req.body,
            images: req.images,
        });
        return created(res, response);
    } catch (error) {
        if (error === "Workspace already exists") return badRequest(res, error);

        internalServerError(res, error);
    }
};

export const updateWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_name,
            workspace_price,
            building_id: Joi.required(),
            workspace_type_id: Joi.required(),
            images: Joi.required(),
        }).validate({
            workspace_name: req.body.workspace_name,
            workspace_price: req.body.workspace_price,
            building_id: req.body.building_id,
            workspace_type_id: req.body.workspace_type_id,
            images: req.images,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.updateWorkspaceService(req.params.id, {
            ...req.body,
            images: req.images,
        });
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const deleteImageOfWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            images: Joi.required(),
        }).validate({ images: req.body.images }).error;
        if (error) return badRequest(res, error);
        const response = await services.deleteImageOfWorkspaceService(
            req.params.id,
            req.body.images
        );
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}

export const deleteWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_id: Joi.string().uuid().required(),
        }).validate({ workspace_id: req.params.id }).error;
        if (error) return badRequest(res, error);
        const response = await services.deleteWorkspaceService(req.params.id);
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const getAllWorkspaceController = async (req, res) => {
    try {
        const response = await services.getAllWorkspaceService(req.query);
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const getWorkspaceByIdController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.string().required(),
        }).validate({
            id: req.params.id,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.getWorkspaceByIdService(req.params.id);
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const assignWorkspaceToBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_ids: Joi.array().required(),
            building_id: Joi.required(),
        }).validate({
            workspace_ids: req.body.workspace_ids,
            building_id: req.params.building_id,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.assignWorkspacetoBuildingService({
            building_id: req.params.building_id,
            workspace_ids: req.body.workspace_ids
        });
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const unassignWorkspaceToBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_ids: Joi.array().required(),
            building_id: Joi.required(),
        }).validate({
            workspace_ids: req.body.workspace_ids,
            building_id: req.params.building_id,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.unassignWorkspacetoBuildingService({
            building_id: req.params.building_id,
            workspace_ids: req.body.workspace_ids
        });
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const getTotalWorkspaceController = async (req, res) => {
    try {
        const response = await services.getTotalWorkspaceService(req.user);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
};

export const getTotalWorkspaceNotInBookingController = async (req, res) => {
    try {
        const response = await services.getTotalWorkspaceNotInBookingService();
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}

export const getTop5WorkspaceReviewController = async (req, res) => {
    try {
        const response = await services.getTop5WorkspaceReviewService();
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}
