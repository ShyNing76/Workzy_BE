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
        const response = await services.createWorkspaceService(req.body);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const updateWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_name,
            workspace_price,
            building_id: Joi.required(),
            workspace_type_id: Joi.required(),
        }).validate({workspace_name: req.body.workspace_name, workspace_price: req.body.workspace_price, building_id: req.body.building_id, workspace_type_id: req.body.workspace_type_id}).error;
        if(error) return badRequest(res, error);
        const response = await services.updateWorkspaceService(req.params.id, req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const deleteWorkspaceController = async (req, res) => {
    try {
        const error = Joi.object({
            workspace_ids: Joi.array().required()
        }).validate({workspace_ids: req.query.workspace_ids}).error;
        if(error) return badRequest(res, error);
        const response = await services.deleteWorkspaceService(req.query);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const getAllWorkspaceController = async (req, res) => {
    try {
        const response = await services.getAllWorkspaceService(req.query);
        return res.status(200).json(response);
    } catch (error) {
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
        const response = await services.getWorkspaceByIdService(req.params.id);
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