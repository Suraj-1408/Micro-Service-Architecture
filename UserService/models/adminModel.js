// models/adminModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db'); // Adjust the path to your database configuration file

const Admin = sequelize.define('Admin', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Admin;
