// utils/jwtHelper.js
const jwt = require('jsonwebtoken');

// Secret key for signing the JWT (store this securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'fkndslfsdfnlsddfdwefweosdf324324'

// Function to generate a JWT token
const generateToken = (user) => {
  const payload = {
    id: user.stud_id,
    email: user.email,
    name: user.student_name
    // Add more user info if needed
  };

  console.log('Generating Token with Payload:', payload); // Debugging log

  // Generate JWT with a 1-hour expiration time
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateToken , JWT_SECRET };
