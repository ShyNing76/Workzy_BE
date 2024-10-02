import Joi from "joi";
import {workspace_images} from "../../helper/joi_schema";
import {badRequest} from "../../middlewares/handle_error";
import * as services from "../../services";

export const createAmenityController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_name: Joi.string().required(),
            original_price: Joi.number().positive().required(),
        }).validate({amenity_name: req.body.amenity_name, original_price: req.body.original_price}).error;
        if(error) return badRequest(res, error);
        const response = await services.createAmenityService(req.body);
        return created(res, response);
    } catch (error) {
        internalServerError(res, error)
    }
}

export const updateAmenityController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_name: Joi.string().required(),
            original_price: Joi.number().required(),
        }).validate({amenity_name: req.body.amenity_name, original_price: req.body.original_price}).error;
        if(error) return badRequest(res, error);
        const response = await services.updateAmenityService(req.params.id, req.body);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const deleteAmenityController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_ids: Joi.array().required(),
        }).validate({amenity_ids: req.body.amenity_ids}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteAmenityService(req.body);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const getAllAmenityController = async (req, res) => {
    try {
        const amenity = await services.getAllAmenityService(req.query);
        return ok(res, amenity)
    } catch (error) {
        internalServerError(res, error)
    }
}

export const getAmenityByIdController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required()
        }).validate({
            id: req.params.id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.getAmenityByIdService(req.params.id);
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}