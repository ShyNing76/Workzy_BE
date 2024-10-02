import {badRequest, internalServerError, ok} from "../middlewares/handle_error";
import * as services from "../services";

export const searchBuildingController = async (req, res) => {
    try {
        const response = await services.searchBuildingService(req.query);
        return ok(res, response);
    } catch (error) {
        console.log(error);
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