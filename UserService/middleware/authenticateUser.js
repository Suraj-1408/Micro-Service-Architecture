const { User } = require('../models/studentModel'); // Adjust based on your structure
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../jwtToken/jwtHelper');


const authenticateUser = (req, res, next) => {
  try {
    console.log('Incoming request headers:', req.headers);

    const token = req.header('Authorization')?.replace('Bearer ', ''); // Get the token from the Authorization header

    if (!token) {
      return res.status(401).json({ error: 'No token provided, authorization denied' });
    }
  
    console.log('Extracted Token:', token);

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded user info to the request object
    req.user = decoded;
    console.log('Decoded User:', req.user); // Debugging log
    next();
  } catch (err) {
    console.error('Invalid token', err);
    res.status(401).json({ error: 'Token is not valid or expired' });
  }
};

module.exports = { authenticateUser };


/*
const fetchUserFromDatabase = async (req, res, next) => {
  try {
    const userId = req.session?.userId || req.user?.id || null;

    if (!userId) {
      console.warn("User session missing or invalid");

      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { fetchUserFromDatabase };
*/

