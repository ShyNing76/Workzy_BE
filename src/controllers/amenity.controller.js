import Joi from "joi";
import {workspace_images} from "../helper/joi_schema";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

export const createAmenityController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_name: Joi.string().required(),
            original_price: Joi.number().required(),
        }).validate({workspace_id: req.body.workspace_id, workspace_images: req.body.workspace_images}).error;
        if(error) return badRequest(res, error);
        const amenity = await services.createAmenityService(req.body);
        return res.status(201).json({amenity});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const updateAmenityController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_name: Joi.string().required(),
            original_price: Joi.number().required(),
        }).validate({amenity_name: req.body.amenity_name, original_price: req.body.original_price}).error;
        if(error) return badRequest(res, error);
        const amenity = await services.updateAmenityService(req.params.id, req.body);
        return res.status(201).json({amenity});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const deleteAmenityController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_id: Joi.array().required(),
        }).validate({amenity_id: req.query.amenity_id}).error;
        if(error) return badRequest(res, error);
        const amenity = await services.deleteAmenityService(req.query);
        return res.status(201).json({amenity});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const getAllAmenityController = async (req, res) => {
    try {
        const amenity = await services.getAllAmenityService(req.query);
        return res.status(200).json(amenity);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
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
        const amenity = await services.getAmenityByIdService(req.params.id);
        return res.status(200).json(amenity);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}