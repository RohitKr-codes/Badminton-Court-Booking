// backend/models/PricingRule.js
const { DataTypes } = require('sequelize');

/**
 * Flexible rule model. We interpret fields in priceCalculator.
 * type: 'peak' | 'weekend' | 'courtType' | 'fixed'
 * - peak: startHour, endHour, multiplier
 * - weekend: surcharge (fixed)
 * - courtType: applies to court.type (e.g., indoor) -> surcharge or multiplier
 * - fixed: generic surcharge (e.g., holiday)
 */
module.exports = (sequelize) => {
  const PricingRule = sequelize.define('PricingRule', {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    startHour: { type: DataTypes.INTEGER, allowNull: true },
    endHour: { type: DataTypes.INTEGER, allowNull: true },
    multiplier: { type: DataTypes.FLOAT, allowNull: true },
    surcharge: { type: DataTypes.FLOAT, allowNull: true },
    courtType: { type: DataTypes.STRING, allowNull: true },
    enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    tableName: 'pricing_rules'
  });

  return PricingRule;
};
