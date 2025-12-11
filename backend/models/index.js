// backend/models/index.js
const sequelize = require('../config/database');
const CourtModel = require('./Court');
const EquipmentModel = require('./Equipment');
const CoachModel = require('./Coach');
const BookingModel = require('./Booking');
const PricingRuleModel = require('./PricingRule');

// Initialize models
const Court = CourtModel(sequelize);
const Equipment = EquipmentModel(sequelize);
const Coach = CoachModel(sequelize);
const Booking = BookingModel(sequelize);
const PricingRule = PricingRuleModel(sequelize);

// Associations
Court.hasMany(Booking, { foreignKey: 'courtId' });
Booking.belongsTo(Court, { foreignKey: 'courtId' });

Coach.hasMany(Booking, { foreignKey: 'coachId' });
Booking.belongsTo(Coach, { foreignKey: 'coachId' });

// Export
module.exports = {
  sequelize,
  Sequelize: require('sequelize'),
  Court,
  Equipment,
  Coach,
  Booking,
  PricingRule
};
