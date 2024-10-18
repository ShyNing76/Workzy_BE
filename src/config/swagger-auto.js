import swaggerAutogen from "swagger-autogen";

require("dotenv").config();

const serverUrl = process.env.SERVER_URL; // Đường dẫn của server

const doc = {
    openapi: "3.1.0",
    info: {
        title: "Workzy API",
        version: "1.0.0", // Phiên bản
        description: "API POD Booking System for Workzy", // Mô tả
    },
    servers: [
        {
            url: serverUrl,
            description: "Production Server",
        },
        {
            url: "http://localhost:5000/",
            description: "Local Development Server",
        }
    ],
    components: {
        securitySchemes: {
            apiKeyAuth: {
                type: "apiKey",
                in: "header", // 'header', 'query', or 'cookie'
                name: "Authorization", // name of the header
                description: "Bearer <token>", // value for the header
            },
        },
    },
    security: [
        {
            apiKeyAuth: [],
        },
    ],
};

const outputFile = "./swagger-output.json";
const routes = ["./src/routes/v1/index.js"];

swaggerAutogen({ openapi: "3.1.0" })(outputFile, routes, doc);
