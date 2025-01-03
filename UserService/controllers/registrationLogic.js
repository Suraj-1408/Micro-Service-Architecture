// controllers/studentController.js
const bcrypt = require('bcryptjs');
const Student = require('../models/studentModel');
const jwt = require('jsonwebtoken'); // For JWT token-based authentication

// Register a new student
exports.registerStudent = async (req, res) => {

  const { student_name, roll_no, class: studentClass, email, password } = req.body;
  try {
    // Checking if the email or roll_no is already in use
    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    const existingRollNo = await Student.findOne({ where: { roll_no } });
    if (existingRollNo) {
      return res.status(400).json({ message: "Roll number already registered" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const student = await Student.create({
      student_name,
      roll_no,
      class: studentClass,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ error: "Error registering student" });
  }
};

