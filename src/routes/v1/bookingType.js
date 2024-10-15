import express from "express";
import * as controllers from "../../controllers/bookingType/index.js";
const router = express.Router();

router.get(
    "/",
    controllers.getBookingTypes
    /*
        #swagger.description = 'API to get all booking types'
        #swagger.responses[200] = {
            description: 'Get booking types successfully',
            schema: {
                err: 0,
                message: 'Get booking types successfully',
                data: []
            }
        }
        #swagger.security = [{
            "apiKey": []
        }]
    */
);

module.exports = router;
