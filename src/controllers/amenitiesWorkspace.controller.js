import Joi from "joi";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

export const createAmenitiesWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_ids: Joi.array().required(),
            workspace_id: Joi.string().uuid().required(),
        }).validate({workspace_id: req.params.workspace_id, amenity_ids: req.body.amenity_ids}).error;
        if(error) return badRequest(res, error);
        const response = await services.createAmenitiesWorkspaceService(req.body, req.params.workspace_id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const deleteAmenitiesWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            amenities_workspace_ids: Joi.array().required(),
        }).validate({amenities_workspace_ids: req.body.amenities_workspace_ids}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteAmenitiesWorkspaceService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}