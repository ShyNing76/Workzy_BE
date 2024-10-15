import express from "express";
import * as controllers from "../../controllers";
import { verify_role, verify_token } from "../../middlewares/verifyToken";

const router = express.Router();

router.get(
    "/building",
    verify_token,
    controllers.getBuildingByStaffIdController
    /*
        #swagger.description = 'Get a building by staff ID.'
        #swagger.summary = 'Get a building by staff ID.'
        #swagger.responses[200] = {
            description: 'Building found.'
        }
        #swagger.responses[404] = {
            description: 'Building not found.'
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
    "/booking-type/:id",
    verify_token,
    verify_role(["admin", "manager", "staff"]),
    controllers.getBookingTypeController
    /*
        #swagger.description = 'Get all booking type.'
        #swagger.summary = 'Get all booking type.'
        #swagger.responses[200] = {
            description: 'Booking type found.'
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
    controllers.getAllStaffController
    /*
        #swagger.description = 'Endpoint to get all staffs.'
        #swagger.summary = 'Get all staffs.'
        #swagger.parameters['order'] = { description: 'Order by email, name, role_id, status.' }
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items per page.' }
        #swagger.parameters['name'] = { description: 'Staff name.' }
        #swagger.parameters['building_id'] = { description: 'Building ID.' }
        #swagger.parameters['status'] = { description: 'Status.' }
        #swagger.responses[200] = {
            description: 'Staff found.'
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
    controllers.getStaffByIdController
    /*
        #swagger.description = 'Get a staff by ID.'
        #swagger.summary = 'Get a staff by ID.'
        #swagger.parameters['id'] = { description: 'User ID.' }
        #swagger.responses[200] = {
            description: 'Staff found.'
        }
        #swagger.responses[404] = {
            description: 'Staff not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.post(
    "/",
    verify_token,
    verify_role(["admin", "manager"]),
    controllers.createStaffController
    /*
        #swagger.description = 'Endpoint to create a new staff.'
        #swagger.summary = 'Create a new staff.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                example: 'staff@gmail.com'
                            },
                            password: {
                                type: 'string',
                                example: 'password'
                            },
                            phone: {
                                type: 'string',
                                example: '0987654321'
                            },
                            name: {
                                type: 'string',
                                example: 'Staff'
                            }
                        },
                        required: ['email', 'password', 'name']
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Staff created successfully.'
        }
        #swagger.responses[400] = {
            description: 'Bad request. Invalid input.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.put(
    "/:id",
    verify_token,
    verify_role(["admin", "manager"]),
    controllers.updateStaffController
    /*
        #swagger.description = 'Endpoint to update a staff.'
        #swagger.summary = 'Update a staff.'
        #swagger.parameters['id'] = { description: 'User ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                example: 'staff@gmail.com'
                            },
                             password: {
                                type: 'string',
                                example: 'staff123'
                            },
                            phone: {
                                type: 'string',
                                example: '0987654321'
                            },
                            date_of_birth: {
                                type: 'string',
                                example: 'MM/DD/YYYY'
                            },
                            name: {
                                type: 'string',
                                example: 'Staff'
                            },
                            gender: {
                                type: 'string',
                                example: 'Male|Female|Other'
                            }
                        }
                    }
                }
            }
        }
     */
);

router.put(
    "/unactive/:id",
    verify_token,
    verify_role(["admin", "manager"]),
    controllers.unactiveStaffController
    /*
        #swagger.description = 'Endpoint to delete a staff.'
        #swagger.summary = 'Delete a staff.'
        #swagger.parameters['id'] = { description: 'User ID.' }
        #swagger.responses[200] = {
            description: 'Staff deleted successfully.'
        }
        #swagger.responses[404] = {
            description: 'Staff not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.put(
    "/active/:id",
    verify_token,
    verify_role(["admin", "manager"]),
    controllers.activeStaffController
    /*
        #swagger.description = 'Endpoint to unblock a staff.'
        #swagger.summary = 'Unblock a staff.'
        #swagger.parameters['id'] = { description: 'User ID.' }
        #swagger.responses[200] = {
            description: 'Staff unblocked successfully.'
        }
        #swagger.responses[404] = {
            description: 'Staff not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
    */
);

router.put(
    "/assign/:id",
    verify_token,
    verify_role(["admin", "manager"]),
    controllers.assignStaffToBuildingController
    /*
        #swagger.description = 'Endpoint to assign a staff to a building.'
        #swagger.summary = 'Assign a staff to a building.'
        #swagger.parameters['id'] = { description: 'User ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            building_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000'
                            }
                        },
                        required: ['building_id']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Staff assigned successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Staff not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.put(
    "/unassign/:id",
    verify_token,
    verify_role(["admin", "manager"]),
    controllers.removeStaffFromBuildingController
    /*
        #swagger.description = 'Endpoint to unassign a staff from a building.'
        #swagger.summary = 'Unassign a staff from a building.'
        #swagger.parameters['id'] = { description: 'User ID.' }
        #swagger.responses[200] = {
            description: 'Staff unassigned successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = { 
            description: 'Staff not found.'
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
    "/booking-status/:id",
    verify_token,
    verify_role(["admin", "manager", "staff"]),
    controllers.getBookingStatusController
    /*
        #swagger.description = 'Endpoint to get all booking status.'
        #swagger.summary = 'Get all booking status.'
        #swagger.parameters['id'] = { description: 'Workspace Id.' }
        #swagger.responses[200] = {
            description: 'Booking status found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
     */
);

router.post(
    "/change-status/:booking_id",
    verify_token,
    verify_role(["staff"]),
    controllers.changeBookingStatusController
    /*
        #swagger.description = 'Endpoint to change booking status.'
        #swagger.summary = 'Change booking status.'
        #swagger.parameters['booking_id'] = { description: 'Booking Id.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'string',
                                enum: ['paid', 'check-in', 'in-process', 'check-out', 'check-amenities', 'completed', 'cancelled'],
                                example: 'paid'
                            }
                        },
                        required: ['status']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Booking status changed successfully.'
        }
        #swagger.responses[400] = {
            description: 'Bad request.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
     */
);

router.get(
    "/check-amenities/booking/:id",
    verify_token,
    verify_role(["staff"]),
    controllers.getAmenitiesByBookingIdController
    /*
        #swagger.description = 'Get all amenities by booking ID.'
        #swagger.summary = 'Get all amenities by booking ID.'
        #swagger.parameters['id'] = { description: 'Booking ID.' }
        #swagger.responses[200] = {
            description: 'Booking found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.post(
    "/broken-amenities-booking",
    verify_token,
    verify_role(["staff"]),
    controllers.createBrokenAmenitiesBookingController
    /*
        #swagger.description = 'Endpoint to create a broken amenities price.'
        #swagger.summary = 'Create a broken amenities price.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            amenitiy_name: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    example: 'Amenity Name'
                                }
                            }
                        },
                        required: ['amenitiy_name']
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Booking created successfully.'
        }
        #swagger.responses[400] = {
            description: 'Bad request. Invalid input.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
)

module.exports = router;
