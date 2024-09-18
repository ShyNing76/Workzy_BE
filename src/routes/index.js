import {notFound} from "../middlewares/handle_error";


function initWebRoutes(app) {
    app.use('/api/v1/auth', require('./auth')); // Import auth routes
    app.use('/api/v1/users', require('./user')); // Import user routes
    
    app.use(notFound);
}

export default initWebRoutes;

