import {badRequest, internalServerError} from "../middlewares/handle_error";
import {address, name, location} from "../helper/joi_schema";
import * as services from "../services";
import Joi from "joi";

export const createBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            building_name: name,
            location: location,
            address: address,
        }).validate({
            building_name: req.body.building_name,
            location: req.body.location,
            address: req.body.address
        }).error;
        if (error) return badRequest(res, error);

        const response = await services.createBuildingService(req.body);
        res.status(201).json(response);
    } catch (error) {
        internalServerError(res, error);
    }
}

export const updateBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            building_name: name,
            location: location,
            address: address,
            description: Joi.string().required(),
            rating: Joi.number().required(),
            status: Joi.string().pattern(new RegExp('active|inactive')).required()
        }).validate(req.body).error;
        if (error) return badRequest(res, error);

        const response = await services.updateBuildingService(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        internalServerError(res, error);
    }
}