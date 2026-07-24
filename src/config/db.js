const { Sequelize } = require('sequelize');

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 30,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        dialectOptions: {
            connectTimeout: 60000,
            ssl: {
                require: true,
                rejectUnauthorized: false
            },
            keepAlive: true
        }
    })
  : new Sequelize(
        process.env.DB_NAME || 'lifeos',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASS || '',
        {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'postgres',
            logging: false,
            pool: {
                max: 30,
                min: 0,
                acquire: 60000,
                idle: 10000
            }
        }
    );

module.exports = sequelize;
