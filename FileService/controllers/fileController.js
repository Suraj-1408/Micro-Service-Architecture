//Logic for managing the locking /unlocking or update of the rows.
const locks = require('../models/locks');
const libreOfficeHelper = require('../helpers/libreOfficeHelper');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../../config/db');

//shared file data.
let sharedFiles = [];


/*
exports.uploadFile = async (req, res) => {
  console.log("File upload endpoint hit");
  console.log("File data:", req.file);
  
  if(!req.file){
    return res.status(400).json({ error: 'File upload failed. Only .ods files are allowed.' });
  }


  const { originalname, path: filePath, size } = req.file;
  const adminEmail = req.user?.email || 'unknown@example.com'; // Get email from req.user or set a default
 
    const query = `
    INSERT INTO shared_files(filename,path,upload_date,admin_name,file_size) 
    VALUES(:filename, :path, NOW(), :adminName, :fileSize) RETURNING *;
    `;

    const values = {
      filename: originalname,
      path: filePath,
      adminName: adminEmail,
      fileSize: size
    };
    
    console.log("Values to be inserted:", values);
  try{
  
    //Uisng sequelize.query to run the raw sql.
    const result = await sequelize.query(query,{
      replacements: values,
      type: sequelize.QueryTypes.INSERT
    });

    console.log('File metadata added to database:', result[0][0]);

    res.json({ message: 'File uploaded successfully', file: result[0][0] });
  }catch(err){
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Error occurred while uploading file.' });
  }

};

*/

exports.uploadFile = async (req, res) => {
  console.log("File upload endpoint hit");
  console.log("File data:", req.file);
  
  if (!req.file) {
    return res.status(400).json({ error: 'File upload failed. Only .ods files are allowed.' });
  }

  const { originalname, path: filePath, size } = req.file;
  const adminEmail = req.user?.email || 'unknown@example.com'; // Get email from req.user or set a default
  
  const query = `
    INSERT INTO shared_files(filename, path, upload_date, admin_name, file_size) 
    VALUES(:filename, :path, NOW(), :adminName, :fileSize) RETURNING *;
  `;

  const values = {
    filename: originalname,
    path: filePath,
    adminName: adminEmail,
    fileSize: size
  };
  
  console.log("Values to be inserted:", values);

  try {
    // Insert file metadata into shared_files table
    const result = await sequelize.query(query, {
      replacements: values,
      type: sequelize.QueryTypes.INSERT
    });

    console.log('File metadata added to database:', result[0][0]);

    // Get the file ID of the newly uploaded file
    const fileId = result[0][0].id;

    // Get all students from the student table
    const students = await sequelize.query('SELECT stud_id FROM student', {
      type: sequelize.QueryTypes.SELECT
    });

    // Insert records into file_access table for each student with `can_access` set to false
    const accessPromises = students.map(student =>
      sequelize.query(
        'INSERT INTO file_access(student_id, file_id, can_access) VALUES(:studentId, :fileId, false)',
        {
          replacements: { studentId: student.stud_id, fileId: fileId },
          type: sequelize.QueryTypes.INSERT
        }
      )
    );

    // Wait for all promises to resolve
    await Promise.all(accessPromises);

     // Send response back to the client with the relative path
     const relativePath = `/uploads/${path.basename(filePath)}`;  // Extract the file name and make it relative

    // Send response back to the client
    res.json({ 
      message: 'File uploaded and access permissions reset for all students', 
      file: result[0][0] ,
      fileUrl: relativePath,  // Send the relative URL to the file
      shouldActivatePermit: true // Indicate to activate the permit button
    });

  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Error occurred while uploading file.' });
  }
};


exports.getSharedFiles = async (req, res) => {
  console.time('Request received for shared files...');
  
    try {  
      const query = 'SELECT * FROM shared_files ORDER BY upload_date DESC;';
      const result = await sequelize.query(query,{
        type: sequelize.QueryTypes.SELECT
      });
  
      if (result.length === 0) {
        console.log('No files found');
        return res.status(404).json({ message: 'No shared files found' });
      }
  
      res.json({ files: result });
      console.log('Response sent with shared files:', result);

  } catch (err) {
    console.error('Error in getting shared files:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
  finally{
    console.timeEnd("getSharedFiles");
  }
};


// Retrieve admin dashboard data
exports.getAdminDashboardData = async(req, res) => {
  try {
    const adminData = {
      files: sharedFiles,
      totalFiles: sharedFiles.length,
      lastUploadDate: sharedFiles.length ? sharedFiles[sharedFiles.length - 1].uploadDate : null,
    };
    res.json(adminData);
  } catch (error) {
    console.error('Error retrieving admin dashboard data:', error);
    res.status(500).json({ error: 'Error occurred while retrieving dashboard data.' });
  }
};


exports.getAccessPermit = async (req,res) =>{
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Toggle access (Assuming 'can_access' is a boolean field in your database)
    user.can_access = !user.can_access;
    await user.save();

    res.json({ message: 'Access toggled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }

};


exports.getUserFiles = async(req,res) => {
  const userId = req.user?.id; // Assume user ID is stored in the session or JWT

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  try {
    // Fetch files the user has access to
    const files = await File.findAll({
      include: {
        model: User,
        where: { id: userId, can_access: true },
      },
    });

    res.json(files);
  } catch (err) {
    console.error('Error fetching user files:', err);
    res.status(500).json({ error: 'Failed to retrieve files' });
  }

};




exports.lockRow = (req, res) => {
  const { filename, row, userId } = req.body;

  if (locks.isRowLocked(row) && locks.getLockOwner(row) !== userId) {
    return res.status(403).json({ message: 'Row is locked by another user' });
  }

  locks.lockRow(row, userId);
  res.json({ success: true, message: `Row ${row} locked by user ${userId}` });
};

exports.unlockRow = (req, res) => {
  const { row, userId } = req.body;

  if (locks.getLockOwner(row) === userId) {
    locks.unlockRow(row);
    res.json({ success: true, message: `Row ${row} unlocked` });
  } else {
    res.status(403).json({ message: 'Cannot unlock row, it is locked by another user' });
  }
};

exports.updateRow = async (req, res) => {
  const { filename, row, data, userId } = req.body;

  if (locks.getLockOwner(row) !== userId) {
    return res.status(403).json({ message: 'Row is locked by another user' });
  }

  await libreOfficeHelper.updateRowInOds(filename, row, data);
  res.json({ success: true, message: 'Row updated successfully' });
};