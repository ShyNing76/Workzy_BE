import * as services from "../services";
import {email, name, password} from "../helper/joi_schema";
import Joi from "joi";
import {badRequest} from "../middlewares/handle_error";


export const loginController = async (req, res) => {
    try {
        // Validate the request body
        const error = Joi.object({
            email,
            password
        }).validate(req.body).error;
        if (error) return badRequest(res, error.message);

        // Call the service function
        const response = await services.loginService(req.body);

        // Return the response
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

export const registerController = async (req, res) => {
    try {
        // Validate the request body
        const error = Joi.object({
            email,
            password,
            name
        }).validate(req.body).error;
        if (error) return badRequest(res, error.message);
        const response = await services.registerService(req.body);

        return res.status(200).json(response);
        // {
        //     err: "1",
        //     message: "User registered successfully!"
        //     accessToken: "Bearer " + accessToken
        // }
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}