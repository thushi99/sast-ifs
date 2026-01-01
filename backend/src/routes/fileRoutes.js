const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// Vulnerability: No Auth required for these?
router.post('/upload', fileController.uploadFile);
router.get('/view', fileController.viewFile);

module.exports = router;
