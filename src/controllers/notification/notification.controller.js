import {badRequest, created, internalServerError, noContent, notFound, ok} from "../../middlewares/handle_error";
import {type, description} from "../../helper/joi_schema";
import Joi from "joi";
import * as services from "../../services";

export const createNotificationController = async (req, res) => {
    try {
        const error = Joi.object({
            wishlist_id: Joi.string().uuid().required(),
            type,
            description
        }).validate({wishlist_id: req.body?.wishlist_id, type: req.body?.type, description: req.body?.description}).error;
        if (error) badRequest(res, error.message);

        const response = await services.createNotificationService(req.body);

        return created(res, response);
    } catch (error) {
        if(error.message === "Wishlist not found" ||
            error.message === "Workspace not found" ||
            error.message === "Customer not found") return notFound(res, error.message);
        internalServerError(res, error.message);
    }
};

export const createNotificationBySendEmailController = async (req, res) => {
    try {
        const response = await services.createNotificationBySendMailService(req.user);

        return created(res, response);
    } catch (error) {
        if(error.message === "Customer not found") return notFound(res, error.message);
        internalServerError(res, error.message);
    }
};

export const getNotificationByIdController = async (req, res) => {
    try {
        const response = await services.getNotificationByIdService(req.params.id);

        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}

export const getAllNotificationsController = async (req, res) => {
    try {
        const error = Joi.object({
            order: Joi.string().valid("type", "description"),
        }).validate({order: req.query?.order}).error;
        if (error) badRequest(res, error.message);

        const response = await services.getAllNotificationsService(req.query);

        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}

export const updateNotificationController = async (req, res) => {
    try {
        const error = Joi.object({
            type,
            description
        }).validate({type: req.body?.type, description: req.body?.description}).error;
        if (error) badRequest(res, error.message);

        const response = await services.updateNotificationService(req.params.id, req.body);

        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}

export const deleteNotificationController = async (req, res) => {
    try {
        const response = await services.deleteNotificationService(req.params.id);

        return ok(res, response);
    } catch (error) {
        if (error.message === "Notification not found") return notFound(res, error.message);
        internalServerError(res, error);
    }
}