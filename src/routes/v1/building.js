import express from "express";
import * as controllers from "../../controllers";
import { verify_role, verify_token } from "../../middlewares/verifyToken";
import { uploadImages } from "../../middlewares/imageGoogleUpload";

const router = express.Router();

router.get(
    "/",
    controllers.getBuildingController
    /*
        #swagger.description = 'Endpoint to get all buildings.'
        #swagger.summary = 'Get all buildings.'
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items in a page.' }
        #swagger.parameters['order'] = {
            in: 'query',
            description: 'Order by column building_name|location|rating|status.',
            '@schema': {
                type: 'array',
                items: {
                    type: 'string',
                    pattern: '^(building_name|location|rating|status|asc|desc)$',
                    example: 'building_name'
                }
            },
            explode: true,
            required: false
        }
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

router.get(
    "/:id",
    controllers.getBuildingByIdController
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

router.use(verify_token);

router.post(
    "/",
    verify_role(["admin"]),
    uploadImages,
    controllers.createBuildingController
    /*
        #swagger.description = 'Endpoint to create a new building.'
        #swagger.summary = 'Create a new building.'
        #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: 'object',
                        required: ['building_name', 'location', 'address', 'google_address', 'images'],
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
                            google_address: {
                                type: 'string',
                                example: 'https://goo.gl/maps/1234abcd'
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
                            },
                            images: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'binary'
                                },
                                description: 'Array of image files'
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

router.put(
    "/:id",
    verify_role(["admin", "manager"]),
    uploadImages,
    controllers.updateBuildingController
    /*
        #swagger.description = 'Endpoint to update a building.'
        #swagger.summary = 'Update a building.'
        #swagger.parameters['id'] = { description: 'Building ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
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
                            google_address: {
                                type: 'string',
                                example: 'https://goo.gl/maps/1234abcd'
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
                            },
                            images: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'binary',
                                    description: 'Image files'
                                }
                            },
                        },
                        required: ['building_name', 'location', 'address', 'google_address', 'images']
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

router.put(
    "/:id/status",
    verify_role(["admin", "manager"]),
    controllers.updateBuildingStatusController
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

router.delete(
    "/:id/image",
    verify_role(["admin", "manager"]),
    controllers.deleteBuildingImageController
    /*
        #swagger.description = 'Endpoint to delete images of a building.'
        #swagger.summary = 'Delete images of a building.'
        #swagger.parameters['id'] = { description: 'Building ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            images: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    example: 'Image URL.'
                                }
                            }
                        },
                        required: ['images']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Images deleted successfully.'
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

router.put(
    "/:id/manager",
    verify_role(["admin"]),
    controllers.assignManagerController
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
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000'
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

router.put(
    "/:id/manager/remove",
    verify_role(["admin"]),
    controllers.removeManagerController
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

router.delete(
    "/:id",
    verify_role(["admin"]),
    controllers.deleteBuildingController
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
