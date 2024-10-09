import Joi from "joi";
import { badRequest, created, internalServerError, ok } from "../../middlewares/handle_error";
import * as services from "../../services";

export const createAmenitiesWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_ids: Joi.array().required(),
            workspace_id: Joi.string().uuid().required(),
        }).validate({amenity_ids: req.body.amenity_ids, workspace_id: req.body.workspace_id}).error;
        if(error) return badRequest(res, error);
        const response = await services.createAmenitiesWorkspaceService(req.body);
        return created(res, response);
    } catch (error) {
        if(error === "No valid amenities found"
            || error === "No valid workspace found"
            || error === "Error associating amenities with workspace") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const deleteAmenitiesWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            amenities_workspace_ids: Joi.array().required(),
        }).validate({amenities_workspace_ids: req.body.amenities_workspace_ids}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteAmenitiesWorkspaceService(req.body);
        return ok(res, response)
    } catch (error) {
        if(error === "No amenities-workspace records found to delete") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const getAmenitiesByWorkspaceIdController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_id: Joi.string().uuid().required(),
        }).validate({workspace_id: req.params.workspace_id}).error;
        if(error) return badRequest(res, error);
        console.log(req.params.workspace_id)
        const response = await services.getAmenitiesByWorkspaceIdService(req.params.workspace_id);
        return ok(res, response);
    } catch (error) {
        console.log(error)
        if(error === "No amenities found for this workspace") return badRequest(res, error);
        internalServerError(res, error)
    }
}