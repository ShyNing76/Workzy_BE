import express from "express";
import * as controllers from "../controllers";
import {verify_admin, verify_token} from "../middlewares/verifyToken";

const router = express.Router();

router.post("/:workspace_id", verify_token, verify_admin, controllers.createAmenitiesWorkspaceController
    /*
        #swagger.description = 'Endpoint to create a new amenity-workspace association.'
        #swagger.summary = 'Create a new amenity-workspace association.'
        #swagger.parameters['workspace_id'] = {
            description: 'Workspace ID.',
            required: true,
            type: 'string',
            format: 'uuid'
        }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            amenity_ids: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'uuid'
                                },
                                example: ['0c2cfee2-d9b7-4215-baaf-f40632e7de2c', '621ca0c8-e3ad-4bd8-9df5-eafe998b5b04']
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Amenity-workspace association created successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Workspace or amenity not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
    */
);

router.delete("/", verify_token, verify_admin, controllers.deleteAmenitiesWorkspaceController
    /*
        #swagger.description = 'Endpoint to delete an amenity-workspace association.'
        #swagger.summary = 'Delete an amenity-workspace association.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            amenities_workspace_ids: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'uuid'
                                },
                                example: ['0c2cfee2-d9b7-4215-baaf-f40632e7de2c', '621ca0c8-e3ad-4bd8-9df5-eafe998b5b04']
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Amenity-workspace association(s) deleted successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[401] = {
            description: 'Unauthorized - Invalid or missing token.'
        }
        #swagger.responses[403] = {
            description: 'Forbidden - User is not an admin.'
        }
        #swagger.responses[404] = {
            description: 'Amenity-workspace association(s) not found.'
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