import express from "express";
import * as controllers from "../controllers";
import {getAllManagersController} from "../controllers";
import {verify_admin, verify_admin_or_manager, verify_token} from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", verify_token, verify_admin_or_manager, controllers.getAllStaffController
    /*
        #swagger.description = 'Endpoint to get all staffs.'
        #swagger.summary = 'Get all staffs.'
        #swagger.parameters['order'] = { description: 'Order by email, name, role_id, status.' }
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items per page.' }
        #swagger.parameters['name'] = { description: 'Staff name.' }
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

router.get("/:id", verify_token, verify_admin_or_manager, controllers.getStaffByIdController
    /*
        #swagger.description = 'Get a staff by ID.'
        #swagger.summary = 'Get a staff by ID.'
        #swagger.parameters['id'] = { description: 'Staff ID.' }
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

router.post("/", verify_token, verify_admin, controllers.createStaffController
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

router.put("/:id", verify_token, verify_admin_or_manager, controllers.updateStaffProfileController
    /*
        #swagger.description = 'Endpoint to update a staff.'
        #swagger.summary = 'Update a staff.'
        #swagger.parameters['id'] = { description: 'Staff ID.' }
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

router.delete("/:id", verify_token, verify_admin, controllers.deleteStaffController
    /*
        #swagger.description = 'Endpoint to delete a staff.'
        #swagger.summary = 'Delete a staff.'
        #swagger.parameters['id'] = { description: 'Staff ID.' }
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

router.put("/assign/:id", verify_token, verify_admin_or_manager, controllers.assignStaffToBuildingController
    /*
        #swagger.description = 'Endpoint to assign a staff to a building.'
        #swagger.summary = 'Assign a staff to a building.'
        #swagger.parameters['id'] = { description: 'Staff ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            staff_id: {
                                type: 'integer',
                                example: 1
                            }
                        },
                        required: ['staff_id']
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

module.exports = router;