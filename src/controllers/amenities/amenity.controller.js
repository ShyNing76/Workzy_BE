import Joi from "joi";
import {badRequest, internalServerError, ok, created} from "../../middlewares/handle_error";
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
        console.log(error)
        if(error === "Amenity already exists") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const updateAmenityController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_name: Joi.string().required(),
            original_price: Joi.number().positive().required(),
        }).validate({amenity_name: req.body.amenity_name, original_price: req.body.original_price}).error;
        if(error) return badRequest(res, error);
        const response = await services.updateAmenityService(req.params.id, req.body);
        return ok(res, response)
    } catch (error) {
        if(error === "Amenity is already used"
            || error === "Cannot find any amenity to update") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const deleteAmenityController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.string().uuid().required(),
        }).validate({id: req.params.id}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteAmenityService(req.params.id);
        return ok(res, response)
    } catch (error) {
        if(error === "No Amenity Exist") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const getAllAmenityController = async (req, res) => {
    try {
        const amenity = await services.getAllAmenityService(req.query);
        return ok(res, amenity)
    } catch (error) {
        if(error === "No Amenity Exist") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const getAmenityByIdController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.string().uuid().required()
        }).validate({
            id: req.params.id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.getAmenityByIdService(req.params.id);
        return ok(res, response)
    } catch (error) {
        if(error === "No Amenity Exist") return badRequest(res, error);
        internalServerError(res, error)
    }
}

export const createBrokenAmenitiesBookingController = async (req, res) => {
    try {
        const error = Joi.object({
            amenity_name: Joi.array().required(),
        }).validate({amenity_name: req.body.amenity_name}).error;
        if(error) return badRequest(res, error);
        const response = await services.createBrokenAmenitiesBookingService(req.body);
        return created(res, response);
    } catch (error) {
        if(error === "Broken amenities created successfully") return badRequest(res, error);
        internalServerError(res, error)
    }
}