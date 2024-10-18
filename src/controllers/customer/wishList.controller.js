import Joi from "joi";
import {badRequest , created, internalServerError, ok} from "../../middlewares/handle_error";
import * as services from "../../services";

export const createWishListController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_id: Joi.string().uuid().required(),
            user_id: Joi.string().uuid().required(),
        }).validate({user_id: req.body.user_id, workspace_id: req.body.workspace_id}).error;
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
            wishlist_id: Joi.string().uuid().required(),
        }).validate({wishlist_id: req.params.wishlist_id}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteWishListService(req.params.wishlist_id);
        return ok(res, response);
    } catch (error) {
        if(error === "No WishList found to delete") return badRequest(res, error);
        internalServerError(res, error);
    }
}

export const getAllWishListController = async (req, res) => {
    try {
        const response = await services.getAllWishListService(req.query);
        return ok(res, response);
    } catch (error) {
        if(error === "No WishList Exist") return badRequest(res, error);
        internalServerError(res, error);
    }
}

export const getWishListByUserIdController = async (req, res) => {
    try {
        const response = await services.getWishListByUserIdService(req.user);
        return ok(res, response);
    } catch (error) {
        if(error === "No valid customer found" || error === "No WishList Exist") return badRequest(res, error);
        internalServerError(res, error);
    }
}