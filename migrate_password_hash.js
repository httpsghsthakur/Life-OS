require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

async function runMigration() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        // Alter password_hash to allow nulls
        await sequelize.query('ALTER TABLE "Users" ALTER COLUMN password_hash DROP NOT NULL;');
        console.log('Successfully altered Users table to allow null password_hash.');
        
    } catch (error) {
        console.error('Unable to connect to the database or alter table:', error);
    } finally {
        await sequelize.close();
    }
}

runMigration();
