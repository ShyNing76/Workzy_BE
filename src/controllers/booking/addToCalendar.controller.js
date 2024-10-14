import Joi from "joi";
import {
    badRequest,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import * as services from "../../services";

export const addToCalendarController = async (req, res, next) => {
    try {
        const error = Joi.object({
            booking_id: Joi.string().required(),
        }).validate(req.body).error;
        if (error) return badRequest(res, error.message);
        const calendar = await services.addToCalendarService(
            req.body.booking_id,
            req.user.user_id
        );
        return ok(res, calendar);
    } catch (error) {
        internalServerError(res, error);
    }
};
