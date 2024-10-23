import Joi from "joi";
import {badRequest , created, internalServerError, ok} from "../../middlewares/handle_error";
import * as services from "../../services";

export const getAllVoucherController = async (req, res) => {
    try {
        const response = await services.getAllVoucherService(req.query);
        return ok(res, response);
    } catch (error) {
        if(error === "No Voucher Exist") return badRequest(res, error);
        internalServerError(res, error);
    }
}

export const getVoucherByIdController = async (req, res) => {
    try {
        const response = await services.getVoucherByIdService(req.params.voucher_id);
        return ok(res, response);
    } catch (error) {
        if(error === "Voucher not found") return badRequest(res, error);
        internalServerError(res, error);
    }
}

export const createVoucherController = async (req, res) => {
    try {
        const error = Joi.object({
            voucher_name: Joi.string().required(),
            voucher_code: Joi.string().required(),
            description: Joi.string(),
            discount: Joi.number().required(),
            quantity: Joi.number().required(),  
            expired_date: Joi.date().required()
        }).validate(req.body).error;
        if(error) return badRequest(res, error);
        const response = await services.createVoucherService(req.body);
        return created(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}

export const updateVoucherController = async (req, res) => {
    try {
        const error = Joi.object({
            voucher_id: Joi.string().uuid().required(),
            voucher_name: Joi.string(),
            voucher_code: Joi.string(),
            description: Joi.string(),
            discount: Joi.number(),
            quantity: Joi.number(),
            expired_date: Joi.date(),
            status: Joi.string().valid("active", "inactive")
        }).validate({voucher_id: req.params.voucher_id, ...req.body}).error;
        if(error) return badRequest(res, error);
        const response = await services.updateVoucherService(req.params.voucher_id, req.body);
        return ok(res, response);
    } catch (error) {
        if(error === "Voucher not found") return badRequest(res, error);
        internalServerError(res, error);
    }
}

export const deleteVoucherController = async (req, res) => {
    try {
        const error = Joi.object({
            voucher_id: Joi.string().uuid().required()
        }).validate({voucher_id: req.params.voucher_id}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteVoucherService(req.params.voucher_id);
        return ok(res, response);
    } catch (error) {
        if(error === "Voucher not found") return badRequest(res, error);
        internalServerError(res, error);
    }
}

export const getTotalVoucherController = async (req, res) => {
    try {
        const response = await services.getTotalVoucherService();
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
}
