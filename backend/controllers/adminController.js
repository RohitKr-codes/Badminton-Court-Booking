// backend/controllers/adminController.js
const { Court, Equipment, Coach, PricingRule } = require('../models');

async function createCourt(req, res) {
  try {
    const { name, type, basePrice } = req.body;
    const court = await Court.create({ name, type, basePrice });
    res.json({ success: true, data: court });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function listCourts(req, res) {
  try {
    const items = await Court.findAll();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createEquipment(req, res) {
  try {
    const { name, totalStock, unitPrice } = req.body;
    const eq = await Equipment.create({ name, totalStock, unitPrice });
    res.json({ success: true, data: eq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function listEquipment(req, res) {
  try {
    const items = await Equipment.findAll();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createCoach(req, res) {
  try {
    const { name, fee } = req.body;
    const coach = await Coach.create({ name, fee });
    res.json({ success: true, data: coach });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function listCoaches(req, res) {
  try {
    const items = await Coach.findAll();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: true, data: [] });
  }
}

async function createPricingRule(req, res) {
  try {
    const payload = req.body;
    const rule = await PricingRule.create(payload);
    res.json({ success: true, data: rule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function listPricingRules(req, res) {
  try {
    const items = await PricingRule.findAll();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: true, data: [] });
  }
}

module.exports = {
  createCourt,
  listCourts,
  createEquipment,
  listEquipment,
  createCoach,
  listCoaches,
  createPricingRule,
  listPricingRules
};
