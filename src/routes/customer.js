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
    #swagger.description = 'Update the current customer profile.'
    #swagger.summary = 'Update the current profile of the customer'
        #swagger.security = [{
            "apiKeyAuth": []
        }]
    } */
    controller.updateUser);

module.exports = router;