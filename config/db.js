/*
//Configuring Database Connection
const { Sequelize }  = require('sequelize');
require('dotenv').config(); // Load environment variables


const sequelize = new Sequelize('microServ', 'suraj', 'P@swan9741', {
  host: 'localhost',
  dialect: 'postgres',
  
});



console.log(sequelize);  // Add this in your db.js before you use the sequelize instance

//connection
const connectDB = async () => {
    try {
      await sequelize.authenticate();
      console.log('PostgreSQL connected');
    } catch (error) {
      console.error('Unable to connect to PostgreSQL:', error);
      process.exit(1);
    }
  };
  
// Export sequelize and connectDB function
module.exports = { sequelize, connectDB };
*/


// Configuring Database Connection
const { Sequelize } = require('sequelize');  // Import Sequelize from sequelize package
require('dotenv').config(); // Load environment variables

// Use environment variables for sensitive information
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false, // Optional: disable logging SQL queries in production
});

// Connection function
const connectDB = async () => {
    try {
      await sequelize.authenticate();
      console.log('PostgreSQL connected');
    } catch (error) {
      console.error('Unable to connect to PostgreSQL:', error);
      process.exit(1);  // Exit the process if connection fails
    }
};

// Export sequelize and connectDB function
module.exports = { sequelize, connectDB };
