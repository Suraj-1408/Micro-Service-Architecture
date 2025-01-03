/*
const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../../config/db');  // Adjust the path as needed
const { FileAccess } = require('./fileAccess');  // Assuming you have this model imported

const SharedFiles = sequelize.define('SharedFiles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  path: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  upload_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,  // Default value to current timestamp
  },
  admin_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  file_size: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  timestamps: false, // Assuming no createdAt/updatedAt columns
  tableName: 'shared_files', // Ensure the table name matches exactly
});

// Association - One SharedFile can be accessed by many FileAccess records
SharedFiles.hasMany(FileAccess, { foreignKey: 'file_id' });


module.exports =  SharedFiles;
*/

/*
module.exports = (sequelize, DataTypes) => {
  const SharedFiles = sequelize.define('SharedFiles', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      filename: {
          type: DataTypes.STRING(255),
          allowNull: false
      },
      path: {
          type: DataTypes.TEXT,
          allowNull: false
      },
      upload_date: {
          type: DataTypes.DATE
      },
      admin_name: {
          type: DataTypes.STRING(100),
          allowNull: false
      },
      file_size: {
          type: DataTypes.BIGINT,
          allowNull: false
      }
  });

  // Ensure the FileAccess model is defined before association
  const FileAccess = sequelize.models.FileAccess || require('./fileAccess')(sequelize, DataTypes);

  // Associations
  SharedFiles.hasMany(FileAccess, { 
    foreignKey: 'file_id', 
    as: 'fileAccessRecords', // Optional alias for clarity
  });

  return SharedFiles;
};

*/