// Import necessary modules
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Ensure that DATABASE_URL is set in the .env file
const databaseUrl = process.env.DATABASE_URL;

// Throw an error if DATABASE_URL is not defined in the environment variables
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in the .env file');
}

// Create a new Sequelize instance using the database URL and connection options
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres', 
  logging: false, 
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false, 
    },
  },
});

/**
 * Function to establish a connection to the database
 */
const connectDB = async () => {
  try {
    // Authenticate the connection to the database
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    // Log any error that occurs during the connection process
    console.error('Database connection failed:', error);
  }
};

// Export the sequelize instance and the connectDB function for use in other parts of the application
module.exports = { sequelize, connectDB };