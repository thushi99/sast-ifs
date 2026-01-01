const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes (but are they checking for ADMIM role? No.)
router.post('/ping', authMiddleware, adminController.ping);
router.get('/users', authMiddleware, adminController.getAllUsers);

module.exports = router;
