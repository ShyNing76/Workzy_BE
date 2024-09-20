import {notFound} from "../middlewares/handle_error";
<<<<<<< Updated upstream


function initWebRoutes(app) {
    app.use('/api/v1/auth', require('./auth')); // Import auth routes
    app.use('/api/v1/users', require('./user')); // Import user routes
    
=======
import swaggerUi from 'swagger-ui-express';


function initWebRoutes(app) {
    app.use('/api/v1/auth', require('./auth')
        // #swagger.tags = ['Auth']

    ); // Import auth routes
    app.use('/api/v1/customer', require('./customer')
        // #swagger.tags = ['Customer']
    ); // Import customer routes

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('../config/swagger-output.json'))); // Import Swagger UI
>>>>>>> Stashed changes
    app.use(notFound);
}

export default initWebRoutes;

