import Joi from "joi";
import {
    badRequest,
    created,
    internalServerError,
} from "../../../middlewares/handle_error";
import * as services from "../../../services/booking";

export const createAmenitiesBookingController = async (req, res) => {
    try {
        const error = Joi.object({
            booking_id: Joi.string().uuid().required(),
            addAmenities: Joi.array().items(
                Joi.object({
                    amenity_id: Joi.string().uuid().required(),
                    quantity: Joi.number().integer().min(1).required()
                })
            ).required(),
            total_amenities_price: Joi.number().min(0).required()
        }).validate(req.body).error;
        if (error) return badRequest(res, error.details[0].message);
        const amenity_ids = req.body.addAmenities.map(amenity => amenity.amenity_id);
        const quantities = req.body.addAmenities.map(amenity => amenity.quantity);
        const response = await services.createAmenitiesBookingService(req.user, req.body.total_amenities_price, { booking_id: req.body.booking_id, amenity_ids, quantities});
        return created(res, response);
    } catch (err) {
        console.log(err);
        const knownErrors = new Set([
            "Error associating amenities with booking",
            "No valid amenities found",
            "Total amenities price mismatch",
            "Booking not found",
        ]);
        if (knownErrors.has(err)) return badRequest(res, err);
        internalServerError(res);
    }
};

