const express = require('express');
const { Pool } = require('pg'); // pg module to interact with Postgres
const { sequelize } = require('../../config/db');
const { Student } = require('../models/studentModel');
const { FileAccess } = require('../models/fileAccess');
const { SharedFiles } = require('../models/sharedFileModel');  // Import SharedFiles model
const { noTrueLogging } = require('sequelize/lib/utils/deprecations');

const router = express.Router();

//const { Student } = require('../models/studentModel');
//const { FileAccess } = require('../models/fileAccess');
//const { SharedFiles } = require('../models/sharedFiles');  // Import SharedFiles model

/*
router.get('/', async (req, res) => {
  try {
    // Fetch students with their associated file access information and file details
    const users = await Student.findAll({
      include: [
        {
          model: FileAccess,
          attributes: ['file_id', 'can_access'],
          include: [
            {
              model: SharedFiles,
              attributes: ['filename'], // Only need the filename for display
            }
          ]
        }
      ]
    });

    // Format the response data to include only required fields (name, email, file info with permit button)
    const userData = users.map(user => ({
      student_name: user.student_name,
      email: user.email,
      stud_id: user.stud_id,
      file_info: user.FileAccess ? user.FileAccess.map(fileAccess => ({
        file_id: fileAccess.file_id,
        filename: fileAccess.SharedFile ? fileAccess.SharedFile.filename : null,
        can_access: fileAccess.can_access,
      })) : [],
    }));

    // Send formatted data to front-end
    res.json(userData);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});
*/


