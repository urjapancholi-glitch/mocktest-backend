const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { createMock, getMocksAdmin, updateMock, deleteMock, getMocks, getMockById } = require('../controllers/mockController');

router.post('/', protect, adminOnly, createMock);
router.get('/admin', protect, adminOnly, getMocksAdmin);
router.put('/:id', protect, adminOnly, updateMock);
router.delete('/:id', protect, adminOnly, deleteMock);

router.get('/', protect, getMocks);
router.get('/:id', protect, getMockById);

module.exports = router;
