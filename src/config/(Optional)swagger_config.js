const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Định nghĩa các cấu hình của Swagger
const swaggerDefinition = {
    openapi: '3.0.0', // Phiên bản OpenAPI
    info: {
        title: 'Base nodejs app', // Tiêu đề
        version: '1.0.0', // Phiên bản
        description: 'Tạo base dự án sau này clone cho nhanh', // Mô tả
    },
    servers: [
        {
            url: 'http://localhost:3000', // Đường dẫn của server
            description: 'Development server',
        },
        // Có thể thêm nhiều server khác
    ],
};

const options = {
    swaggerDefinition,
    // Đường dẫn đến các file có chứa chú thích của API
    apis: ['../routes']
};
const swaggerSpec = swaggerJSDoc(options);

module.exports = {swaggerSpec, swaggerUi};
