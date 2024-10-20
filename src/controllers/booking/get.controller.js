import Joi from "joi";
import {
    badRequest,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import * as services from "../../services/booking";

export const getAllBookingsController = async (req, res) => {
    try {
        const error = Joi.object({
            building_id: Joi.string().uuid(),
        }).validate({
            building_id: req.query.building_id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const bookings = await services.getAllBookingsService({
            ...req.query,
        });
        return ok(res, bookings);
    } catch (err) {
        const knownErrors = ["No bookings found"];
        if (knownErrors.includes(err)) return badRequest(res, err);
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
            ...req.query,
            ...req.user,
        });
        return ok(res, bookings);
    } catch (err) {
        const knownErrors = ["No bookings found"];
        if (knownErrors.includes(err)) return badRequest(res, err);

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
        const knownErrors = ["No booking found", "Customer not found"];
        if (knownErrors.includes(err)) return badRequest(res, err);
        internalServerError(res);
    }
};

export const getTimeBookingController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_id: Joi.string().uuid().required(),
            date: Joi.date().required(),
        }).validate({
            workspace_id: req.params.id,
            date: req.query.date,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const booking = await services.getTimeBookingService({
            workspace_id: req.params.id,
            date: req.query.date,
        });
        return ok(res, booking);
    } catch (err) {
        console.error(err);
        const knownErrors = ["Booking not found"];
        if (knownErrors.includes(err)) return badRequest(res, err);
        internalServerError(res);
    }
};
