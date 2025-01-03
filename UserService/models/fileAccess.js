// models/fileAccess.js
//const { Sequelize, DataTypes } = require('sequelize');

const { sequelize }= require('../../config/db');  // Adjust the path as needed
const { Student } = require('./studentModel');
//const { SharedFiles } = require('./sharedFileModel');
const { DataTypes } = require('sequelize');

const FileAccess = sequelize.define('FileAccess', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  can_access: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'file_access',  // Ensure table name matches the actual table name in your database
  timestamps: false,  // Assuming no createdAt or updatedAt fields are needed
});

//FileAccess.belongsTo(Student, { foreignKey: 'student_id' });
//FileAccess.belongsTo(SharedFiles, { foreignKey: 'file_id' });

module.exports = FileAccess;


/*

module.exports = (sequelize, DataTypes) => {
  const FileAccess = sequelize.define('FileAccess', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'SharedFiles',
        key: 'id',
      },
    },
    accessed_by: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    access_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Reverse association
  FileAccess.belongsTo(sequelize.models.SharedFiles, { foreignKey: 'file_id', as: 'sharedFile' });

  return FileAccess;
};
*/