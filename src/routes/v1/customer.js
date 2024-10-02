import * as controller from "../../controllers";
import {verify_admin, verify_token} from "../../middlewares/verifyToken";

const router = require('express').Router();

router.get('/', verify_token, verify_admin, controller.getAllUsersController
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

router.put('/remove/:id', verify_token, verify_admin, controller.removeUserController
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

module.exports = router;