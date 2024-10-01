import Joi from "joi";
import {workspace_images} from "../helper/joi_schema";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

export const createAmenityController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_name: Joi.string().required(),
            original_price: Joi.number().positive().required(),
        }).validate({amenity_name: req.body.amenity_name, original_price: req.body.original_price}).error;
        if(error) return badRequest(res, error);
        const response = await services.createAmenityService(req.body);
        return res.status(201).json(response);
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
        const response = await services.updateAmenityService(req.params.id, req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const deleteAmenityController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_ids: Joi.array().required(),
        }).validate({amenity_ids: req.query.amenity_ids}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteAmenityService(req.query);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const getAllAmenityController = async (req, res) => {
    try {
        const amenity = await services.getAllAmenityService(req.query);
        return res.status(200).json(amenity);
    } catch (error) {
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
        const response = await services.getAmenityByIdService(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}