// backend/models/Coach.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Coach = sequelize.define('Coach', {
    name: { type: DataTypes.STRING, allowNull: false },
    fee: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 20 },
    // availability could be extended; for now we rely on bookings to determine free/busy
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    tableName: 'coaches'
  });

  return Coach;
};
