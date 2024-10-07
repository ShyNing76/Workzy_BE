import express from "express";
import * as controllers from "../../controllers/booking";
import {verify_customer, verify_token} from "../../middlewares/verifyToken";

const router = express.Router();

router.use(verify_token);

router.post(
    "/create",
    verify_customer,
    controllers.createBookingController
    /*
        #swagger.description = 'Create a new booking.'
        #swagger.summary = 'Create booking'
        #swagger.security = [{
            "apiKeyAuth": []
        }]
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
                                example: '123e4567-e89b-12d3-a456-426614174000',
                                description: 'Workspace ID'
                            },
                            type: {
                                type: 'string',
                                example: 'Hourly'
                            },
                            start_time: {
                                type: 'string',
                                format: 'date-time',
                                example: '2023-10-01T14:00:00+07:00',
                                description: 'Booking start time in ISO 8601 format have date and time with timezone'
                            },
                            end_time: {
                                type: 'string',
                                format: 'date-time',
                                example: '2023-10-01T16:00:00+07:00',
                                description: 'Booking end time in ISO 8601 format have date and time with timezone'
                            },
                            total_price: {
                                type: 'number',
                                example: 50.00
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Booking created successfully',
            schema: {
                err: 0,
                message: 'Booking created successfully',
                data: {
                    booking_id: '123e4567-e89b-12d3-a456-426614174000',
                    user_id: '123e4567-e89b-12d3-a456-426614174000',
                    workspace_id: '123e4567-e89b-12d3-a456-426614174000',
                    start_time: '2023-10-01T14:00:00Z',
                    end_time: '2023-10-01T16:00:00Z',
                    total_price: 50.00
                }
            }
        }
        #swagger.responses[400] = {
            description: 'Bad request',
            schema: {
                err: 1,
                message: 'Invalid input data'
            }
        }
        #swagger.responses[500] = {
                description: 'Internal server error',
                schema: {
                    err: 1,
                    message: 'An error occurred while processing your request'
                }
            }
    */
);

module.exports = router;
