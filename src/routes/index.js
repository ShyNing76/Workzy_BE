import {notFound} from "../middlewares/handle_error";
import {swaggerSpec, swaggerUi} from "../config/swagger_config";


function initWebRoutes(app) {
    app.use('/api/v1/auth', require('./auth')); // Import auth routes
    app.use('/api/v1/users', require('./user')); // Import user routes

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use(notFound);
}

export default initWebRoutes;

