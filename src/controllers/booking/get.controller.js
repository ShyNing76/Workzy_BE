import Joi from "joi";
import {
    badRequest,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import * as services from "../../services/booking";

export const getAllBookingsController = async (req, res) => {
    try {
        const bookings = await services.getAllBookingsService({
            ...req.params,
        });
        return ok(res, bookings);
    } catch (err) {
        console.error(err);
        internalServerError(res);
    }
};

export const getBookingController = async (req, res) => {
    try {
        const error = Joi.object({
            user_id: Joi.required(),
        }).validate({
            user_id: req.user.user_id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const bookings = await services.getBookingService({
            ...req.body,
            ...req.user,
        });
        return ok(res, bookings);
    } catch (err) {
        console.error(err);
        internalServerError(res);
    }
};

export const getBookingByIdController = async (req, res) => {
    try {
        const error = Joi.object({
            user_id: Joi.required(),
            booking_id: Joi.string().uuid().required(),
        }).validate({
            user_id: req.user.user_id,
            booking_id: req.params.id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const booking = await services.getBookingByIdService({
            booking_id: req.params.id,
            user_id: req.user.user_id,
        });
        return ok(res, booking);
    } catch (err) {
        console.error(err);
        const knownErrors = ["No bookings found", "Customer not found"];
        if (knownErrors.includes(err)) return badRequest(res, err);
        internalServerError(res);
    }
};
