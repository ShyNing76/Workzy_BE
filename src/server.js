import initWebRoutes from "./routes";
import express from 'express';
import cors from 'cors';
import swaggerDocument from "./config/swagger.json"; // Import swaggerDocument from config/swagger.json
import swaggerUi from 'swagger-ui-express';

require('dotenv').config();

// require('./config/connection')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

initWebRoutes(app);

app.listen(port, host, () => {
    console.log(`Server is running on ${port}`);
    console.log(`Swagger is running on http://${host}:${port}/api-docs`);
})