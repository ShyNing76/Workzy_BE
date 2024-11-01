import express from "express";
import * as controllers from "../../controllers";
import { uploadImages } from "../../middlewares/imageGoogleUpload";
import { verify_role, verify_token } from "../../middlewares/verifyToken";

const router = express.Router();

router.get("/total", verify_token, verify_role(["admin", "manager"]), controllers.getTotalWorkspaceController
/*
        #swagger.description = 'Endpoint to get total workspaces.'
        #swagger.summary = 'get total workspaces.'
         #swagger.parameters['building_id'] = { description: 'Building ID.' }
        #swagger.responses[200] = {
            description: 'total Workspaces get successfully.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
    );

router.get("/total-usage-workspace", 
    verify_token, 
    verify_role(["manager"]), 
    controllers.getTotalUsageWorkspacesController
    /*
        #swagger.description = 'Endpoint to get total usage workspaces.'
        #swagger.summary = 'get total usage workspaces.'
        #swagger.parameters['building_id'] = { description: 'Building ID.' }
        #swagger.responses[200] = {
            description: 'total Workspaces get successfully.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
        */
);

router.get("/total-workspace-not-in-booking", 
    verify_token, 
    verify_role(["manager"]), 
    controllers.getTotalWorkspaceNotInBookingController
/*
        #swagger.description = 'Endpoint to get total workspaces not in booking.'
        #swagger.summary = 'get total workspaces not in booking.'
        #swagger.parameters['building_id'] = { description: 'Building ID.' }
        #swagger.responses[200] = {
            description: 'total Workspaces get successfully.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
);

router.get("/top5ratingworkspace", 
    verify_token, 
    verify_role(["manager"]), 
    controllers.getTop5WorkspaceReviewController
    /*
        #swagger.description = 'Endpoint to get top 5 rating workspace.'
        #swagger.summary = 'get top 5 rating workspace.'
        #swagger.parameters['building_id'] = { description: 'Building ID.' }
        #swagger.responses[200] = {
            description: 'total Workspaces get successfully.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
        }
        #swagger.responses[500] = {
            description: 'Internal server error.'
        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
     */
)

