import Joi from "joi";
import {workspace_name, workspace_price} from "../helper/joi_schema";
import {badRequest} from "../middlewares/handle_error";
import * as services from "../services";

export const createWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_name,
            workspace_price,
        }).validate({workspace_name: req.body.workspace_name, workspace_price: req.body.workspace_price}).error;
        if(error) return badRequest(res, error);
        const workspace = await services.createWorkspaceService(req.body);
        return res.status(201).json({workspace});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const updateWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            workspaceName,
            workspacePricePerHour,
        }).validate({workspaceName: req.body.workspaceName, workspacePricePerHour: req.body.workspacePricePerHour}).error;
        if(error) return badRequest(res, error);
        const workspace = await services.updateWorkspaceService(req.params.id, req.body);
        return res.status(201).json({workspace});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const deleteWorkspaceController = async (req, res) => {
    try {
        const workspace = await services.deleteWorkspaceService(req.params.id);
        return res.status(201).json({workspace});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const getAllWorkspaceController = async (req, res) => {
    try {
        const response = await services.getAllWorkspaceService(req.query);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}

export const getWorkspaceByIdController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required()
        }).validate({
            id: req.params.id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.getWorkspaceByIdController(req.params.id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const assignWorkspaceToBuildingController = async (req, res) => {
    try {
        const error = Joi.object({
            id: Joi.required(),
            building_id: Joi.required()
        }).validate({
            id: req.params.id,
            building_id: req.body.building_id
        }).error;
        if (error) return badRequest(res, error);
        const response = await services.assignWorkspacetoBuildingService(req.params.id, req.body.building_id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}