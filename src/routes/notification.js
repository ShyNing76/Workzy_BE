import express from "express";
import * as controllers from "../controllers";

const router = express.Router();

router.get("/", controllers.getAllNotificationsController
    /*
        #swagger.description = 'Endpoint to get all notifications.'
        #swagger.summary = 'Get all notifications.'
        #swagger.parameters['order'] = { description: 'Order by type, description.' }
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items per page.' }
        #swagger.parameters['type'] = { description: 'Filter by type.' }
        #swagger.parameters['description'] = { description: 'Filter by description.' }
        #swagger.responses[200] = {
            description: 'Notifications found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.get("/:id", controllers.getNotificationByIdController
    /*
        #swagger.description = 'Endpoint to get a notification by id.'
        #swagger.summary = 'Get a notification by id.'
        #swagger.parameters['id'] = { description: 'Notification id.' }
        #swagger.responses[200] = {
            description: 'Notification found.'
        }
        #swagger.responses[404] = {
            description: 'Notification not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.post("/", controllers.createNotificationController
    /*
        #swagger.description = 'Endpoint to create a new notification.'
        #swagger.summary = 'Create a new notification.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                example: 'booking|payment|system'
                            },
                            description: {
                                type: 'string',
                                example: 'Booking has been made'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Notification created.'
        }
        #swagger.responses[400] = {
            description: 'Invalid input.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.put("/:id", controllers.updateNotificationController
    /*
        #swagger.description = 'Endpoint to update a notification.'
        #swagger.summary = 'Update a notification.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                example: 'booking|payment|system'
                            },
                            description: {
                                type: 'string',
                                example: 'Booking has been made'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Notification updated.'
        }
        #swagger.responses[400] = {
            description: 'Invalid input.'
        }
        #swagger.responses[404] = {
            description: 'Notification not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.delete("/:id", controllers.deleteNotificationController
    /*
        #swagger.description = 'Endpoint to delete a notification.'
        #swagger.summary = 'Delete a notification.'
        #swagger.parameters['id'] = { description: 'Notification id.' }
        #swagger.responses[200] = {
            description: 'Notification deleted.'
        }
        #swagger.responses[404] = {
            description: 'Notification not found.'
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