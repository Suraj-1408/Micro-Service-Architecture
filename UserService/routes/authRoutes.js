// routes/authRoutes.js
const express = require('express');
const { authenticateUser } = require('../services/userService');  // Import user service

const router = express.Router();

router.post('/signin', async (req, res) => {
  try {
    const { roll_no, password } = req.body;

    if (!roll_no || !password) {
      return res.status(400).json({ message: 'Roll number and password are required' });
    }

    // Authenticate user and generate token
    const token = await authenticateUser(roll_no, password);

    // Send token in response
    if (token) {
      // Send the token in the response
      res.json({ token: token });  // Return token on successful login
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }

  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Profile route to check if user is logged in
router.get('/profile', authenticateUser, (req, res) => {
  console.log('User Data:', req.user); // Log the user data from the JWT

  // If the JWT is valid, the user is authenticated
  res.status(200).json({
    success: true,
    message: 'User profile data',
    user: {
      id: req.user.id,
      name: req.user.student_name, // Adjust to match your payload
      email: req.user.email,
    },
  });
});


//Route handler for logout
router.get('/logout',(req,res) => {
    //destroying the session.
    req.session.destroy((err) => {

        if(err){
          console.log('Error destroying session',err);
            return res.status(500).json({
              success:false,
              message: 'Logout Failed!'
            })
        }

        //else, redirect to homepage.
        res.redirect('/');
    });
});



module.exports = router;



/*
  const express = require('express');
  const bcrypt = require('bcryptjs');
  const Student = require('../models/studentModel'); // Correct path to model
  const router = express.Router();

  // Sign-in route
  router.post('/signin', async (req, res) => {
    const { roll_no, password } = req.body;

    try {
      // Find student by roll number
      const student = await Student.findOne({ where: { roll_no } });
      if (!student) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // If login is successful, store user info in session
      req.session.userId = student.id; // Store student ID in session (or any other relevant data)
      console.log('Session Data:', req.session);  // Log session to ensure it's being set

      res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
      console.error('Error during sign in:', error);
      res.status(500).json({ success: false, message: 'Server error during sign in' });
    }
  });

  
  // Profile route to check if user is logged in
  router.get('/profile', (req, res) => {
    console.log('Session Data:', req.session);  // Check session data before processing request

    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: 'User not logged in' });
    }

    // If user is logged in, proceed with profile fetching
    res.status(200).json({ success: true, message: 'User profile data' });
  });

  module.exports = router;

*/

/*
const express = require('express');
const bcrypt = require('bcryptjs');
//const Student = require('../controllers/registrationLogic');
const Student = require('../models/studentModel'); // Correct path to model
const router = express.Router();

// Sign-in route
router.post('/signin', async (req, res) => {
  const { roll_no, password } = req.body;

  try {
    // Find student by roll number
    const student = await Student.findOne({ where: { roll_no } });
    if (!student) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // If login is successful
    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Error during sign in:', error);
    res.status(500).json({ success: false, message: 'Server error during sign in' });
  }
});

module.exports = router;
*/