import express from "express";
import * as controllers from "../controllers";
import {verify_admin, verify_token} from "../middlewares/verifyToken";

const router = express.Router();

router.post("/", verify_token, controllers.createWishListController
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

router.delete("/", verify_token, controllers.deleteWishListController
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

module.exports = router;