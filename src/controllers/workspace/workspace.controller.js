import Joi from "joi";
import { workspace_name } from "../../helper/joi_schema";
import {
    badRequest,
    created,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import * as services from "../../services";

export const createWorkspaceController = async (req, res) => {
    try {
        const addAmenities = typeof req.body.addAmenities === 'string'
            ? JSON.parse(req.body.addAmenities)
            : req.body.addAmenities;
        const error = Joi.object({
            workspace_name,
            price_per_hour: Joi.number().integer().min(1).required(),
            price_per_day: Joi.number().integer().min(1).required(),
            price_per_month: Joi.number().integer().min(1).required(),
            building_id: Joi.string().uuid().required(),
            workspace_type_id: Joi.string().uuid().required(),
            images: Joi.required(),
            addAmenities: Joi.array().items(
                Joi.object({
                    amenity_id: Joi.string().required(),
                    quantity: Joi.number().integer().min(1).required()
                })
            ).required(),
        }).validate({
            workspace_name: req.body.workspace_name,
            price_per_hour: req.body.price_per_hour,
            price_per_day: req.body.price_per_day,
            price_per_month: req.body.price_per_month,
            building_id: req.body.building_id,
            workspace_type_id: req.body.workspace_type_id,
            images: req.images,
            addAmenities: addAmenities,
        }).error;
        if (error) return badRequest(res, error);
        console.log(req.body)
        const response = await services.createWorkspaceService({
            ...req.body,
            images: req.images,
            addAmenities: addAmenities,
        });
        return created(res, response);
    } catch (error) {
        if (error === "Workspace already exists") return badRequest(res, error);
        internalServerError(res, error);
    }
};

export const updateWorkspaceController = async (req, res) => {
    try {
        const addAmenities = typeof req.body.addAmenities === 'string'
            ? JSON.parse(req.body.addAmenities)
            : req.body.addAmenities;
        const error = Joi.object({
            workspace_name,
            price_per_hour: Joi.number().integer().min(1),
            price_per_day: Joi.number().integer().min(1),
            price_per_month: Joi.number().integer().min(1),
            building_id: Joi.string().uuid().required(),
            workspace_type_id: Joi.string().uuid().required(),
            addAmenities: Joi.array().items(
                Joi.object({
                    amenity_id: Joi.string().uuid().required(),
                    quantity: Joi.number().integer().min(1).required()
                })
            ).required(),
            images: Joi.required(),
        }).validate({
            workspace_name: req.body.workspace_name,
            price_per_hour: req.body.price_per_hour,
            price_per_day: req.body.price_per_day,
            price_per_month: req.body.price_per_month,
            building_id: req.body.building_id,
            workspace_type_id: req.body.workspace_type_id,
            addAmenities: addAmenities,
            images: req.images,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.updateWorkspaceService(req.params.id, req.images,{
            ...req.body,
            remove_images: req.body.remove_images,
            addAmenities: addAmenities,
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
        const error = Joi.object({
            building_id: Joi.string().uuid(),
        }).validate({
            building_id: req.query.building_id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);
        const response = await services.getTotalWorkspaceService(req.user, req.query.building_id);
        return ok(res, response)
    } catch (error) {
        if(error === "Building is required" ||
            error === "Manager does not belong to this building"
        ) return badRequest(res, error);
        internalServerError(res, error)
    }
};

export const getTotalWorkspaceNotInBookingController = async (req, res) => {
    try {
        const error = Joi.object({
            building_id: Joi.string().uuid().required(),
        }).validate({
            building_id: req.query.building_id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);
        const response = await services.getTotalWorkspaceNotInBookingService(req.query.building_id);
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}

export const getTotalUsageWorkspacesController = async (req, res) => {
    try {
        const error = Joi.object({
            building_id: Joi.string().uuid().required(),
        }).validate({
            building_id: req.query.building_id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);
        const response = await services.getTotalUsageWorkspacesService(req.query.building_id);
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
