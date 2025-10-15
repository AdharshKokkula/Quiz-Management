/**
 * Main Configuration
 */

import jwtConfig from './jwt.js';
import corsConfig from './cors.js';

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || (() => {
    throw new Error('MONGO_URI environment variable is required');
  })(),
  jwt: jwtConfig,
  cors: corsConfig,
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};