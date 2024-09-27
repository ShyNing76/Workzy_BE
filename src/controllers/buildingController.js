import {badRequest, internalServerError} from "../middlewares/handle_error";
import {address, name, location} from "../helper/joi_schema";
import * as services from "../services";
import Joi from "joi";

export const getBuildingController = async (req, res) => {
    try {
        const response = await services.getBuildingService(req.query);
        res.json(response);
    } catch (error) {
        internalServerError(res, error);
    }
}

export const getBuildingByIdController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required()
        }).validate({
            id: req.params.id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.getBuildingByIdService(req.params.id);
        res.json(response);
    } catch (error) {
        internalServerError(res, error);
    }
}

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
            id: Joi.required(),
            building_name: name,
            location: location,
            address: address,
        }).validate({
            id: req.params.id,
            building_name: req.body.building_name,
            location: req.body.location,
            address: req.body.address
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.updateBuildingService(req.params.id, req.body);
        res.json(response);
    } catch (error) {
        console.log(error);
        internalServerError(res, error);
    }
}

export const assignManagerController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
            manager_id: Joi.required()
        }).validate({
            id: req.params.id,
            manager_id: req.body.manager_id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.assignManagerService(req.params.id, req.body.manager_id);
        res.json(response);
    } catch (error) {
        internalServerError(res, error);
    }
}
export const updateBuildingStatusController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
            status: Joi.string().valid('active', 'inactive').required()
        }).validate({
            id: req.params.id,
            status: req.body.status
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.updateBuildingStatusService(req.params.id, req.body.status);
        res.json(response);
    } catch (error) {
        internalServerError(res, error);
    }
}

export const deleteBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required()
        }).validate({
            id: req.params.id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.deleteBuildingService(req.params.id);
        res.json(response);
    } catch (error) {
        internalServerError(res, error);
    }
}