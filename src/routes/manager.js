import express from "express";
import * as controllers from "../controllers";
import {getAllManagersController} from "../controllers";
import {verify_admin, verify_token} from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", verify_token, verify_admin, controllers.getAllManagersController
    /*
        #swagger.description = 'Endpoint to get all managers.'
        #swagger.summary = 'Get all managers.'
        #swagger.parameters['order'] = { description: 'Order by email, name, role_id, status.' }
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items per page.' }
        #swagger.parameters['name'] = { description: 'Manager name.' }
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

router.get("/:id", verify_token, verify_admin, controllers.getManagerByIdController
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

router.post("/", verify_token, verify_admin, controllers.createManagerController
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

router.put("/:id", verify_token, verify_admin, controllers.updateManagerController
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
                            password: {
                                type: 'string',
                                example: 'password'
                            },
                            name: {
                                type: 'string',
                                example: 'Manager'
                            },
                            phone: {
                                type: 'string',
                                example: '1234567890'
                            },
                            date_of_birth: {
                                type: 'string',
                                example: 'MM/DD/YYYY'
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

router.delete("/:id", verify_token, verify_admin, controllers.deleteManagerController
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