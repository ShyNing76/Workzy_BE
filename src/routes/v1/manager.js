import express from "express";
import * as controllers from "../../controllers";
import { verify_role, verify_token } from "../../middlewares/verifyToken";

const router = express.Router();

router.get(
    "/",
    verify_token,
    verify_role(["admin"]),
    controllers.getAllManagersController
    /*
        #swagger.description = 'Endpoint to get all managers.'
        #swagger.summary = 'Get all managers.'
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items per page.' }
        #swagger.parameters['order'] = {
            in: 'query',
            description: 'Order by field.',
            '@schema': {
                type: 'array',
                items: {
                    type: 'string',
                    pattern: '^(name|email|phone|date_of_birth|gender)$',
                    example: 'name'
                }
            },
            explode: true,
            required: false
        }
        #swagger.parameters['name'] = { description: 'Manager name.' }
        #swagger.parameters['email'] = { description: 'Manager email.' }
        #swagger.parameters['phone'] = { description: 'Manager phone.' }
        #swagger.parameters['date_of_birth'] = { description: 'Manager date of birth.' }
        #swagger.responses[200] = {
            description: 'Managers found.'
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
    "/buildings",
    verify_token,
    verify_role(["manager"]),
    controllers.getBuildingByManagerIdController
    /*
        #swagger.description = 'Get a building by Manager ID.'
        #swagger.summary = 'Get a building by Manager ID.'
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
    "/:id",
    verify_token,
    verify_role(["admin", "manager"]),
    controllers.getManagerByIdController
    /*
        #swagger.description = 'Get a manager by ID.'
        #swagger.summary = 'Get a manager by ID.'
        #swagger.parameters['id'] = { description: 'Manager ID.' }
        #swagger.responses[200] = {
            description: 'Manager found.'
        }
        #swagger.responses[404] = {
            description: 'Manager not found.'
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
    verify_role(["admin"]),
    controllers.createManagerController
    /*
        #swagger.description = 'Endpoint to create a new manager.'
        #swagger.summary = 'Create a new manager.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                example: 'manager@gmail.com'
                            },
                            password: {
                                type: 'string',
                                example: 'password'
                            },
                            phone: {
                                type: 'string',
                                example: '0997658634'
                            },
                            name: {
                                type: 'string',
                                example: 'Manager'
                            }
                        },
                        required: ['email', 'password', 'name']
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Manager created successfully.'
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
    controllers.updateManagerController
    /*
        #swagger.description = 'Endpoint to update a manager.'
        #swagger.summary = 'Update a manager.'
        #swagger.parameters['id'] = { description: 'Manager ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                example: 'manager@gmail.com'
                            },
                            phone: {
                                type: 'string',
                                example: '1234567890'
                            },
                            date_of_birth: {
                                type: 'string',
                                example: 'MM/DD/YYYY'
                            },
                            name: {
                                type: 'string',
                                example: 'Manager'
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

router.delete(
    "/:id",
    verify_token,
    verify_role(["admin"]),
    controllers.deleteManagerController
    /*
        #swagger.description = 'Endpoint to delete a manager.'
        #swagger.summary = 'Delete a manager.'
        #swagger.parameters['id'] = { description: 'Manager ID.' }
        #swagger.responses[200] = {
            description: 'Manager deleted successfully.'
        }
        #swagger.responses[404] = {
            description: 'Manager not found.'
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
