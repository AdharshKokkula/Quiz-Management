/**
 * Database Migration Script
 */

import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase, closeDatabase } from '../src/config/database.js';
import logger from '../src/utils/logger.js';

const migrate = async () => {
  try {
    await connectDatabase();
    logger.info('Starting database migration...');
    
    // Add migration logic here
    // Example: Create indexes, update schemas, etc.
    
    logger.info('Migration completed successfully');
    await closeDatabase();
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();