import express from "express";
import * as controllers from "../../controllers/booking";
import { verify_role, verify_token } from "../../middlewares/verifyToken";

const router = express.Router();

router.use(verify_token);

router.post(
    "/create",
    verify_role(["customer"]),
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
                                example: 500000
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

router.post(
    "/addAmenities",
    verify_token,
    verify_role(["customer"]),
    controllers.createAmenitiesBookingController
    /*
        #swagger.description = 'Create amenities booking.'
        #swagger.summary = 'Create amenities booking'
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
                            booking_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000',
                                description: 'Booking ID'
                            },
                            addAmenities: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        amenity_id: {
                                            type: 'string',
                                            format: 'uuid',
                                            example: '123e4567-e89b-12d3-a456-426614174000'
                                        },
                                        quantity: {
                                            type: 'integer',
                                            example: 1
                                        }
                                    }
                                },
                                example: [
                                    {
                                        amenity_id: '123e4567-e89b-12d3-a456-426614174000',
                                        quantity: 1
                                    },
                                    {
                                        amenity_id: '223e4567-e89b-12d3-a456-426614174001',
                                        quantity: 2
                                    }
                                ]
                            },
                            total_amenities_price: {
                                type: 'number',
                                example: 500000
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Amenities booking created successfully',
            schema: {
                err: 0,
                message: 'Amenities booking created successfully',
                data: {
                    booking_id: '123e4567-e89b-12d3-a456-426614174000',
                    amenities: [
                        {
                            amenity_id: '123e4567-e89b-12d3-a456-426614174000',
                            quantity: 1
                        },
                        {
                            amenity_id: '223e4567-e89b-12d3-a456-426614174001',
                            quantity: 2
                        }
                    ]
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

router.get(
    "/get",
    verify_role(["admin", "manager", "staff"]),
    controllers.getAllBookingsController
    /*
        #swagger.description = 'Get all bookings for the authenticated admin, manager, or staff.'
        #swagger.summary = 'Get bookings'
        #swagger.parameters['building_id'] = {
            description: 'Filter by building ID',
            type: 'string',
            format: 'uuid',
            required: true
        }
        #swagger.parameters['page'] = { description: 'Page number' }
        #swagger.parameters['limit'] = { description: 'Number of items per page' }
        #swagger.parameters['order'] = {
            description: 'Order by start_time, end_time, total_price',
            '@schema': {
                type: 'array',
                items: {
                    type: 'string',
                    pattern: '^(start_time|end_time|total_price|asc|desc)$',
                    example: 'start_time'
                }
            },
            required: false,
            explode: true
        }
        #swagger.parameters['status'] = {
            description: 'Filter by booking status (Current, Upcoming, Check-out, Completed, Cancelled)',
            type: 'string',
            pattern: '^(Current|Upcoming|Check-out|Completed|Cancelled)$',
            required: false
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.responses[200] = {
            description: 'Bookings retrieved successfully',
            schema: {
                err: 0,
                message: 'Bookings retrieved successfully',
                data: [
                    {
                        booking_id: '123e4567-e89b-12d3-a456-426614174000',
                        workspace_id: '123e4567-e89b-12d3-a456-426614174000',
                        start_time: '2023-10-01T14:00:00Z',
                        end_time: '2023-10-01T16:00:00Z',
                        total_price: 50.00
                    }
                ]
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

router.get(
    "/customer",
    verify_role(["customer"]),
    controllers.getBookingController
    /*
        #swagger.description = 'Get all bookings for the authenticated customer.'
        #swagger.summary = 'Get bookings'
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.parameters['page'] = { description: 'Page number' }
        #swagger.parameters['limit'] = { description: 'Number of items per page' }
        #swagger.parameters['order'] = {
            description: 'Order by start_time, end_time, total_price',
            '@schema': {
                type: 'array',
                items: {
                    type: 'string',
                    pattern: '^(start_time|end_time|total_price|asc|desc)$',
                    example: 'start_time'
                }
            },
            required: false,
            explode: true
        }
        #swagger.parameters['status'] = {
            description: 'Filter by booking status (Current, Upcoming, Check-out, Completed, Cancelled)',
            type: 'string',
            pattern: '^(Current|Upcoming|Check-out|Completed|Cancelled)$',
            required: false
        }
        #swagger.responses[200] = {
            description: 'Bookings retrieved successfully',
            schema: {
                err: 0,
                message: 'Bookings retrieved successfully',
                data: [
                    {
                        booking_id: '123e4567-e89b-12d3-a456-426614174000',
                        workspace_id: '123e4567-e89b-12d3-a456-426614174000',
                        start_time: '2023-10-01T14:00:00Z',
                        end_time: '2023-10-01T16:00:00Z',
                        total_price: 50.00
                    }
                ]
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

router.get(
    "/get/:id",
    verify_role(["customer"]),
    controllers.getBookingByIdController
    /*
        #swagger.description = 'Get booking by ID for the authenticated customer.'
        #swagger.summary = 'Get booking by ID'
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'string',
            format: 'uuid',
            description: 'Booking ID'
        }
        #swagger.responses[200] = {
            description: 'Booking retrieved successfully',
            schema: {
                err: 0,
                message: 'Booking retrieved successfully',
                data: {
                    booking_id: '123e4567-e89b-12d3-a456-426614174000',
                    workspace_id: '123e4567-e89b-12d3-a456-426614174000',
                    start_time: '2023-10-01T14:00:00Z',
                    end_time: '2023-10-01T16:00:00Z',
                    total_price: 50.00
                }
            }
        }
        #swagger.responses[404] = {
            description: 'Booking not found',
            schema: {
                err: 1,
                message: 'Booking not found'
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

router.delete(
    "/cancel/:id",
    verify_role(["customer"]),
    controllers.cancelBookingController
    /*
        #swagger.description = 'Cancel a booking by ID for the authenticated customer.'
        #swagger.summary = 'Cancel booking'
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'string',
            format: 'uuid',
            description: 'Booking ID'
        }
        #swagger.responses[200] = {
            description: 'Booking cancelled successfully',
            schema: {
                err: 0,
                message: 'Booking cancelled successfully'
            }
        }
        #swagger.responses[404] = {
            description: 'Booking not found',
            schema: {
                err: 1,
                message: 'Booking not found'
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

// add to calendar of google
router.post(
    "/add-to-calendar",
    verify_role(["customer"]),
    controllers.addToCalendarController
    /*
        #swagger.description = 'Add to calendar of google for the authenticated customer.'
        #swagger.summary = 'Add to calendar'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            booking_id: {
                                type: 'string',
                                example: '123e4567-e89b-12d3-a456-426614174000',
                                description: 'Booking ID'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Booking added to calendar successfully',
            schema: {
                err: 0,
                message: 'Booking added to calendar successfully'
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
        #swagger.security = [{
            "apiKeyAuth": []
        }]
    */
);

router.post(
    "/checkout/paypal",
    verify_role(["customer"]),
    controllers.paypalCheckoutController
    /*
        #swagger.description = 'Initiate PayPal checkout for a booking.'
        #swagger.summary = 'PayPal Checkout'
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
                            booking_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000',
                                description: 'Booking ID'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'PayPal checkout initiated successfully',
            schema: {
                err: 0,
                message: 'PayPal checkout initiated successfully',
                data: {
                    approval_url: 'https://www.paypal.com/checkoutnow?token=EC-1234567890'
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

router.post(
    "/checkout/paypal/success",
    verify_role(["customer"]),
    controllers.paypalSuccessController
    /*
        #swagger.description = 'Handle PayPal success payment for a booking.'
        #swagger.summary = 'PayPal Success Payment'
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
                            booking_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000',
                                description: 'Booking ID'
                            },
                            order_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000',
                                description: 'Order ID'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Payment successful',
            schema: {
                err: 0,
                message: 'Payment successful',
                data: {
                    booking_id: '123e4567-e89b-12d3-a456-426614174000',
                    payment_id: '123e4567-e89b-12d3-a456-426614174000',
                    payment_status: 'COMPLETED'
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

// refund
router.post(
    "/refund/:id",
    verify_role(["customer"]),
    controllers.refundBookingController
    /*
        #swagger.description = 'Refund a booking by ID for the authenticated customer.'
        #swagger.summary = 'Refund booking'
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'string',
            format: 'uuid',
            description: 'Booking ID'
        }
        #swagger.responses[200] = {
            description: 'Refund successful',
            schema: {
                err: 0,
                message: 'Refund successful'
            }
        }
        #swagger.responses[404] = {
            description: 'Booking not found',
            schema: {
                err: 1,
                message: 'Booking not found'
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
// amenities payment
router.post(
    "/checkout-amenities/paypal",
    verify_role(["customer"]),
    controllers.paypalCheckoutAmenitiesController
    /*
        #swagger.description = 'Initiate PayPal checkout for amenities booking.'
        #swagger.summary = 'PayPal Checkout Amenities'
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
                            booking_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000',
                                description: 'Booking ID'
                            },
                            addAmenities: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        amenity_id: {
                                            type: 'string',
                                            format: 'uuid',
                                            example: '123e4567-e89b-12d3-a456-426614174000'
                                        },
                                        quantity: {
                                            type: 'integer',
                                            example: 1
                                        }
                                    }
                                },
                                example: [
                                    {
                                        amenity_id: '123e4567-e89b-12d3-a456-426614174000',
                                        quantity: 1
                                    },
                                    {
                                        amenity_id: '223e4567-e89b-12d3-a456-426614174001',
                                        quantity: 2
                                    }
                                ]
                            },
                            total_amenities_price: {
                                type: 'number',
                                example: 500000
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'PayPal checkout initiated successfully',
            schema: {
                err: 0,
                message: 'PayPal checkout initiated successfully',
                data: {
                    approval_url: 'https://www.paypal.com/checkoutnow?token=EC-1234567890'
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

router.post(
    "/checkout-amenities/paypal/success",
    verify_role(["customer"]),
    controllers.paypalAmenitiesSuccessController
    /*
        #swagger.description = 'Handle PayPal success payment for amenities booking.'
        #swagger.summary = 'PayPal Success Payment Amenities'
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
                            booking_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000',
                                description: 'Booking ID'
                            },
                            order_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000',
                                description: 'Order ID'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Payment successful',
            schema: {
                err: 0,
                message: 'Payment successful',
                data: {
                    booking_id: '123e4567-e89b-12d3-a456-426614174000',
                    payment_id: '123e4567-e89b-12d3-a456-426614174000',
                    payment_status: 'COMPLETED'
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
