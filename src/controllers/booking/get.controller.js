import Joi from "joi";
import {
    badRequest,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import * as services from "../../services/booking";

export const getBookingController = async (req, res) => {
    try {
        const error = Joi.object({
            user_id: Joi.required(),
        }).validate({
            user_id: req.user.user_id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const bookings = await services.getBookingService({...req.body, ...req.user});
        return ok(res, bookings);
    } catch (err) {
        console.error(err);
        internalServerError(res);
    }
};
