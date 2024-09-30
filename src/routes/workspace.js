import express from "express";
import * as controllers from "../controllers";
import {verify_admin, verify_token} from "../middlewares/verifyToken";

const router = express.Router();

router.post("/", verify_token, verify_admin, controllers.createWorkspaceController 
    /*
        #swagger.description = 'Endpoint to create a new workspace.'
        #swagger.summary = 'Create a new workspace.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_name: {
                                type: 'string',
                                example: 'Landmark81_POD_1'
                            },
                            workspace_price: {
                                type: 'int',
                                example: '1000000'
                            },
                            capacity: {
                                type: 'int',
                                example: '20'
                            },
                            description: {
                                type: 'string',
                                example: 'Workspace description.'
                            },
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Workspace created successfully.'
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
router.put("/:id", verify_token, verify_admin, controllers.updateWorkspaceController
    /*
        #swagger.description = 'Endpoint to update a workspace.'
        #swagger.summary = 'Update a workspace.'
        #swagger.parameters['id'] = { description: 'Workspace ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_name: {
                                type: 'string',
                                example: 'Landmark81_POD_1'
                            },
                            workspace_price: {
                                type: 'int',
                                example: '1000000'
                            },
                            capacity: {
                                type: 'int',
                                example: '20'
                            },
                            description: {
                                type: 'string',
                                example: 'Workspace description.'
                            },
                        },
                        required: ['workspace_name','workspace_price']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Workspace updated successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
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
router.delete("/delete/:id", verify_token, verify_admin, controllers.deleteWorkspaceController
    /*
        #swagger.description = 'Endpoint to remove a manager from a workspace.'
        #swagger.summary = 'Remove a manager from a workspace.'
        #swagger.parameters['id'] = { description: 'Workspace ID.' }
        #swagger.responses[200] = {
            description: 'Workspace removed successfully.'
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

router.get("/", verify_token, controllers.getAllWorkspaceController
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
router.get("/:id", verify_token, controllers.getWorkspaceByIdController
    /*
        #swagger.description = 'Get a workspace by ID.'
        #swagger.summary = 'Get a workspace by ID.'
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
router.put("/assign/:id", verify_token, controllers.assignWorkspaceToBuildingController
    /*
        #swagger.description = 'Endpoint to assign a workspace to a building.'
        #swagger.summary = 'Assign a workspace to a building.'
        #swagger.parameters['id'] = { description: 'Workspace ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_id: {
                                type: 'integer',
                                example: 1
                            }
                        },
                        required: ['workspace_id']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Workspace assigned successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
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