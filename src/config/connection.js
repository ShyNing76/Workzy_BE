import db from '../models';

const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    port: process.env.DATABASE_PORT,
});

async function connection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const NODE_ENV = process.env.NODE_ENV || 'development';
        if (NODE_ENV === 'development') {
            db.sequelize.sync({alter: true}).then(() => {
                console.log('Database sync complete.');
            });
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connection()
