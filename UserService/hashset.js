const bcrypt = require('bcryptjs');

async function testHashing() {
  try {
    const password = '123'; // The plain text password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

testHashing();