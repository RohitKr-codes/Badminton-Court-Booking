// backend/models/Booking.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    userName: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Guest' },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE, allowNull: false },
    rackets: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    shoes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.ENUM('confirmed', 'cancelled', 'waitlist'), allowNull: false, defaultValue: 'confirmed' },
    pricingBreakdown: { type: DataTypes.JSON, allowNull: true }
  }, {
    tableName: 'bookings'
  });

  return Booking;
};
