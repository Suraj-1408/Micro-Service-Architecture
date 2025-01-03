const express = require('express');
const { authenticateUser } = require('../middleware/authenticateUser');
const User = require('../models/studentModel');
const  {sequelize }  = require('../../config/db');

const router = express.Router();


// Fetch files accessible to the user
router.get('/user-dashboard', authenticateUser, async (req, res) => {
  try {
    const user = req.user; // JWT payload decoded by authenticateJWT

    if (!user) {                                        
      console.error('Unauthorized access attempt: Invalid token');
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    console.log('Fetching files for user:', user);
    console.log("User ID:", user.id);

    // Ensure user.id is passed correctly into the replacements array
    const files = await sequelize.query(`
      SELECT f.id, f.filename
      FROM shared_files f
      INNER JOIN file_access fa ON f.id = fa.file_id
      WHERE fa.student_id = :userId AND fa.can_access = true;
    `, {
      replacements: { userId: user.id },  // Use a named parameter instead of $1
      type: sequelize.QueryTypes.SELECT, // Indicates that it's a SELECT query
    });

    console.log('Raw SQL Query Executed'); // Debug query execution
    console.log('Query Result:', files); 

    if (!files || files.length === 0) {
      console.warn('No accessible files found for user ID:', user.id);
      return res.status(404).json({ error: 'No accessible files found for this user.' });
    }


    console.log('Accessible files fetched successfully:', files);
    // Send the accessible files to the frontend
    //res.status(200).json({ success: true, files: files.rows });
    //res.status(200).json(result.rows);
    res.status(200).json({
      success: true,
      files
    });

  } catch (err) {
    console.error('Error fetching user files:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Fetch user details
router.get('/details', authenticateUser, async (req, res) => {
  const user = req.user; // User details from JWT payload

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.student_name, // Adjust based on JWT payload
      roll_no: user.roll_no,
      class: user.class,
      email: user.email,
    },
  });
});

module.exports = router;



/*
// routes/userDashboardRoutes.js
const express = require('express');
const { authenticateUser } = require('../middleware/authenticateUser');
const { File, FileAccess, User } = require('../models');

const router = express.Router();

router.get('/user-dashboard', authenticateUser, async (req, res) => {
  const userId = req.user.id;  // Get the user ID from the JWT token
  
  try {
    // Fetch files that the user has access to
    const files = await File.findAll({
      include: {
        model: User,
        through: {
          model: FileAccess,
          where: { student_id: userId, can_access: true }  // Check if the user has access
        }
      }
    });

    if (files.length === 0) {
      return res.status(404).json({ error: 'No accessible files found.' });
    }

    res.json(files);  // Send the files to the user
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

*/


/*
const express = require('express');
const User = require('../models/studentModel');
const { fetchUserFromDatabase } = require('../middleware/authenticateUser');

const router = express.Router();


router.get('/user-dashboard', fetchUserFromDatabase, async (req, res) => {
  const { email } = req.query;
  
  try {
    const user = req.user;  // Now we have the user available from the middleware

    if (!user || !user.can_access) {
      return res.status(404).json({ error: 'No accessible files found for this user.' });
    }

    // Fetch files related to the user
    const files = await File.findAll({
      include: {
        model: User,
        where: { id: user.id, can_access: true },
      },
    });
    res.json(files);
  } catch (err) {
    console.error('Error fetching user files:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/details', fetchUserFromDatabase, (req, res) => {
  // After the middleware, we can access the user via req.user
  res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.student_name,  // Adjust based on your model's fields
      roll_no: req.user.roll_no,
      class: req.user.class,
      email: req.user.email
    }
  });
});

module.exports = router;

*/







