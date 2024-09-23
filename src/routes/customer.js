import * as controller from "../controllers";

const router = require('express').Router();


router.get('/profile',
    /*
    #swagger.description = 'Get the current customer profile.'
    #swagger.summary = 'Get the current profile of the customer'
    #swagger.security = [{
            "apiKeyAuth": []
    }] */
    controller.getUser);

router.post('/profile/',
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
                            },
                            gender: {
                                type: 'string',
                                example: 'Male'
                            },
                            date_of_birth: {
                                type: 'date',
                                example: '19/05/2004'
                            },
                            point: {
                                type: 'int',
                                example: '1000'
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
    } */
    controller.updateUser);

module.exports = router;