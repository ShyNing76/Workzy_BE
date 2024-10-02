import Joi from "joi";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

export const createWishListController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_ids: Joi.array().required(),
            customer_id: Joi.string().uuid().required(),
        }).validate({customer_id: req.body.customer_id, workspace_ids: req.body.workspace_ids}).error;
        if(error) return badRequest(res, error);
        const response = await services.createWishListService(req.body);
        return res.status(201).json(response);
    } catch (error) {s
        return res.status(500).json({error: error.message});
    }
}

export const deleteWishListController = async (req, res) => {
    try {
        const error = Joi.object({
            wishlist_id: Joi.array().required(),
        }).validate({wishlist_id: req.body.wishlist_id}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteWishListService(req.body);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}