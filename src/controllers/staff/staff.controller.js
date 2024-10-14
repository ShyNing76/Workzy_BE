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

export const getBookingTypeController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.string().uuid().required()
        }).validate({id: req.params.id}).error;
        if (error) return badRequest(res, error);
        const response = await services.getBookingTypeService(req.params.id);
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
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

export const getBuildingByStaffIdController = async (req, res) => {
    try {
        const response = await services.getBuildingByStaffIdService(req.user);
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

export const unactiveStaffController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.string().uuid().required(),
        }).validate({ id: req.params.id }).error;
        if (error) return badRequest(res, error);
        const response = await services.unactiveStaffService(req.params.id);
        return ok(res, response);
    } catch (error) {
        if (error === "No Staff Exist" || error === "Failed to remove building")
            return badRequest(res, error);
        internalServerError(res, error);
    }
};

export const activeStaffController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.string().uuid().required(),
        }).validate({ id: req.params.id }).error;
        if (error) return badRequest(res, error);
        const response = await services.activeStaffService(req.params.id);
        return ok(res, response);
    } catch (error) {
        if (error === "Staff not found") return badRequest(res, error);
        internalServerError(res, error);
    }
};

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
        if(error === "Staff is not exist"
            || error === "Building is not exist"
            || error === "Staff is already assigned to this building") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const removeStaffFromBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.string().uuid().required()
        }).validate({id: req.params.id}).error;
        if (error) return badRequest(res, error);
        const response = await services.removeStaffFromBuildingService(req.params.id);
        return ok(res, response)
    } catch (error) {
        if(error === "Staff is not exist"
            || error === "Failed to remove staff from building") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const getBookingStatusController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.string().uuid().required()
        }).validate({id: req.params.id}).error;
        if (error) return badRequest(res, error);
        const response = await services.getBookingStatusService(req.params.id);
        return ok(res, response)    
    } catch (error) {
        if (error === "Workspace cannot have booking")
            return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const changeBookingStatusController = async (req, res) => {
    try {
        const error = Joi.object({
            booking_id: Joi.string().uuid().required(),
            status: Joi.string().valid("paid", "check-in", "in-process", "check-out", "check-amenities", "completed", "cancelled").required()
        }).validate({booking_id: req.params.booking_id, status: req.body.status}).error;
        if (error) return badRequest(res, error);
        const response = await services.changeBookingStatusService(req.params.booking_id, req.body.status);
        return ok(res, response)    
    } catch (error) {
        if (error === "Booking not found"
            || error === "Failed to update booking status")
            return badRequest(res, error);
        internalServerError(res, error)
    }
}