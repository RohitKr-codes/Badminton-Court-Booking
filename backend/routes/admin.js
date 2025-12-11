// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');

router.get('/status', (req, res) => res.json({ success: true, message: 'admin ok' }));

// Courts
router.get('/courts', admin.listCourts);
router.post('/courts', admin.createCourt);

// Equipment
router.get('/equipment', admin.listEquipment);
router.post('/equipment', admin.createEquipment);

// Coaches
router.get('/coaches', admin.listCoaches);
router.post('/coaches', admin.createCoach);

// Pricing rules
router.get('/pricing-rules', admin.listPricingRules);
router.post('/pricing-rules', admin.createPricingRule);

module.exports = router;
