// backend/controllers/bookingController.js
const { sequelize, Booking, Court, Coach, Equipment, PricingRule } = require('../models');
const { calculateTotal } = require('../utils/priceCalculator');

/**
 * Overlap condition: Two ranges [a,b) and [c,d) overlap if a < d && b > c
 */

async function checkCourtAvailable(courtId, startTime, endTime, transaction = null) {
  const exists = await Booking.findOne({
    where: {
      courtId,
      status: 'confirmed',
      [sequelize.Sequelize.Op.and]: [
        sequelize.where(sequelize.col('startTime'), '<', endTime),
        sequelize.where(sequelize.col('endTime'), '>', startTime)
      ]
    },
    transaction
  });
  return !exists;
}

async function checkCoachAvailable(coachId, startTime, endTime, transaction = null) {
  if (!coachId) return true;
  const exists = await Booking.findOne({
    where: {
      coachId,
      status: 'confirmed',
      [sequelize.Sequelize.Op.and]: [
        sequelize.where(sequelize.col('startTime'), '<', endTime),
        sequelize.where(sequelize.col('endTime'), '>', startTime)
      ]
    },
    transaction
  });
  return !exists;
}

async function checkEquipmentAvailable(racketsReq, shoesReq, startTime, endTime, transaction = null) {
  // Fetch equipment counts
  const rackets = await Equipment.findOne({ where: { name: 'Racket' }, transaction });
  const shoes = await Equipment.findOne({ where: { name: 'Shoe' }, transaction });

  const racketsTotal = rackets ? rackets.totalStock : 0;
  const shoesTotal = shoes ? shoes.totalStock : 0;

  // Sum already booked counts overlapping
  const overlapping = await Booking.findAll({
    where: {
      status: 'confirmed',
      [sequelize.Sequelize.Op.and]: [
        sequelize.where(sequelize.col('startTime'), '<', endTime),
        sequelize.where(sequelize.col('endTime'), '>', startTime)
      ]
    },
    transaction
  });

  let racketsBooked = 0, shoesBooked = 0;
  overlapping.forEach(b => {
    racketsBooked += (b.rackets || 0);
    shoesBooked += (b.shoes || 0);
  });

  const racketsAvailable = racketsTotal - racketsBooked;
  const shoesAvailable = shoesTotal - shoesBooked;

  return {
    racketsOk: racketsReq <= racketsAvailable,
    shoesOk: shoesReq <= shoesAvailable,
    racketsAvailable,
    shoesAvailable
  };
}

async function listBookings(req, res) {
  try {
    const items = await Booking.findAll({
      include: [{ model: Court }, { model: Coach }],
      order: [['startTime', 'DESC']]
    });
    res.json({ success: true, data: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function createBooking(req, res) {
  const { userName, courtId, coachId, rackets = 0, shoes = 0, startTime, endTime } = req.body;
  if (!courtId || !startTime || !endTime) {
    return res.status(400).json({ success: false, message: 'courtId, startTime and endTime required' });
  }

  const t = await sequelize.transaction();
  try {
    // Load resources
    const court = await Court.findByPk(courtId, { transaction: t });
    if (!court) throw new Error('Court not found');

    const coach = coachId ? await Coach.findByPk(coachId, { transaction: t }) : null;
    if (coachId && !coach) throw new Error('Coach not found');

    // 1. Check availability
    const courtFree = await checkCourtAvailable(courtId, startTime, endTime, t);
    if (!courtFree) {
      await t.rollback();
      return res.status(409).json({ success: false, message: 'Court already booked for this slot' });
    }
    const coachFree = await checkCoachAvailable(coachId, startTime, endTime, t);
    if (!coachFree) {
      await t.rollback();
      return res.status(409).json({ success: false, message: 'Coach not available for this slot' });
    }

    // equipment check
    const equipmentCheck = await checkEquipmentAvailable(rackets, shoes, startTime, endTime, t);
    if (!equipmentCheck.racketsOk) {
      await t.rollback();
      return res.status(409).json({ success: false, message: `Not enough rackets. Available: ${equipmentCheck.racketsAvailable}` });
    }
    if (!equipmentCheck.shoesOk) {
      await t.rollback();
      return res.status(409).json({ success: false, message: `Not enough shoes. Available: ${equipmentCheck.shoesAvailable}` });
    }

    // 2. Get pricing rules (active)
    const rules = await PricingRule.findAll({ where: { enabled: true }, transaction: t });

    // 3. Calculate price
    const breakdown = calculateTotal({
      court,
      rackets,
      shoes,
      coach,
      startTime,
      endTime,
      rules
    });

    // 4. Create booking (atomic)
    const booking = await Booking.create({
      userName: userName || 'Guest',
      courtId,
      coachId: coach ? coach.id : null,
      rackets,
      shoes,
      startTime,
      endTime,
      status: 'confirmed',
      pricingBreakdown: breakdown
    }, { transaction: t });

    await t.commit();
    res.json({ success: true, data: booking, pricing: breakdown });
  } catch (err) {
    await t.rollback();
    console.error('createBooking error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
}

module.exports = {
  createBooking,
  listBookings
};
