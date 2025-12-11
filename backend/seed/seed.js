// backend/seed/seed.js
const sequelize = require('../config/database');
const { Court, Equipment, Coach, PricingRule, Booking } = require('../models');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('DB synced (force:true)');

    // Courts: 4 (2 indoor, 2 outdoor)
    const courts = await Promise.all([
      Court.create({ name: 'Court 1', type: 'indoor', basePrice: 15 }),
      Court.create({ name: 'Court 2', type: 'indoor', basePrice: 15 }),
      Court.create({ name: 'Court A', type: 'outdoor', basePrice: 10 }),
      Court.create({ name: 'Court B', type: 'outdoor', basePrice: 10 })
    ]);
    console.log('Created courts');

    // Equipment
    await Equipment.create({ name: 'Racket', totalStock: 10, unitPrice: 5 });
    await Equipment.create({ name: 'Shoe', totalStock: 6, unitPrice: 10 });
    console.log('Created equipment');

    // Coaches
    await Coach.create({ name: 'Coach Rahul', fee: 25, isActive: true });
    await Coach.create({ name: 'Coach Priya', fee: 20, isActive: true });
    await Coach.create({ name: 'Coach Aman', fee: 18, isActive: true });
    console.log('Created coaches');

    // Pricing rules
    // Peak: 18:00 - 21:00 multiplier 1.5
    await PricingRule.create({ name: 'Peak Hours', type: 'peak', startHour: 18, endHour: 21, multiplier: 1.5, enabled: true });

    // Weekend surcharge
    await PricingRule.create({ name: 'Weekend Surcharge', type: 'weekend', surcharge: 5, enabled: true });

    // Indoor premium
    await PricingRule.create({ name: 'Indoor Premium', type: 'courtType', courtType: 'indoor', surcharge: 3, enabled: true });

    // Example fixed holiday (disabled by default)
    await PricingRule.create({ name: 'Holiday Surcharge', type: 'fixed', surcharge: 10, enabled: false });

    console.log('Created pricing rules');

    console.log('Seeding done. Exiting.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

seed();
