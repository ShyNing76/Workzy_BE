import Joi from "joi";
import {name, email, password, phone} from "../../helper/joi_schema";
import {badRequest , created, internalServerError, ok} from "../../middlewares/handle_error";
import * as services from "../../services";

export const createStaffController = async (req, res) => {
    try {
        const error = Joi.object({
            name,
            email,
            password,
            phone
        }).validate(req.body).error;
        if (error) return badRequest(res, error.details[0].message);
        const response = await services.createStaffService(req.body);
        return created(res, response);
    } catch (error) {
        if(error === "Email is already used"
            || error === "Phone is already used") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const getStaffByIdController = async (req, res) => {
    try {
        const response = await services.getStaffByIdService(req.params.id);
        return ok(res, response)
    } catch (error) {
        if(error === "No Staff Exist") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const getAllStaffController = async (req, res) => {
    try {
        const response = await services.getAllStaffService(req.query);
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error)
    }
}

export const updateStaffController = async (req, res) => {
    try {
        const error = Joi.object({
            email,
            phone,
        }).validate({email: req.body.email, phone: req.body.phone}).error;
        if (error) return badRequest(res, error.details[0].message);
        const response = await services.updateStaffService(req.params.id, req.body);
        return ok(res, response)    
    } catch (error) {
        if(error === "Email is already used"
            || error === "Phone is already used"
            || error === "Staff not found") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const deleteStaffController = async (req, res) => {
    try {
        const response = await services.deleteStaffService(req.params.id);
        return ok(res, response)    
    } catch (error) {
        if(error === "Staff not found"
            || error === "Building is not exist") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const assignStaffToBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
            building_id: Joi.required()
        }).validate({
            id: req.params.id,
            building_id: req.body.building_id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.assignStaffToBuildingService(req.params.id, req.body.building_id);
        return ok(res, response)    
    } catch (error) {
        if(error === "Staff not found"
            || error === "Building is not exist") return badRequest(res, error);
        internalServerError(res, error)
    }
}