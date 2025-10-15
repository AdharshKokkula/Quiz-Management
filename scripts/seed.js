/**
 * Database Seeding Script
 */

import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase, closeDatabase } from '../src/config/database.js';
import AuthService from '../src/services/auth.service.js';
import logger from '../src/utils/logger.js';

const seedData = async () => {
  try {
    await connectDatabase();
    logger.info('Starting database seeding...');
    
    // Create default admin user
    const adminUser = {
      name: 'System Administrator',
      email: 'admin@quizmanagement.com',
      phone: '9999999999',
      password: 'Admin@123',
      role: 'admin',
      status: 'verified'
    };

    const result = await AuthService.register(adminUser);
    if (result.success) {
      logger.info('Default admin user created successfully');
    } else {
      logger.info('Admin user already exists or creation failed');
    }
    
    logger.info('Seeding completed successfully');
    await closeDatabase();
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();