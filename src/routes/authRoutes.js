const express = require('express');
const router = express.Router();
const { adminLogin, register, verifyRegistration, login } = require('../controllers/authController');

router.post('/admin-login', adminLogin);
router.post('/register', register);
router.post('/verify-registration', verifyRegistration);
router.post('/login', login);

module.exports = router;
