import {notFound} from "../middlewares/handle_error";
import swaggerUi from 'swagger-ui-express';


function initWebRoutes(app) {
    app.use('/api/v1/auth', require('./auth')
        // #swagger.tags = ['Auth']

    ); // Import auth routes
    app.use('/api/v1/customer', require('./customer')
        // #swagger.tags = ['Customer']
    );

    app.use('/api/v1/manager', require('./manager')
        // #swagger.tags = ['Manager']
    );

    app.use('/api/v1/building', require('./building')
        // #swagger.tags = ['Building']
    );

    app.use('/api/v1/workspace', require('./workspace')
        // #swagger.tags = ['Workspace']
    );

    app.use('/api/v1/workspaceImage', require('./workspaceImage')
        // #swagger.tags = ['Workspace Image']
    );

    app.use('/api/v1/staff', require('./staff')
        // #swagger.tags = ['Staff']
    );

    app.use('/api/v1/amenity', require('./amenity')
        // #swagger.tags = ['Amenity']
    );

    app.use('/api/v1/amenityWorkspace', require('./amenityWorkspace')
        // #swagger.tags = ['Amenities Workspace']
    );

    app.use('/api/v1/wishList', require('./wishList')
        // #swagger.tags = ['WishList']
    );

    app.use('/api/v1/review', require('./review')
        // #swagger.tags = ['Review']
    );

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('../config/swagger-output.json')));
    // Import Swagger UI
    app.use(notFound);
}

export default initWebRoutes;

