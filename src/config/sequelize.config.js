const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    development: {
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: process.env.DATABASE_DIALECT,
        pool: {
            max: 10, // Số lượng kết nối tối đa trong pool
            min: 0,   // Số lượng kết nối tối thiểu trong pool
            acquire: 60000, // Thời gian tối đa (ms) để lấy kết nối
            idle: 10000     // Thời gian tối đa (ms) để giữ kết nối không hoạt động trước khi giải phóng
        },
    },
    test: {
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: process.env.DATABASE_DIALECT,
    },
    production: {
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: process.env.DATABASE_DIALECT,
    },
};
