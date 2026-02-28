const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitMock, getUserResults } = require('../controllers/resultController');

router.post('/submit', protect, submitMock);
router.get('/', protect, getUserResults);

module.exports = router;
