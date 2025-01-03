
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
//const { FileAccess } = require('./fileAccess');  // Assuming you have this model imported
//const { SharedFiles } = require('./sharedFileModel');  // Assuming you have this model imported

const Student = sequelize.define('Student', {
  stud_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Auto-increment primary key
    allowNull: false,
  },
  student_name: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  roll_no: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Assuming roll_no should be unique for each student
  },
  class: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true, // Assuming email should be unique for each student
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  timestamps: false, // Assuming no createdAt and updatedAt fields are required
  tableName: 'student', // Set table name explicitly to match PostgreSQL table name
});

// Associations
//Student.hasMany(FileAccess, { foreignKey: 'student_id' }); // A student can have many file accesses

module.exports = { Student };



/*
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
      stud_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      student_name: {
          type: DataTypes.STRING(20),
          allowNull: false
      },
      roll_no: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      class: {
          type: DataTypes.STRING(10),
          allowNull: false
      },
      email: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true
      },
      password: {
          type: DataTypes.STRING(100),
          allowNull: false
      }
  });

 // Ensure the associated model is defined and properly imported
 const SharedFiles = require('./sharedFileModel')(sequelize, DataTypes);

 // Associations
 Student.hasMany(SharedFiles, {
   foreignKey: 'studentId', // Ensure this matches your database schema
   as: 'sharedFiles',       // Optional alias
 });

  return Student;
  
};
*/