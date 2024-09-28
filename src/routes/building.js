import express from "express";
import * as controllers from "../controllers";
import {verify_admin, verify_admin_or_manager, verify_token} from "../middlewares/verifyToken";

const router = express.Router();

router.use(verify_token);
router.use(verify_admin_or_manager);

router.get("/", controllers.getBuildingController
    /*
        #swagger.description = 'Endpoint to get all buildings.'
        #swagger.summary = 'Get all buildings.'
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items in a page.' }
        #swagger.parameters['order'] = { description: 'Order by column building_name|location|rating|status.' }
        #swagger.parameters['building_name'] = { description: 'Search by building name.' }
        #swagger.parameters['location'] = { description: 'Filter by location.' }
        #swagger.responses[200] = {
            description: 'Buildings found.'
        }
        #swagger.responses[404] = {
            description: 'Buildings not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.get("/:id", controllers.getBuildingByIdController
    /*
        #swagger.description = 'Endpoint to get a building by ID.'
        #swagger.summary = 'Get a building by ID.'
        #swagger.parameters['id'] = { description: 'Building ID.' }
        #swagger.responses[200] = {
            description: 'Building found.'
        }
        #swagger.responses[404] = {
            description: 'Building not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.post("/", controllers.createBuildingController
    /*
        #swagger.description = 'Endpoint to create a new building.'
        #swagger.summary = 'Create a new building.'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            building_name: {
                                type: 'string',
                                example: 'Building name'
                            },
                            location: {
                                type: 'string',
                                example: 'Hanoi|HCM'
                            },
                            address: {
                                type: 'string',
                                example: 'Building address.'
                            },
                            description: {
                                type: 'string',
                                example: 'Building description.'
                            },
                            rating: {
                                type: 'integer',
                                example: 0
                            },
                            status: {
                                type: 'string',
                                example: 'active|inactive'
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Building created successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.put("/:id", controllers.updateBuildingController
    /*
        #swagger.description = 'Endpoint to update a building.'
        #swagger.summary = 'Update a building.'
        #swagger.parameters['id'] = { description: 'Building ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            building_name: {
                                type: 'string',
                                example: 'Building name'
                            },
                            location: {
                                type: 'string',
                                example: 'Hanoi|HCM'
                            },
                            address: {
                                type: 'string',
                                example: 'Building address.'
                            },
                            description: {
                                type: 'string',
                                example: 'Building description.'
                            },
                            rating: {
                                type: 'integer',
                                example: 0
                            },
                            status: {
                                type: 'string',
                                example: 'active|inactive'
                            }
                        },
                        required: ['building_name', 'location', 'address']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Building updated successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Building not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.put("/:id/status", controllers.updateBuildingStatusController
    /*
        #swagger.description = 'Endpoint to update status of a building.'
        #swagger.summary = 'Update status of a building.'
        #swagger.parameters['id'] = { description: 'Building ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'string',
                                example: 'active|inactive'
                            }
                        },
                        required: ['status']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Building status updated successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Building not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.put("/:id/manager", verify_admin, controllers.assignManagerController
    /*
        #swagger.description = 'Endpoint to assign a manager to a building.'
        #swagger.summary = 'Assign a manager to a building.'
        #swagger.parameters['id'] = { description: 'Building ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            manager_id: {
                                type: 'integer',
                                example: 1
                            }
                        },
                        required: ['manager_id']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Manager assigned successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Building not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.put("/:id/manager/remove", verify_admin, controllers.removeManagerController
    /*
        #swagger.description = 'Endpoint to remove a manager from a building.'
        #swagger.summary = 'Remove a manager from a building.'
        #swagger.parameters['id'] = { description: 'Building ID.' }
        #swagger.responses[200] = {
            description: 'Manager removed successfully.'
        }
        #swagger.responses[404] = {
            description: 'Building not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.delete("/:id", verify_admin, controllers.deleteBuildingController
    /*
        #swagger.description = 'Endpoint to delete a building.'
        #swagger.summary = 'Delete a building.'
        #swagger.parameters['id'] = { description: 'Building ID.' }
        #swagger.responses[200] = {
            description: 'Building deleted successfully.'
        }
        #swagger.responses[404] = {
            description: 'Building not found.'
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