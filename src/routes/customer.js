import * as controller from "../controllers";
import {verify_admin, verify_token} from "../middlewares/verifyToken";

const router = require('express').Router();


router.get('/profile', verify_token, controller.getUser
    /*
    #swagger.description = 'Get the current customer profile.'
    #swagger.summary = 'Get the current profile of the customer'
    #swagger.security = [{
            "apiKeyAuth": []
    }] */
);

router.put('/profile/', verify_token, controller.updateUser
    /*
         #swagger.requestBody = {
             required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    example: 'John doe'
                                },
                                gender: {
                                    type: 'string',
                                    example: 'Male|Female|Others'
                                },
                                date_of_birth: {
                                    type: 'date',
                                    example: 'MM/DD/YYYY'
                                }
                            },
                            required: []
                        }
                    }
                }
         }
        #swagger.description = 'Update the current customer profile.'
        #swagger.summary = 'Update the current profile of the customer'
            #swagger.security = [{
                "apiKeyAuth": []
            }]
        } */);

router.put('/password', verify_token, controller.updatePassword
    /*
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: 'object',
                    properties: {
                        current_password: {
                            type: 'string',
                            example: 'password123'
                        },
                        new_password: {
                            type: 'string',
                            example: 'password1234'
                        }
                    },
                    required: ['current_password', 'new_password']
                }
            }
        }
    }
    #swagger.description = 'Update the current customer password.'
    #swagger.summary = 'Update the current password of the customer'
    #swagger.security = [{
            "apiKeyAuth": []
    }] */
);

router.put('/phone', verify_token, controller.updatePhone
    /*
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: 'object',
                    properties: {
                        phone: {
                            type: 'string',
                            example: '0987654321'
                        }
                    },
                    required: ['phone']
                }
            }
        }
    }
    #swagger.description = 'Update the current customer phone number.'
    #swagger.summary = 'Update the current phone number of the customer'
    #swagger.security = [{
            "apiKeyAuth": []
    }] */
);

router.put('/email', verify_token, controller.updateEmail 
    /*
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            example: 'example@gmail.com'
                        }
                    },
                    required: ['email']
                }
            }
        }
    }
    #swagger.description = 'Update the current customer email.'
    #swagger.summary = 'Update the current email of the customer'
    #swagger.security = [{
            "apiKeyAuth": []
    }] */
);

router.put('/remove/:id', verify_token, verify_admin, controller.removeUser
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