const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/balance', authMiddleware, walletController.getBalance);
router.post('/transfer', authMiddleware, walletController.transfer);

module.exports = router;
