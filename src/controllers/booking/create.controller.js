import Joi from "joi";
import {
    badRequest,
    created,
    internalServerError,
} from "../../middlewares/handle_error";
import { booking_type, id } from "../../helper/joi_schema";
import * as services from "../../services/booking";

export const createBookingController = async (req, res) => {
    try {
        const error = Joi.object({
            user_id: Joi.required(),
            workspace_id: id,
            start_time: Joi.required(),
            end_time: Joi.required(),
            total_price: Joi.number().min(0).required(),
            type: booking_type,
        }).validate({
            user_id: req.user.user_id,
            workspace_id: req.body.workspace_id,
            type: req.body.type,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            total_price: req.body.total_price,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const response = await services.createBookingService({...req.body, user_id: req.user.user_id});

        return created(res, response);
    } catch (err) {
        if (err === "Customer not found") return badRequest(res, "Customer not found");
        if (err === "Workspace not found") return badRequest(res, "Workspace not found");
        if (err === "Booking type not found") return badRequest(res, "Booking type not found");
        internalServerError(res);
    }
};
