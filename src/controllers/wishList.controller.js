import Joi from "joi";
import {badRequest , created, internalServerError, ok} from "../middlewares/handle_error";
import * as services from "../services";

export const createWishListController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_ids: Joi.array().required(),
            customer_id: Joi.string().uuid().required(),
        }).validate({customer_id: req.body.customer_id, workspace_ids: req.body.workspace_ids}).error;
        if(error) return badRequest(res, error);
        const response = await services.createWishListService(req.body);
        return created(res, response);
    } catch (error) {
        if(error === "No valid workspaces found"
            || error === "Error creating WishList") return badRequest(res, error);
        internalServerError(res, error);
    }
}

export const deleteWishListController = async (req, res) => {
    try {
        const error = Joi.object({
            wishlist_id: Joi.array().required(),
        }).validate({wishlist_id: req.body.wishlist_id}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteWishListService(req.body);
        return ok(res, response);
    } catch (error) {
        if(error === "No WishList found to delete") return badRequest(res, error);
        internalServerError(res, error);
    }
}