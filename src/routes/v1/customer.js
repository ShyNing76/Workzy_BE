import * as controller from "../../controllers";
import { verify_role, verify_token } from "../../middlewares/verifyToken";

const router = require("express").Router();

router.get(
    "/",
    verify_token,
    verify_role(["admin"]),
    controller.getAllUsersController
    /* #swagger.description = 'Endpoint to get all customers.'
    #swagger.summary = 'Get all customers.'
    #swagger.parameters['order'] = {
        description: 'Order by email, name, role_id, status.',
        '@schema': {
            type: 'array',
            items: {
                type: 'string',
                pattern: '^(email|name|role_id|status|asc|desc)$',
                example: 'email'
            }
        },
        required: false,
        explode: true
    }
    #swagger.parameters['page'] = {description: 'Page number.'}
    #swagger.parameters['limit'] = {description: 'Number of items per page.'}
    #swagger.parameters['name'] = {description: 'Customer name.'}
    #swagger.responses[200] = {
        description: 'Customers found.'
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
    "/remove/:id",
    verify_token,
    verify_role(["admin"]),
    controller.removeUserController
    /*
    #swagger.description = 'Remove a customer.'
    #swagger.summary = 'Remove a customer'
    #swagger.security = [{
            "apiKeyAuth": []
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the customer to remove',
        required: true,
        type: 'integer'
    } */
);

router.get(
    "/membership",
    verify_token,
    controller.getMembershipController
    /* #swagger.description = 'Endpoint to get membership.'
    #swagger.summary = 'Get membership.'
    #swagger.responses[200] = {
        description: 'Membership found.'
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
    "/notification",
    verify_token,
    verify_role(["customer"]),
    controller.getNotificationsController
    /* #swagger.description = 'Endpoint to get notifications.'
    #swagger.summary = 'Get notifications.'
    #swagger.parameters['page'] = {description: 'Page number.'}
    #swagger.parameters['limit'] = {description: 'Number of items per page.'}
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

router.get(
    "/:id",
    verify_token,
    verify_role(["admin", "staff", "manager"]),
    controller.getUserByIdController
    /* #swagger.description = 'Endpoint to get customer by ID.'
    #swagger.summary = 'Get customer by ID.'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the customer to get',
        required: true,
        type: 'integer'
    }
    #swagger.responses[200] = {
        description: 'Customer found.'
    }
    #swagger.responses[404] = {
        description: 'Customer not found.'
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
    "/change-status/:id",
    verify_token,
    verify_role(["customer"]),
    controller.changeStatusController
    /* #swagger.description = 'Endpoint to change status of a customer.'
    #swagger.summary = 'Change status of a customer'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Id of the booking to change status',
        required: true,
        type: 'string'
    }
    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['check-in', 'check-out'],
                            description: 'Status to change (Check-in, Check-out)'
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[200] = {
        description: 'Change status successful.'
    }
    #swagger.responses[400] = {
        description: 'Change status failed.'
    }
    #swagger.responses[500] = {
        description: 'Internal server error.'
    }
    #swagger.security = [{
            "apiKeyAuth": []
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the customer to change status',
        required: true,
        type: 'integer'
    } */
);

module.exports = router;
