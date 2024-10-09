import express from "express";
import * as controllers from "../../controllers";
import {verify_admin, verify_token} from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/", verify_token, verify_admin, controllers.createAmenitiesWorkspaceController
    /*
        #swagger.description = 'Endpoint to create a new amenity-workspace association.'
        #swagger.summary = 'Create a new amenity-workspace association.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '0c2cfee2-d9b7-4215-baaf-f40632e7de2c'
                            },
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

router.get("/:workspace_id", controllers.getAmenitiesByWorkspaceIdController
    /*
        #swagger.description = 'Endpoint to get amenities by workspace ID.'
        #swagger.summary = 'Get amenities by workspace ID.'
        #swagger.parameters['workspace_id'] = {
            in: 'path',
            description: 'Workspace ID.',
            type: 'string',
            format: 'uuid'  
        }
        #swagger.responses[200] = {
            description: 'Amenities found.',
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            amenities: {
                                type: 'array',
                                items: {
                                    $ref: "#/components/schemas/Amenity"
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

module.exports = router;