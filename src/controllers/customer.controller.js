import {internalServerError, ok} from "../middlewares/handle_error";
import * as services from "../services";

export const removeUserController = async (req, res) => {
    try {
        const response = await services.removeUserService(req.params.id);

        // Return the response
        return ok(res, response)
    } catch (error) {
        internalServerError(res, error)
    }
}