import express from "express";
import * as controllers from "../../controllers";
import {
    verify_role,
    verify_token,
} from "../../middlewares/verifyToken";

const router = express.Router();

router.post(
    "/",
    verify_token,
    verify_role(["admin"]),
    controllers.createWorkspaceImageController
    /*
        #swagger.description = 'Endpoint to create a new workspace image.'
        #swagger.summary = 'Create a new workspace image.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_id: {
                                type: 'uuid',
                                example: 'b5eb4d3e-e7d2-49ac-ac4b-33f4e4b9ed96'
                            },
                            image: {
                                type: 'string',
                                example: 'anh.png'
                            },
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Workspace image created successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
    */
);

router.delete(
    "/:id",
    verify_token,
    verify_role(["admin"]),
    controllers.deleteWorkspaceImageController
    /*
        #swagger.description = 'Endpoint to remove a workspace image.'
        #swagger.summary = 'Remove a image.'
        #swagger.parameters['id'] = { description: 'Workspace image ID.' }
        #swagger.responses[200] = {
            description: 'Workspace image removed successfully.'
        }
        #swagger.responses[404] = {
            description: 'Workspace image not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.get(
    "/",
    verify_token,
    controllers.getAllWorkspaceImageController
    /*
        #swagger.description = 'Endpoint to get all workspaces.'
        #swagger.summary = 'Get all workspaces.'
        #swagger.parameters['order'] = { description: 'Order by name, status.' }
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items per page.' }
        #swagger.parameters['name'] = { description: 'Workspace name.' }
        #swagger.responses[200] = {
            description: 'Workspace found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);
router.get(
    "/:id",
    verify_token,
    controllers.getWorkspaceImageByWorkspaceIdController
    /*
        #swagger.description = 'Get a workspace image by workspace_id.'
        #swagger.summary = 'Get a workspace image by workspace_id.'
        #swagger.parameters['id'] = { description: 'Workspace ID.' }
        #swagger.responses[200] = {
            description: 'Workspace found.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);
module.exports = router;
