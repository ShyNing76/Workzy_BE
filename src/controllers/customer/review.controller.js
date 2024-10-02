import Joi from "joi";
import {workspace_name, workspace_price} from "../../helper/joi_schema";
import {badRequest} from "../../middlewares/handle_error";
import * as services from "../../services";

export const createReviewController = async (req, res) => {
    try {
        const error = Joi.object({
            booking_id: Joi.required(),
        }).validate({booking_id: req.body.booking_id}).error;
        if(error) return badRequest(res, error);
        const workspace = await services.createWorkspaceService(req.body);
        return res.status(201).json({workspace});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

// export const deleteReviewController = async (req, res) => {
//     try {
//         const workspace = await services.deleteReviewService(req.params.id);
//         return res.status(201).json({workspace});
//     } catch (error) {
//         return res.status(500).json({error: error.message});
//     }
// }

export const getAllReviewController = async (req, res) => {
    try {
        const response = await services.getAllReviewService(req.query);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}

export const getReviewByIdController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required()
        }).validate({
            id: req.params.id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.getReviewByIdService(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}
