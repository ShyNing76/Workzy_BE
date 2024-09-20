require('dotenv').config();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const serverUrl = process.env.SERVER_URL + '/api/v1';

// Định nghĩa các cấu hình của Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Phiên bản OpenAPI
        info: {
            title: 'Workzy API', // Tiêu đề
            version: '1.0.0', // Phiên bản
            description: 'API POD Booking System for Workzy', // Mô tả
        },
        servers: [
            {
                url: serverUrl, // Đường dẫn của server
                description: 'Development server',
            },
            // Có thể thêm nhiều server khác
        ]
    },
    apis: ['./src/routes/*.js'], // Đường dẫn đến các file có chứa chú thích của API
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = {swaggerSpec, swaggerUi};
