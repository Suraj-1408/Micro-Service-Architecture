const express = require('express');
const path = require('path');
const { sequelize } = require('../../config/db');  // Import the pool from db.js
const router = express.Router();

/*
// Database connection
const pool = new Pool({
  user: 'your_user',
  host: 'your_host',
  database: 'your_db',
  password: 'your_password',
  port: 5432,
});
*/


/*
// View file endpoint
router.get('/view_file/:file_id', async (req, res) => {
  const { fileId } = req.params ;
  const studentId = req.query.student_id; // Assuming student_id is passed as a query parameter
  
  if (!studentId) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  try {
    // Check if the student has access to the file
    const accessQuery = `
      SELECT can_access
      FROM file_access
      WHERE file_id = $1 AND student_id = $2;
    `;
    const accessResult = await pool.query(accessQuery, [fileId, studentId]);

    if (accessResult.rows.length === 0 || !accessResult.rows[0].can_access) {
      return res.status(403).json({ error: "You do not have access to this file" });
    }

    // Fetch the file details
    const fileQuery = `
      SELECT filename, path
      FROM shared_files
      WHERE id = $1;
    `;
    const fileResult = await pool.query(fileQuery, [fileId]);

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = fileResult.rows[0];
    res.status(200).json({
      file_id: fileId,
      filename: file.filename,
      path: file.path,
      message: "File accessed successfully"
    });

  } catch (err) {
    console.error('Error accessing the file:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});
*/

// View file and collaboration history endpoint
router.get('/view_file/:file_id', async (req, res) => {
  const { file_id } = req.params;
  const studentEmail = req.query.student_id;  // Assuming email is being passed

  if (!studentEmail) {
    return res.status(400).json({ error: "Student email is required" });
  }

  try {
    // 1. Fetch student ID based on email
    const student = await sequelize.query(
      `SELECT stud_id FROM student WHERE email = :email`,
      {
        replacements: { email: studentEmail },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (student.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const studentId = student[0].stud_id;

    // 2. Check if the student has access to the file using Sequelize ORM
    const accessResult = await sequelize.query(
      `SELECT can_access FROM file_access WHERE file_id = :file_id AND student_id = :student_id`, 
      {
        replacements: { file_id, student_id: studentId },  // Use the numeric student_id here
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (accessResult.length === 0 || !accessResult[0].can_access) {
      return res.status(403).json({ error: "You do not have access to this file" });
    }

    // 3. Fetch file details using Sequelize ORM
    const fileResult = await sequelize.query(
      `SELECT filename, path FROM shared_files WHERE id = :file_id`,
      {
        replacements: { file_id },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (fileResult.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = fileResult[0];
    console.log('Serving file from path:', file.path);

    // 4. Fetch collaboration history for the file using Sequelize ORM
    const collaborationResult = await sequelize.query(
      `SELECT student_id, sheet_name, cell, old_value, new_value, timestamp
       FROM collaboration_service WHERE file_id = :file_id ORDER BY timestamp DESC`,
      {
        replacements: { file_id },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Prepare the response
    res.status(200).json({
      file_id,
      filename: file.filename,
      path: `/uploads/${path.basename(file.path)}`,
      collaboration_history: collaborationResult, // Adding collaboration history
      message: "File accessed successfully"
    });

  } catch (err) {
    console.error('Error accessing the file:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*
// View file and collaboration history endpoint
router.get('/view_file/:file_id', async (req, res) => {
  const { file_id } = req.params;
  const studentId = req.query.student_id;
  //const studentEmail = req.query.student_id;  // Assuming email is being passed

  if (!studentId) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  try {
    // 1. Check if the student has access to the file using Sequelize ORM
    const accessResult = await sequelize.query(
      `SELECT can_access 
   FROM file_access 
   WHERE file_id = :file_id AND student_id = (SELECT stud_id FROM student WHERE email = :email)`, 
      {
        replacements: { file_id, student_id: studentId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (accessResult.length === 0 || !accessResult[0].can_access) {
      return res.status(403).json({ error: "You do not have access to this file" });
    }

    // 2. Fetch file details using Sequelize ORM
    const fileResult = await sequelize.query(
      `SELECT filename, path FROM shared_files WHERE id = :file_id`,
      {
        replacements: { file_id },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (fileResult.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    const file = fileResult[0];

    // 3. Fetch collaboration history for the file using Sequelize ORM
    const collaborationResult = await sequelize.query(
      `SELECT student_id, sheet_name, cell, old_value, new_value, timestamp
       FROM collaboration_service WHERE file_id = :file_id ORDER BY timestamp DESC`,
      {
        replacements: { file_id },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Prepare the response
    res.status(200).json({
      file_id,
      filename: file.filename,
      path: file.path,
      collaboration_history: collaborationResult, // Adding collaboration history
      message: "File accessed successfully"
    });

  } catch (err) {
    console.error('Error accessing the file:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});
*/


/*
//for editing file.
router.post('/edit_file/:file_id', async (req, res) => {
    const { student_id, sheet_name, cell, old_value, new_value } = req.body;
    const fileId = req.params.file_id;
  
    if (!student_id || !sheet_name || !cell || !old_value || !new_value) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      // Check if the student has access to the file
      const accessQuery = `
        SELECT can_access
        FROM file_access
        WHERE file_id = $1 AND student_id = $2;
      `;
      const accessResult = await pool.query(accessQuery, [fileId, student_id]);
  
      if (accessResult.rows.length === 0 || !accessResult.rows[0].can_access) {
        return res.status(403).json({ error: "You do not have access to this file" });
      }
  
      // Insert the edit into the collaboration_service table
      const insertQuery = `
        INSERT INTO collaboration_service (file_id, student_id, sheet_name, cell, old_value, new_value)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;
      await pool.query(insertQuery, [fileId, student_id, sheet_name, cell, old_value, new_value]);
  
      res.status(200).json({ message: "File updated successfully" });
  
    } catch (err) {
      console.error('Error updating the file:', err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
*/

router.post('/edit_file/:file_id', async (req, res) => {
  const { student_id, sheet_name, cell, old_value, new_value } = req.body;
  const fileId = req.params.file_id;

  // Check for missing required fields
  if (!student_id || !sheet_name || !cell || !old_value || !new_value) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1. Check if the student has access to the file
    const accessQuery = `
      SELECT can_access
      FROM file_access
      WHERE file_id = $1 AND student_id = $2;
    `;
    const accessResult = await pool.query(accessQuery, [fileId, student_id]);

    // If no access or student doesn't have permission, return a 403 error
    if (accessResult.rows.length === 0 || !accessResult.rows[0].can_access) {
      return res.status(403).json({ error: "You do not have access to this file" });
    }

    // 2. Insert the edit into the collaboration_service table
    const insertQuery = `
      INSERT INTO collaboration_service (file_id, student_id, sheet_name, cell, old_value, new_value)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const result = await pool.query(insertQuery, [fileId, student_id, sheet_name, cell, old_value, new_value]);

    // Respond with the new record
    res.status(200).json({ 
      message: "File updated successfully", 
      data: result.rows[0] // Send back the inserted record
    });

  } catch (err) {
    console.error('Error updating the file:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});

  
module.exports = router;


