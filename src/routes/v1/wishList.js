import express from "express";
import * as controllers from "../../controllers";
import {verify_token} from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/", verify_token, controllers.createWishListController
    /*
        #swagger.description = 'Endpoint to add an item to the user\'s wishlist.'
        #swagger.summary = 'Add an item to wishlist.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_ids: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'uuid'
                                },
                                example: ['0c2cfee2-d9b7-4215-baaf-f40632e7de2c', '621ca0c8-e3ad-4bd8-9df5-eafe998b5b04']
                            },
                            customer_id: {
                                type: 'string',
                                format: 'uuid',
                                example: 'workspace123'
                            },
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Workspace added to wishlist successfully.'
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
        #swagger.description = 'Endpoint to remove an item from the user\'s wishlist.'
        #swagger.summary = 'Remove an item from wishlist.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            wishlist_id: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'uuid'
                                },
                                example: ['0c2cfee2-d9b7-4215-baaf-f40632e7de2c', '621ca0c8-e3ad-4bd8-9df5-eafe998b5b04']
                            },
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Wishlist removed successfully.'
        }
        #swagger.responses[404] = {
            description: 'Item not found in wishlist.'
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