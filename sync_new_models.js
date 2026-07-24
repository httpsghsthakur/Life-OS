require('dotenv').config();
const { sequelize } = require('./src/models');

async function syncNewModels() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        
        console.log('Syncing models...');
        // We will just call sync() without alter:true. 
        // This will create new tables that don't exist without trying to alter existing ones.
        await sequelize.sync(); 
        
        console.log('Successfully created new tables.');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
}

syncNewModels();
