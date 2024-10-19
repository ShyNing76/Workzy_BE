import Joi from "joi";
import * as services from "../../services";
import {ok, created, badRequest, internalServerError} from "../../middlewares/handle_error";

export const createReviewController = async (req, res) => {
    try {
        const error = Joi.object({
            booking_id: Joi.required(),
        }).validate({booking_id: req.body.booking_id}).error;
        if(error) return badRequest(res, error);
        const workspace = await services.createReviewService(req.body);
        return created(res, workspace);
    } catch (error) {
        if(error.message === "Failed to create review" ||
            error.message === "Booking not found" ||
            error.message === "Booking is not completed" ||
            error.message === "Booking already cancelled"
        ) return badRequest(res, error);
       internalServerError(res, error);
    }
}

export const deleteReviewController = async (req, res) => {
    try {
        const error = Joi.object({
            review_id: Joi.required()
        }).validate({
            review_id: req.params.review_id
        }).error;
        if (error) return badRequest(res, error);
        const workspace = await services.deleteReviewService(req.params.review_id);
        return ok(res, workspace);
    } catch (error) {
        if(error === "Review not found") return badRequest(res, error);
        internalServerError(res, error);
    }
}

export const getAllReviewController = async (req, res) => {
    try {
        const response = await services.getAllReviewService(req.query);
        return ok(res, response);
    } catch (error) {
        if (error === "No Review Found") return badRequest(res, error);
        internalServerError(res, error);
    }
}

export const getReviewByIdController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required()
        }).validate({
            id: req.params.id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.getReviewByIdService(req.params.id);
        return ok(res, response);
    } catch (error) {
        if (error === "No Review Found") return badRequest(res, error);
        innerServerError(res, error);
    }
}
