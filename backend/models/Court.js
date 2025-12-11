// backend/models/Court.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Court = sequelize.define('Court', {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('indoor', 'outdoor'), allowNull: false },
    basePrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 10 }
  }, {
    tableName: 'courts'
  });

  return Court;
};
