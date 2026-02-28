const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAllUsers } = require('../controllers/userController');

// All user routes need admin access for now
router.get('/admin', protect, adminOnly, getAllUsers);

module.exports = router;
