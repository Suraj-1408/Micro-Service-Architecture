const bcrypt = require('bcryptjs');
const { Student } = require('../models/studentModel');  // Corrected model import
const { generateToken } = require('../jwtToken/jwtHelper');  // Assuming this is correct

// Function to authenticate a user (login)
const authenticateUser = async (rollNo, password) => {
  console.log('Received roll_no:', rollNo);  // Debugging log to check the value

  if (!rollNo) {
    throw new Error('Roll number is missing or undefined');
  }
  
  // Fetch user based on roll_no
  const user = await Student.findOne({ where: { roll_no: rollNo } });

  if (!user) {
    throw new Error('User not found');
  }

  // Compare password hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }

  // Generate JWT if login is successful
  const token = generateToken(user);

  return token;
};

module.exports = { authenticateUser };
