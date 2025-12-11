// backend/utils/priceCalculator.js
/**
 * priceCalculator: given court, rackets count, shoes count, coach (optional), booking startTime, endTime
 * and a list of active pricing rules (array), returns breakdown { basePrice, ruleAdjustments: [], equipmentFee, coachFee, total }
 */

function calculateTotal({ court, rackets = 0, shoes = 0, coach = null, startTime, endTime, rules = [] }) {
  const breakdown = {
    basePrice: court.basePrice || 0,
    ruleAdjustments: [],
    equipmentFee: 0,
    coachFee: 0,
    total: 0
  };

  let current = breakdown.basePrice;

  const bookingHour = new Date(startTime).getHours();
  const day = new Date(startTime).getDay(); // 0 = Sunday, 6 = Saturday

  // apply rules
  for (const r of rules) {
    if (!r.enabled) continue;
    if (r.type === 'peak' && r.startHour != null && r.endHour != null) {
      // handle wrap-around if needed
      if (bookingHour >= r.startHour && bookingHour < r.endHour) {
        if (r.multiplier) {
          const before = current;
          current = current * (r.multiplier);
          breakdown.ruleAdjustments.push({ name: r.name, type: 'multiplier', multiplier: r.multiplier, before, after: current });
        }
        if (r.surcharge) {
          current += r.surcharge;
          breakdown.ruleAdjustments.push({ name: r.name, type: 'surcharge', surcharge: r.surcharge });
        }
      }
    } else if (r.type === 'weekend') {
      if (day === 0 || day === 6) {
        if (r.surcharge) {
          current += r.surcharge;
          breakdown.ruleAdjustments.push({ name: r.name, type: 'surcharge', surcharge: r.surcharge });
        }
        if (r.multiplier) {
          const before = current;
          current = current * r.multiplier;
          breakdown.ruleAdjustments.push({ name: r.name, type: 'multiplier', multiplier: r.multiplier, before, after: current });
        }
      }
    } else if (r.type === 'courtType') {
      if (r.courtType && court.type === r.courtType) {
        if (r.surcharge) {
          current += r.surcharge;
          breakdown.ruleAdjustments.push({ name: r.name, type: 'surcharge', surcharge: r.surcharge });
        }
        if (r.multiplier) {
          const before = current;
          current = current * r.multiplier;
          breakdown.ruleAdjustments.push({ name: r.name, type: 'multiplier', multiplier: r.multiplier, before, after: current });
        }
      }
    } else if (r.type === 'fixed') {
      if (r.surcharge) {
        current += r.surcharge;
        breakdown.ruleAdjustments.push({ name: r.name, type: 'surcharge', surcharge: r.surcharge });
      }
    }
  }

  // Equipment fees
  // assume rackets price & shoes price come from equipment unitPrice; but for simplicity, rules may include equipment costs too
  // We'll compute equipmentFee as counts * predefined rough prices
  const RACKET_PRICE = 5; // if you want, read from Equipment table in controller
  const SHOE_PRICE = 10;
  breakdown.equipmentFee = rackets * RACKET_PRICE + shoes * SHOE_PRICE;
  current += breakdown.equipmentFee;

  // Coach fee (if provided)
  if (coach) {
    breakdown.coachFee = coach.fee || 0;
    current += breakdown.coachFee;
  }

  breakdown.total = Number(current.toFixed(2));
  return breakdown;
}

module.exports = { calculateTotal };
