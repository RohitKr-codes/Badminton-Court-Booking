// backend/routes/courts.js
const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');

// Public GET /api/courts
router.get('/', admin.listCourts);

// Admin POST /api/courts
router.post('/', admin.createCourt);

module.exports = router;
