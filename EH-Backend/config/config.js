// Importing environment variables from .env file
require('dotenv').config();

/**
 * Sequelize database configuration for different environments.
 * 
 * @module config/database
 */
module.exports = {
  /**
   * Development environment configuration
   * - Uses environment variable DATABASE_URL for connection string
   * - Configures PostgreSQL dialect with SSL options
   */
  development: {
    use_env_variable: 'DATABASE_URL', 
    dialect: 'postgres', 
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
  },

  /**
   * Production environment configuration
   * - Uses environment variable DATABASE_URL for connection string
   * - Configures PostgreSQL dialect with SSL options
   */
  production: {
    use_env_variable: 'DATABASE_URL', 
    dialect: 'postgres', 
    dialectOptions: {
      ssl: {
        require: true, 
        rejectUnauthorized: false, 
      },
    },
  },
};
