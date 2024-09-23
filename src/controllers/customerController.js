import Joi from "joi";
import {accessToken, date_of_birth, gender, phone, point} from "../helper/joi_schema";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

export const getUser = async (req, res) => {
    try {
        // Validate the request body
        const error = Joi.object({
            accessToken,
        }).validate({accessToken: req.headers['authorization']}).error;
        if (error) return badRequest(res, error.message);

        const response = await services.getProfile(req.headers['authorization']);

        // Return the response
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

export const updateUser = async (req, res) => {
    try {
        // Validate the request body
        const error = Joi.object({
            accessToken,
            phone,
            gender,
            // date_of_birth,
            point
        }).validate({accessToken: req.headers['authorization'], ...req.body}).error;
        if (error) return badRequest(res, error.message);

        const response = await services.updateProfile(req.headers['authorization'], req.body);

        // Return the response
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}