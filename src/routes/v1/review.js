import express from "express";
import * as controllers from "../../controllers";
import { verify_role, verify_token } from "../../middlewares/verifyToken";

const router = express.Router();

router.post(
    "/",
    verify_token,
    controllers.createReviewController
    /*
        #swagger.description = 'Endpoint to create a new review.'
        #swagger.summary = 'Create a new review.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            booking_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '5f9f1b9b9c9d440000a1b1b1'
                            },
                            rating: {
                                type: 'integer',
                                example: 5,
                                minimum: 1,
                                maximum: 5
                            },
                            review_content: {
                                type: 'string',
                                example: 'Great workspace with excellent amenities.'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Review created successfully.'
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

router.delete("/delete/:review_id", verify_token, verify_role(["admin", "manager"]), controllers.deleteReviewController
    /*
        #swagger.description = 'Endpoint to remove a review.'
        #swagger.summary = 'Remove a review.'
        #swagger.parameters['review_id'] = { description: 'Review Id.' }
        #swagger.responses[200] = {
            description: 'Review removed successfully.'
        }
        #swagger.responses[404] = {
            description: 'Review not found.'
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
    verify_role(["admin", "manager"]),
    controllers.getAllReviewController
    /*
        #swagger.description = 'Endpoint to get all reviews.'
        #swagger.summary = 'Get all reviews.'
        #swagger.parameters['order'] = { description: 'Order by rating, date, workspace_id.' }
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items per page.' }
        #swagger.parameters['workspace_name'] = { description: 'Filter by workspace name.' }
        #swagger.responses[200] = {
            description: 'Reviews found.'
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
    verify_role(["admin", "manager"]),
    controllers.getReviewByIdController
    /*
        #swagger.description = 'Get a review by ID.'
        #swagger.summary = 'Get a review by ID.'
        #swagger.parameters['id'] = { description: 'Review ID.' }
        #swagger.responses[200] = {
            description: 'Review found.'
        }
        #swagger.responses[404] = {
            description: 'Review not found.'
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
