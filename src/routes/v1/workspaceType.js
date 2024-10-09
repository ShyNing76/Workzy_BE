import express from "express";
import * as controllers from "../../controllers";
import { verify_role, verify_token } from "../../middlewares/verifyToken";
import { createWorkspaceController } from "../../controllers";

const router = express.Router();

router.post(
    "/",
    verify_token,
    verify_role(["manager"]),
    controllers.createWorkspaceTypeController
    /*
        #swagger.description = 'Endpoint to create a workspace type.'
        #swagger.summary = 'Create a workspace type.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_type_name: {
                                type: 'string',
                                example: 'Workspace type name'
                            },
                            image: {
                                type: 'string',
                                example: 'image.jpg'
                            },
                            description: {
                                type: 'string',
                                example: 'Workspace type description'
                            }
                        },
                        required: ['workspace_type_name']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Workspace type created.'
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
    controllers.getAllWorkspaceTypeController
    /*
        #swagger.description = 'Endpoint to get all workspace types.'
        #swagger.summary = 'Get all workspace types.'
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            required: false
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Limit number of workspace types',
            required: false
        }
        #swagger.parameters['order'] = {
            in: 'query',
            description: 'Order by workspace type name, status, asc, desc',
            '@schema': {
                type: 'array',
                items: {
                    type: 'string',
                    pattern: '^(workspace_type_name|status|asc|desc)$',
                }
            },
            required: false,
            explode: true
        }
        #swagger.parameters['workspace_type_name'] = {
            in: 'query',
            description: 'Search by workspace type name',
            required: false
        }
        #swagger.responses[200] = {
            description: 'Workspace types retrieved.'
        }
        #swagger.responses[404] = {
            description: 'No workspace types found.'
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
    controllers.getWorkspaceTypeByIdController
    /*
        #swagger.description = 'Endpoint to get a workspace type by id.'
        #swagger.summary = 'Get a workspace type by id.'
        #swagger.parameters['id'] = {
            description: 'Workspace type id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Workspace type retrieved.'
        }
        #swagger.responses[404] = {
            description: 'Workspace type not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.put(
    "/:id",
    verify_token,
    verify_role(["manager"]),
    controllers.updateWorkspaceTypeController
    /*
        #swagger.description = 'Endpoint to update a workspace type.'
        #swagger.summary = 'Update a workspace type.'
        #swagger.parameters['id'] = {
            description: 'Workspace type id',
            required: true
        }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_type_name: {
                                type: 'string',
                                example: 'Workspace type name'
                            },
                            image: {
                                type: 'string',
                                example: 'image.jpg'
                            },
                            description: {
                                type: 'string',
                                example: 'Workspace type description'
                            },
                            status: {
                                type: 'string',
                                example: 'active'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Workspace type updated.'
        }
        #swagger.responses[404] = {
            description: 'Workspace type not found.'
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
