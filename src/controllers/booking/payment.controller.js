import Joi from "joi";
import {
    badRequest,
    internalServerError,
    ok,
} from "../../middlewares/handle_error";
import * as services from "../../services/booking";

export const paypalCheckoutController = async (req, res) => {
    try {
        const error = Joi.object({
            user_id: Joi.required(),
            booking_id: Joi.string().uuid().required(),
        }).validate({
            user_id: req.user.user_id,
            booking_id: req.body.booking_id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const booking = await services.paypalCheckoutService({
            booking_id: req.body.booking_id,
            user_id: req.user.user_id,
        });
        return ok(res, booking);
    } catch (err) {
        console.error(err);
        const knownErrors = [
            "Customer not found",
            "Booking not found",
            "Booking is not confirmed",
            "Booking already cancelled",
            "Booking status not found",
            "Payment not found",
            "Failed to create PayPal order",
        ];
        if (knownErrors.includes(err)) return badRequest(res, err);
        internalServerError(res, err);
    }
};

export const paypalSuccessController = async (req, res) => {
    try {
        const error = Joi.object({
            booking_id: Joi.string().uuid().required(),
            order_id: Joi.string().required(),
        }).validate({
            booking_id: req.body.booking_id,
            order_id: req.body.order_id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const booking = await services.paypalSuccessService({
            booking_id: req.body.booking_id,
            order_id: req.body.order_id,
        });
        return ok(res, booking);
    } catch (err) {
        console.error(err);
        const knownErrors = [
            "Booking not found",
            "Booking status not found",
            "Booking has been cancelled",
            "Booking has already been paid",
            "Unexpected booking status",
            "Invalid booking status",
        ];
        if (knownErrors.includes(err)) return badRequest(res, err);
        internalServerError(res, err);
    }
};

export const refundBookingController = async (req, res) => {
    try {
        const error = Joi.object({
            booking_id: Joi.string().uuid().required(),
        }).validate({
            booking_id: req.params.id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const booking = await services.refundBookingService({
            booking_id: req.params.id,
            user_id: req.user.user_id,
        });
        return ok(res, booking);
    } catch (err) {
        console.error(err);
        internalServerError(res, err);
    }
};

// Amenities payment
export const paypalCheckoutAmenitiesController = async (req, res) => {
    try {
        const error = Joi.object({
            user_id: Joi.required(),
            booking_id: Joi.string().uuid().required(),
            addAmenities: Joi.array().items(
                Joi.object({
                    amenity_id: Joi.string().uuid().required(),
                    quantity: Joi.number().integer().min(1).required()
                })
            ).required(),
            total_amenities_price: Joi.number().min(0).required()
        }).validate({
            user_id: req.user.user_id,
            booking_id: req.body.booking_id,
            addAmenities: req.body.addAmenities,
            total_amenities_price: req.body.total_amenities_price,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const booking = await services.paypalCheckoutAmenitiesService({
            booking_id: req.body.booking_id,
            user_id: req.user.user_id,
            addAmenities: req.body.addAmenities,
            total_amenities_price: req.body.total_amenities_price,
        });
        return ok(res, booking);
    } catch (err) {
        console.error(err);
        const knownErrors = [
            "Customer not found",
            "Booking not found",
            "Booking is not confirmed",
            "Booking already cancelled",
            "Booking status not found",
            "Payment not found",
            "Failed to create PayPal order",
            "Error associating amenities with booking",
            "No valid amenities found",
            "Total amenities price mismatch",
            "Payment created failed",
            "Transaction created failed"
        ];
        if (knownErrors.includes(err)) return badRequest(res, err);
        internalServerError(res, err);
    }
};

export const paypalAmenitiesSuccessController = async (req, res) => {
    try {
        const error = Joi.object({
            booking_id: Joi.string().uuid().required(),
            order_id: Joi.string().required(),
        }).validate({
            booking_id: req.body.booking_id,
            order_id: req.body.order_id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const booking = await services.paypalAmenitiesSuccessService({
            booking_id: req.body.booking_id,
            order_id: req.body.order_id,
        });
        return ok(res, booking);
    } catch (err) {
        console.error(err);
        const knownErrors = [
            "Booking not found",
            "Booking status not found",
            "Booking must be in-process",
            "Booking already cancelled",
            "Failed to capture PayPal order",
            "Payment not found",
            "Transaction created failed",
        ];
        if (knownErrors.includes(err)) return badRequest(res, err);
        internalServerError(res, err);
    }
};

// Amenities damage payment
export const paypalCheckoutDamageController = async (req, res) => {
    try {
        const error = Joi.object({
            user_id: Joi.required(),
            booking_id: Joi.string().uuid().required(),
            total_damage_price: Joi.number().min(0).required()
        }).validate({
            user_id: req.user.user_id,
            booking_id: req.body.booking_id,
            total_damage_price: req.body.total_damage_price,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const booking = await services.paypalCheckoutDamageService({
            booking_id: req.body.booking_id,
            user_id: req.user.user_id,
            total_damage_price: req.body.total_damage_price,
        });
        return ok(res, booking);
    } catch (err) {
        console.error(err);
        const knownErrors = [
            "Customer not found",
            "Booking not found",
            "Booking is not final-payment",
            "Booking already cancelled",
            "Booking status not found",
            "Failed to create PayPal order",
            "Payment created failed",
            "Transaction created failed"
        ];
        if (knownErrors.includes(err)) return badRequest(res, err);
        internalServerError(res, err);
    }
}

export const paypalDamageSuccessController = async (req, res) => {
    try {
        const error = Joi.object({
            booking_id: Joi.string().uuid().required(),
            order_id: Joi.string().required(),
        }).validate({
            booking_id: req.body.booking_id,
            order_id: req.body.order_id,
        }).error;
        if (error) return badRequest(res, error.details[0].message);

        const booking = await services.paypalDamageSuccessService({
            booking_id: req.body.booking_id,
            order_id: req.body.order_id,
        });
        return ok(res, booking);
    } catch (err) {
        console.error(err);
        const knownErrors = [
            "Booking not found",
            "Booking status not found",
            "Booking must be final-payment",
            "Booking already cancelled",
            "Failed to capture PayPal order",
            "Payment not found",
            "Transaction created failed",
        ];
        if (knownErrors.includes(err)) return badRequest(res, err);
        internalServerError(res, err);
    }
}