router.post(
    "/",
    verify_token,
    verify_role(["admin"]),
    uploadImages,
    controllers.createWorkspaceController
    /*
        #swagger.description = 'Endpoint to create a new workspace.'
        #swagger.summary = 'Create a new workspace.'
        #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_name: {
                                type: 'string',
                                example: 'Landmark81_POD_1'
                            },
                            building_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '621ca0c8-e3ad-4bd8-9df5-eafe998b5b04'
                            },
                            images: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'binary'
                                },
                                description: 'Array of image files'
                            },
                            workspace_type_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '3b214914-63e8-47e3-a856-921fdee63719'
                            },
                            price_per_hour: {
                                type: 'int',
                                example: '1000000'
                            },
                            price_per_day: {
                                type: 'int',
                                example: '1000000'
                            },
                            price_per_month: {
                                type: 'int',
                                example: '1000000'
                            },
                            capacity: {
                                type: 'int',
                                example: '20'
                            },
                            area: {
                                type: 'int',
                                example: '20'
                            },
                            description: {
                                type: 'string',
                                example: 'Workspace description.'
                            },
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: 'Workspace created successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Building or workspace type not found.'
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
    verify_token,
    verify_role(["admin"]),
    uploadImages,
    controllers.updateWorkspaceController
    /*
        #swagger.description = 'Endpoint to update a workspace.'
        #swagger.summary = 'Update a workspace.'
        #swagger.parameters['id'] = { description: 'Workspace ID.' }
        #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_name: {
                                type: 'string',
                                example: 'Landmark81_POD_1'
                            },
                            building_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '621ca0c8-e3ad-4bd8-9df5-eafe998b5b04'
                            },
                            images: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'binary'
                                },
                                description: 'Array of image files'
                            },
                            remove_images: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    example: 'Image URL.'
                                },
                                description: 'Array of image URLs to remove'
                            },
                            workspace_type_id: {
                                type: 'string',
                                format: 'uuid',
                                example: '3b214914-63e8-47e3-a856-921fdee63719'
                            },
                            price_per_hour: {
                                type: 'int',
                                example: '1000000'
                            },
                            price_per_day: {
                                type: 'int',
                                example: '1000000'
                            },
                            price_per_month: {
                                type: 'int',
                                example: '1000000'
                            },
                            capacity: {
                                type: 'int',
                                example: '20'
                            },
                            area: {
                                type: 'int',
                                example: '20'
                            },
                            description: {
                                type: 'string',
                                example: 'Workspace description.'
                            },
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Workspace updated successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
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
    "/delete-image/:id",
    verify_token,
    verify_role(["admin"]),
    controllers.deleteImageOfWorkspaceController
    /*
        #swagger.description = 'Endpoint to remove a workspace image.'
        #swagger.summary = 'Remove a workspace image.'
        #swagger.parameters['id'] = { description: 'Workspace ID.' }
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
                                    example: 'image.jpg'
                                },
                                description: 'Array of image filenames to be deleted'
                            }
                        },
                        required: ['images']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Workspace image(s) deleted successfully.'
        }
        #swagger.responses[404] = {
            description: 'Workspace image(s) not found.'
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
    "/delete/:id",
    verify_token,
    verify_role(["admin"]),
    controllers.deleteWorkspaceController
    /*
        #swagger.description = 'Endpoint to remove a workspace.'
        #swagger.summary = 'Remove a workspace.'
        #swagger.parameters['id'] = { description: 'Workspace ID.' }
            }
        }
        #swagger.responses[200] = {
            description: 'Workspace deleted successfully.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
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
    controllers.getAllWorkspaceController
    /*
        #swagger.description = 'Endpoint to get all workspaces.'
        #swagger.summary = 'Get all workspaces.'
        #swagger.parameters['order'] = { description: 'Order by name, status.' }
        #swagger.parameters['page'] = { description: 'Page number.' }
        #swagger.parameters['limit'] = { description: 'Number of items per page.' }
        #swagger.parameters['workspace_name'] = { description: 'Workspace name.' }  
        #swagger.parameters['office_size'] = { description: 'Office size.' }
        #swagger.parameters['min_price'] = { description: 'Minimum price.' }
        #swagger.parameters['max_price'] = { description: 'Maximum price.' }
        #swagger.parameters['workspace_type_name'] = { description: 'Workspace type name.' }
        #swagger.parameters['building_id'] = { description: 'Building ID.' }
        #swagger.parameters['status'] = { description: 'Status.' }
        #swagger.responses[200] = {
            description: 'Workspace found.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
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
    controllers.getWorkspaceByIdController
    /*
        #swagger.description = 'Endpoint to get a workspace by ID.'
        #swagger.summary = 'Get a workspace by ID.'
        #swagger.parameters['id'] = { description: 'Workspace ID.' }
        #swagger.responses[200] = {
            description: 'Workspace found.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
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
    "/assign/:building_id",
    verify_token,
    controllers.assignWorkspaceToBuildingController
    /*
        #swagger.description = 'Endpoint to assign a workspace to a building.'
        #swagger.summary = 'Assign a workspace to a building.' 
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_ids: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'uuid',
                                    example: '621ca0c8-e3ad-4bd8-9df5-eafe998b5b04'
                                },
                                description: 'Array of workspace IDs'
                            }
                        },
                        required: ['workspace_ids']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Workspace assigned successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
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
    "/unassign/:building_id",
    verify_token,
    controllers.unassignWorkspaceToBuildingController
    /*
        #swagger.description = 'Endpoint to unallocated a workspace from building.'
        #swagger.summary = 'Unassign a workspace from building.' 
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        properties: {
                            workspace_ids: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'uuid',
                                    example: '621ca0c8-e3ad-4bd8-9df5-eafe998b5b04'
                                },
                                description: 'Array of workspace IDs'
                            }
                        },
                        required: ['workspace_ids']
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Workspace unallocated successfully.'
        }
        #swagger.responses[400] = {
            description: 'Invalid data.'
        }
        #swagger.responses[404] = {
            description: 'Workspace not found.'
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
