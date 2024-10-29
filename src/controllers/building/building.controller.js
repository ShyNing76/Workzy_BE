import {
    badRequest,
    created,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import { address, name, location } from "../../helper/joi_schema";
import * as services from "../../services";
import Joi from "joi";

export const getBuildingController = async (req, res) => {
    try {
        const response = await services.getBuildingService(req.query);
        return ok(res, response);
    } catch (error) {
        if (error === "No building found") return badRequest(res, error);
        internalServerError(res, error);
    }
};

export const getBuildingByIdController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
        }).validate({
            id: req.params.id,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.getBuildingByIdService(req.params.id);
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const createBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            building_name: name,
            location: location,
            address: address,
            images: Joi.required(),
        }).validate({
            building_name: req.body.building_name,
            location: req.body.location,
            address: req.body.address,
            images: req.images,
        }).error;
        if (error) return badRequest(res, error);

        const response = await services.createBuildingService({
            ...req.body,
            images: req.images,
        });
        return created(res, response);
    } catch (error) {
        const knownError = [
            "Building name already exists",
            "Building location already exists",
            "Building address already exists",
            "Building image(s) already exist for this building",
        ];
        if (knownError.includes(error)) return badRequest(res, error);
        internalServerError(res, error);
    }
};

export const updateBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
            building_name: name,
            location: location,
            address: address,
            images: Joi.required(),
        }).validate({
            id: req.params.id,
            building_name: req.body.building_name,
            location: req.body.location,
            address: req.body.address,
            images: req.images,
        }).error;
        if (error) return badRequest(res, error);
        console.log;
        const response = await services.updateBuildingService(
            req.params.id,
            req.images,
            req.body
        );
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const assignManagerController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
            manager_id: Joi.required(),
        }).validate({
            id: req.params.id,
            manager_id: req.body.manager_id,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.assignManagerService(
            req.params.id,
            req.body.manager_id
        );
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const deleteBuildingImageController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
            images: Joi.required(),
        }).validate({
            id: req.params.id,
            images: req.body.images,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.deleteBuildingImageService(
            req.params.id,
            req.body.images
        );
        return ok(res, response);
    } catch (error) {
        if (error === "Building not found") return badRequest(res, error);
        internalServerError(res, error);
    }
};

export const removeManagerController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
        }).validate({
            id: req.params.id,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.removeManagerService(req.params.id);
        res.json(response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const updateBuildingStatusController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
            status: Joi.string().valid("active", "inactive").required(),
        }).validate({
            id: req.params.id,
            status: req.body.status,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.updateBuildingStatusService(
            req.params.id,
            req.body.status
        );
        res.json(response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const deleteBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
        }).validate({
            id: req.params.id,
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.deleteBuildingService(req.params.id);
        res.json(response);
    } catch (error) {
        if (error === "Building not found") return badRequest(res, error);
        internalServerError(res, error);
    }
};


export const getTotalBuildingController = async (req, res) => {
    try {
        const response = await services.getTotalBuildingService();
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}