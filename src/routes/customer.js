import * as controller from "../controllers";
import {verify_token} from "../middlewares/verifyToken";

const router = require('express').Router();


router.get('/profile', verify_token, controller.getUser
    /*
    #swagger.description = 'Get the current customer profile.'
    #swagger.summary = 'Get the current profile of the customer'
    #swagger.security = [{
            "apiKeyAuth": []
    }] */
);

router.post('/profile/', verify_token, controller.updateUser
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

module.exports = router;