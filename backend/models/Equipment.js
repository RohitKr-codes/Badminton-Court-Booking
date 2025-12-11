// backend/models/Equipment.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Equipment = sequelize.define('Equipment', {
    name: { type: DataTypes.STRING, allowNull: false },
    totalStock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    unitPrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
  }, {
    tableName: 'equipment'
  });

  return Equipment;
};
