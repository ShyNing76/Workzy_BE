import Joi from "joi";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

export const createWishListController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_id: Joi.array().required(),
            customer_id: Joi.required(),
        }).validate({customer_id: req.body.customer_id, workspace_id: req.query.workspace_id}).error;
        if(error) return badRequest(res, error);
        const amenity = await services.createWishListService(req.query, req.body.customer_id);
        return res.status(201).json({amenity});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const deleteWishListController = async (req, res) => {
    try {
        const error = Joi.object({
            wishlist_id: Joi.array().required(),
        }).validate({wishlist_id: req.query.wishlist_id}).error;
        if(error) return badRequest(res, error);
        const amenity = await services.deleteWishListService(req.query);
        return res.status(201).json({amenity});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}