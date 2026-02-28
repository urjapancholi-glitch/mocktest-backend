const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getEnv, updateEnv } = require('../controllers/envController');

router.get('/', protect, adminOnly, getEnv);
router.post('/', protect, adminOnly, updateEnv);

module.exports = router;
