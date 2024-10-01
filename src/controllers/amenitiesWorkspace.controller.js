import Joi from "joi";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

export const createAmenitiesWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_id: Joi.array().required(),
            workspace_id: Joi.required(),
        }).validate({workspace_id: req.body.workspace_id, amenity_id: req.query.amenity_id}).error;
        if(error) return badRequest(res, error);
        const amenity = await services.createAmenitiesWorkspaceService(req.query, req.body.workspace_id);
        return res.status(201).json({amenity});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const deleteAmenitiesWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            amenities_workspace_ids: Joi.array().required(),
        }).validate({amenities_workspace_ids: req.query.amenities_workspace_ids}).error;
        if(error) return badRequest(res, error);
        const amenity = await services.deleteAmenitiesWorkspaceService(req.query);
        return res.status(201).json({amenity});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}