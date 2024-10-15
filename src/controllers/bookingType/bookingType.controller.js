import * as services from "../../services/bookingType/bookingType.service.js";
import { ok, internalServerError } from "../../middlewares/handle_error";

export const getBookingTypes = async (req, res) => {
    try {
        const response = await services.getBookingTypesService();
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};

export const getBookingTypeById = async (req, res) => {
    try {
        const response = await services.getBookingTypeByIdService(
            req.params.id
        );
        return ok(res, response);
    } catch (error) {
        internalServerError(res, error);
    }
};
