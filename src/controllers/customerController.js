import Joi from "joi";
import {date_of_birth, gender, name} from "../helper/joi_schema";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

export const getUser = async (req, res) => {
    try {
        const response = await services.getProfile(req.user);

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
            name,
            gender,
            date_of_birth,
        }).validate(req.body).error;
        if (error) return badRequest(res, error.message);
        const response = await services.updateProfile({...req.body, ...req.user});

        // Return the response
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

export const updatePassword = async (req, res) => {
    try {
        // Validate the request body
        const error = Joi.object({
            current_password: Joi.string().required(),
            new_password: Joi.string().required(),
        }).validate(req.body).error;
        if (error) return badRequest(res, error.message);
        const response = await services.updatePassword({...req.body, ...req.user});

        // Return the response
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}