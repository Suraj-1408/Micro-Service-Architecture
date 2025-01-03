const express = require('express');
const { registerStudent  } = require('../controllers/registrationLogic');

const router = express.Router();

router.post('/signUp', registerStudent);
//router.post('/signin',loginUser);

module.exports = router;