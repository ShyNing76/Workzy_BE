import {badRequest, internalServerError, ok} from "../../middlewares/handle_error";
import {location} from "../../helper/joi_schema";
import * as services from "../../services";
import Joi from "joi";

export const searchBuildingController = async (req, res) => {
    try {
        const error = Joi.object(
            {
                location,
                workspace_type_name: Joi.string(),
            }).validate({location: req.query.location, workspace_type_name: req.query.workspace_type_name}).error;

        if (error) return badRequest(res, error.details[0].message);
        const response = await services.searchBuildingService(req.query);
        return ok(res, response);
    } catch (error) {
        if (error === 'No buildings found')
            return badRequest(res, error);
        internalServerError(res, error);
    }
}

// export const searchWorkspaceController = async (req, res) => {
//     try {
//         const response = await services.searchWorkspaceService(req.query);
//         return ok(res, response);
//     } catch (error) {
//         if (error === 'No workspaces found')
//             return badRequest(res, error);
//         internalServerError(res, error);
//     }
// }