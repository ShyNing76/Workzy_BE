import express from "express";
import * as controllers from "../../controllers";
const router = express.Router();

router.get("/", controllers.searchBuildingController
    /*
        #swagger.description = 'Endpoint to search buildings.'
        #swagger.summary = 'Search buildings.'
        #swagger.parameters['location'] = { description: 'Filter by location.' }
        #swagger.parameters['workspace_type_name'] = { description: 'workspace_type_name.' }
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

module.exports = router;