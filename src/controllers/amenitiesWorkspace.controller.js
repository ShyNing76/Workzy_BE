import Joi from "joi";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

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
        internalServerError(res, error)
    }
}