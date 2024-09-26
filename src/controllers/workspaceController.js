import Joi from "joi";
import {price} from "../helper/joi_schema";
import * as services from "../services";

export const createWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_name: name,
        }).validate(req.body);
        const workspace = await services.createWorkspaceService(req.body);
        return res.status(201).json({workspace});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}