//Routes handler for displaying resgister user names
router.get('/', async (req, res) => {
  try {
    const users = await Student.findAll();
    
    
    console.log('Fetched users:', users); // Log fetched users

    if (!users.length) {
      console.log('No users found'); // Debug log
      return res.status(404).json({ message: 'No users found' });
    }
    console.log('Users being sent to client:', users); // Add this log here
    res.json(users);

  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});




/*
// Route handler to permit access
router.post('/api/permit-access', async (req, res) => {
  const { studentId, fileId } = req.body;

  // Check if studentId and fileId are provided
  if (!studentId || !fileId) {
    return res.status(400).json({ error: 'Missing studentId or fileId' });
  }

  try {
    // Assuming you have a method to update the file access in your model or database
    const fileAccess = await FileAccess.update({ studentId, fileId });

    if (fileAccess) {
      return res.status(200).json({ message: 'Access granted successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to update file access' });
    }
  } catch (error) {
    console.error('Error permitting access:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
*/

/*
router.post('/api/permit-access', async (req, res) => {
  console.log('Request body:', req.body); // Debug incoming request body

  const { studentId, fileId } = req.body;

  // Ensure both studentId and fileId are present in the request body
  if (!studentId || !fileId) {
    console.error('Missing studentId or fileId in request body');

    return res.status(400).json({ message: 'File ID and Student ID are required' });
  }

  console.log("Student ID:", studentId);
  console.log("File ID:", fileId);

  try {
    // Validate that studentId and fileId are numbers (if required by your database schema)
    if (isNaN(studentId) || isNaN(fileId)) {
      return res.status(400).json({ message: 'Student ID and File ID must be valid numbers' });
    }

    // Use the FileAccess model to update can_access field
    const [updatedRows] = await FileAccess.update(
      { can_access: true },
      { where: { student_id: studentId, file_id: fileId } }
    );

    console.log('Updated rows:', updatedRows); // Log the number of updated rows

    if (updatedRows > 0) {
      res.json({ message: 'Access granted successfully' });
    } else {
      res.status(400).json({ message: 'No rows updated, possibly invalid IDs' });
    }
  } catch (error) {
    console.error('Error granting access:', error);
    res.status(500).json({ error: 'An error occurred while granting access.' });
  }
});

*/

/*
router.post('/api/permit-access', async (req, res) => {
  console.log("API hit");
  const { studentId,sharedFileId, fileId } = req.body;

  if (!studentId || !fileId ) {
    return res.status(400).json({ success: false,message: 'File ID and Student ID are required' });
  }

  console.log("Student ID:", studentId);
console.log("File ID:", fileId);

  try {
    
    // Check if the file exists in the shared_files table
    const fileExists = await sequelize.query(
      'SELECT * FROM shared_files WHERE id = :fileId',
      {
        replacements: { fileId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    console.log('File Exists:', fileExists);

    if (fileExists.length === 0) {
      // If the file doesn't exist, return an error
      return res.status(404).json({ success: false, message: 'File not found in shared_files' });
    }
    
    // Check if the record already exists
    const existingRecord = await sequelize.query(
      'SELECT * FROM file_access WHERE student_id = :studentId AND file_id = :fileId',
      {
        replacements: { studentId, fileId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    console.log('Existing record:', existingRecord);

    if (existingRecord.length === 0) {
      // If no existing record, return an error
      return res.status(404).json({ success: false, message: 'Record not found in file_access' });
    }


    // Update the can_access field to true for the specific student and file
    const [results] = await sequelize.query(
      //'UPDATE file_access SET can_access = true WHERE student_id = :studentId AND file_id = :fileId',
'       INSERT INTO file_access (file_id,id,can_access,student_id) VALUES (:fileId,:sharedFileId, true,:studentId)',
      {
        replacements: { studentId, fileId },
        type: sequelize.QueryTypes.UPDATE
      }  
    );
    console.log('Rows affected:', results); // Log number of rows affected

    res.json({ success: true,message: 'Access granted successfully' });
  } catch (error) {
    console.error('Error granting access:', error);
    res.status(500).json({success: false, error: 'An error occurred while granting access.' });
  }
});
*/
router.post('/api/permit-access', async (req, res) => {
  console.log("API hit");
  const { studentId, sharedFileId, fileId } = req.body;

  // Check if the required fields are provided
  if (!studentId || !fileId || !sharedFileId) {
    console.log('Missing parameters:', { studentId, fileId, sharedFileId }); // Better debugging

    return res.status(400).json({
      success: false,
      message: 'File ID, Student ID, and Shared File ID are required'
    });
  }

  console.log("Student ID:", studentId);
  console.log("File ID:", fileId);
  console.log("Shared File ID:", sharedFileId);

  try {
   
    // Check if the file exists in the shared_files table
    const fileExists = await sequelize.query(
      'SELECT 1 FROM shared_files WHERE id = :sharedFileId',
      {
        replacements: { sharedFileId },
        type: sequelize.QueryTypes.SELECT 
      }
    );

    if (fileExists.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found in shared_files' 
      });
    }

    console.log('File Exists:', fileExists);
    
      // Check if access has already been granted for this student and file
      const accessExists = await sequelize.query(
        'SELECT id FROM file_access WHERE file_id = :fileId AND student_id = :studentId AND can_access = true',
        {
          replacements: { fileId, studentId },
          type: sequelize.QueryTypes.SELECT
        }
      );

      console.log('Access Exists:', accessExists);

      
      if (accessExists.length > 0) {
        // Access is already granted
        return res.status(200).json({
          success: true,
          message: 'Access already granted',
        });
      }

      
    // Use INSERT ... ON CONFLICT to handle existing records gracefully
    const query = `
      INSERT INTO file_access (file_id, id, can_access, student_id)
      VALUES (:fileId, :sharedFileId, true, :studentId)
      ON CONFLICT (file_id, student_id) DO UPDATE SET can_access = EXCLUDED.can_access;
    `;

    const [result] = await sequelize.query(query, {
      replacements: { fileId, sharedFileId, studentId },
      type: sequelize.QueryTypes.INSERT,
    });

    console.log('Access granted or updated:', result);
    return res.status(200).json({
      success: true,
      message: 'Access granted successfully',
    });

    } 

    catch (error) {
    console.error('Error granting access:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while granting access',
      error: error.message
    });
  }
});


  router.get('/admin-dashboard', async (req, res) => {
    try {
      const users = await sequelize.query(
        `SELECT 
          s.student_name, 
          s.email, 
          fa.student_id, 
          sf.id AS shared_file_id, 
          sf.filename, 
          fa.can_access
      FROM file_access fa
      INNER JOIN shared_files sf ON fa.id = sf.id
      INNER JOIN student s ON fa.student_id = s.stud_id
      WHERE fa.id IS NOT NULL
      ORDER BY s.student_name`,
        { type: sequelize.QueryTypes.SELECT }
      );
      console.log('Fetched Users:', users); // Log the fetched users to debug

      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
  });


/*
// Fetch User Data API
router.get('/admin-dashboard', async (req, res) => {
  try {
    const users = await sequelize.query(
      `SELECT 
        u.student_name, 
        u.email, 
        u.stud_id, 
        sf.id AS shared_file_id, 
        sf.file_id, 
        EXISTS(
          SELECT 1 FROM file_access WHERE student_id = u.stud_id AND file_id = sf.file_id
        ) AS can_access
      FROM users u
      LEFT JOIN shared_files sf ON u.stud_id = sf.student_id`, // Adjust based on your schema
      { type: sequelize.QueryTypes.SELECT }
    );

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});
*/

/*
// Route handler for permit access.
router.post('/api/permit-access', async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      // Find user by email
      const user = await Student.findOne({ where: { email } });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Your logic to grant access (for example, setting a permission flag)
      user.is_access_permitted = true;
      await user.save();

      // Respond with success
      res.json({ message: 'Access granted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while granting access' });
  }
});





//Route handler Permit-access to the files  for the user.
router.post('/api/permit-access/:studentEmail/:fileId', async (req, res) => {
  const { studentEmail, fileId } = req.params;

  try {
    // Get student ID from the email
    const studentResult = await pool.query('SELECT * FROM student WHERE email = $1', [studentEmail]);
    const student = studentResult.rows[0];

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update the file access to grant access (set can_access to true)
    await pool.query(
      'UPDATE file_access SET can_access = true WHERE student_id = $1 AND file_id = $2',
      [student.stud_id, fileId]
    );

    res.status(200).json({ message: 'Access granted to the student for this file' });
  } catch (error) {
    console.error('Error granting access:', error);
    res.status(500).json({ error: 'Error granting access' });
  }
});
*/  
module.exports = router;
