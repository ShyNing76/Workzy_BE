import * as controller from "../controllers";
import {verify_admin, verify_token} from "../middlewares/verifyToken";

const router = require('express').Router();

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