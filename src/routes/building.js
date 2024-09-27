import express from "express";
import * as controllers from "../controllers";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Building route");
})

router.get("/:id", (req, res) => {
    res.send("Building route");
})

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

router.put("/:id", (req, res) => {
    res.send("Building route");
    }
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
                        }
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

router.delete("/:id", (req, res) => {
    res.send("Building route");
})

module.exports = router;