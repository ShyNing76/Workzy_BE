import Joi from "joi";
import {
    badRequest,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import * as services from "../../services/booking";

export const cancelBookingController = async (req, res) => {
    try {
        const error = Joi.object({
            user_id: Joi.required(),
            booking_id: Joi.string().uuid().required(),
        }).validate({
            user_id: req.user.user_id,
            booking_id: req.params.id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const booking = await services.cancelBookingService({
            booking_id: req.params.id,
            user_id: req.user.user_id,
        });
        return ok(res, booking);
    } catch (err) {
        console.error(err);
        const knownErrors = [
            "Booking status not found",
            "Customer not found",
            "Booking not found",
            "Booking not confirmed",
            "Booking already cancelled",
        ];
        if (knownErrors.includes(err)) return badRequest(res, err);
        internalServerError(res);
    }
};

