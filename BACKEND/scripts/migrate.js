import sequelize from '../config/database.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const runMigration = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync all models
    await sequelize.sync({ force: process.argv.includes('--force') });
    console.log('✅ Database models synchronized');

    // Create indexes manually if needed
    console.log('✅ Migration completed successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration(); 