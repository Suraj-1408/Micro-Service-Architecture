const express = require('express');
const path = require('path');
const Admin = require('../models/adminModel');
const router = express.Router();

// Route to set the admin password
router.post('/set-admin-password', async (req, res) => {
  try {
    const plainPassword = '123'; // This is the plain password you want to store

    // Save the password as plain text (no hashing)
    await Admin.upsert({
      email: 'admin@gmail.com', // Assuming you're setting a specific email
      password: plainPassword, // Save the plain password
    });

    res.status(200).json({ success: true, message: 'Password set successfully' });
  } catch (error) {
    console.error('Error setting password:', error);
    res.status(500).json({ success: false, message: 'Failed to set password' });
  }
});

// Serve the admin sign-in page
router.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'adminSignin.html')); // Ensure the path to your HTML file is correct
});

// Processing the admin signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Log the plain password stored in the database (for debugging)
    console.log('Stored password:', admin.password);

    // Compare the entered password with the stored plain password
    if (password !== admin.password) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Successful login
    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Error during admin sign in:', error);
    res.status(500).json({ success: false, message: 'Server error during sign in' });
  }
});



//route for admin logout, and redirecting to homepage again.
router.get('/logout',(req,res) => {
    //clearing the session
    req.session.destroy((err) =>{

      if(err){
        console.error('Error destroying session:', err);
        return res.status(500).json({ success:false,message:'Logout  Failed'})
      }

      //redirecting to homepage.
      res.redirect('/');
    });
});


module.exports = router;
