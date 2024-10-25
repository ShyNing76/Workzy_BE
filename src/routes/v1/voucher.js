import express from "express";
import * as controllers from "../../controllers";
import { verify_role, verify_token } from "../../middlewares/verifyToken";

const router = express.Router();

router.get(
    "/total",
    verify_token,
    verify_role(["admin"]),
    controllers.getTotalVoucherController
    /*
        #swagger.description = 'Endpoint to get total vouchers.'
        #swagger.summary = 'Get total vouchers.'
        #swagger.responses[200] = {
            description: 'Get total vouchers successfully.'
        }
        #swagger.responses[404] = {
            description: 'Voucher not found.'
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
    "/",
    verify_token,
    controllers.getAllVoucherController
    /*
        #swagger.description = 'Endpoint to get all vouchers.'
        #swagger.summary = 'Get all vouchers.'
        #swagger.parameters['order'] = { description: 'Order by name, status.' }
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items per page.' }
        #swagger.parameters['status'] = { description: 'Status.' }
        #swagger.responses[200] = {
            description: 'Voucher found.'
        }
        #swagger.responses[404] = {
            description: 'Voucher not found.'
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
    "/:voucher_id",
    verify_token,
    controllers.getVoucherByIdController
    /*
        #swagger.description = 'Endpoint to get a voucher by ID.'
        #swagger.summary = 'Get a voucher by ID.'
        #swagger.parameters['voucher_id'] = { description: 'Voucher ID.' }
        #swagger.responses[200] = {
            description: 'Voucher found.'
        }
        #swagger.responses[404] = {
            description: 'Voucher not found.'
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
    controllers.createVoucherController
    /*
        #swagger.description = 'Endpoint to create a new voucher.'
        #swagger.summary = 'Create a new voucher.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            voucher_name: {
                                type: 'string',
                                example: 'Voucher 1'
                            },
                            voucher_code: {
                                type: 'string',
                                example: 'VOUCHER1'
                            },
                            description: {
                                type: 'string',
                                example: 'Voucher 1 description.'
                            },
                            discount: {
                                type: 'float',
                                example: '0.1'
                            },
                            quantity: {
                                type: 'number',
                                example: '10'
                            },
                            expired_date: {
                                type: 'date',
                                example: '2024-10-12'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Voucher created successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Voucher code already exists.'
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
    "/:voucher_id",
    verify_token,
    verify_role(["admin"]),
    controllers.updateVoucherController
    /*
        #swagger.description = 'Endpoint to update a voucher.'
        #swagger.summary = 'Update a voucher.'
        #swagger.parameters['voucher_id'] = { description: 'Voucher ID.' }
        #swagger.requestBody = {
            required: false,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            voucher_name: {
                                type: 'string',
                                example: 'Voucher 1'
                            },
                            voucher_code: {
                                type: 'string',
                                example: 'VOUCHER1'
                            },
                            description: {
                                type: 'string',
                                example: 'Voucher 1 description.'
                            },
                            discount: {
                                type: 'float',
                                example: '0.1'
                            },
                            quantity: {
                                type: 'number',
                                example: '10'
                            },
                            expired_date: {
                                type: 'date',
                                example: '2024-10-12'
                            },
                            status: {
                                type: 'string',
                                example: 'active'
                            }
                        },
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Voucher updated successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Voucher not found.'
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
    "/:voucher_id",
    verify_token,
    verify_role(["admin"]),
    controllers.deleteVoucherController
    /*
        #swagger.description = 'Endpoint to remove a voucher.'
        #swagger.summary = 'Remove a voucher.'
        #swagger.parameters['voucher_id'] = { description: 'Voucher ID.' }
            }
        }
        #swagger.responses[200] = {
            description: 'Voucher deleted successfully.'
        }
        #swagger.responses[404] = {
            description: 'Voucher not found.'
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
    "/valid/:voucher_code",
    verify_token,
    controllers.checkVoucherController
    /*
        #swagger.description = 'Endpoint to check a voucher.'
        #swagger.summary = 'Check a voucher.'
        #swagger.parameters['voucher_code'] = { description: 'Voucher code.' }
        #swagger.responses[200] = {
            description: 'Voucher is valid.'
        }
        #swagger.responses[404] = {
            description: 'Voucher is invalid.'
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
