import express from "express";
import * as controllers from "../../controllers";
import {verify_token, verify_role} from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/", verify_token, verify_role(["customer"]), controllers.createWishListController
    /*
        #swagger.description = 'Endpoint to create a wishlist.'
        #swagger.summary = 'Create a wishlist.'
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
                                example: '3e8d0be4-27a1-4496-a306-b66ed86bd8eb'
                            },
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Wishlist created successfully.'
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

router.delete("/:wishlist_id", verify_token, verify_role(["customer"]), controllers.deleteWishListController
    /*
        #swagger.description = 'Endpoint to remove an item from the user\'s wishlist.'
        #swagger.summary = 'Remove an item from wishlist.'
        #swagger.parameters['wishlist_id'] = {
            in: 'path',
            description: 'wishlist_id.',
            required: true,
            type: 'string',
            format: 'uuid'
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

router.get("/", verify_token, verify_role(["staff", "admin"]), controllers.getAllWishListController
    /*
        #swagger.description = 'Endpoint to get all wishlist.'
        #swagger.summary = 'Get all wishlist.'
        #swagger.parameters['order'] = { description: 'Order by name, status.' }
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items per page.' }
        #swagger.parameters['building_id'] = { description: 'Filter by building_id.' }
        #swagger.responses[200] = {
            description: 'Wishlist fetched successfully.'
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

router.get("/mywishlist", verify_token, verify_role(["customer"]), controllers.getWishListByUserIdController
    /*
        #swagger.description = 'Endpoint to get all wishlist of a customer.'
        #swagger.summary = 'Get all wishlist of a customer.'
        #swagger.responses[200] = {
            description: 'Wishlist fetched successfully.'
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

module.exports = router;