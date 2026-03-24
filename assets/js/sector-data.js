// Sector and DR strategy data ported from tools/calc.py
window.SECTOR_DATA = {
  "Healthcare": { "ARO": 0.59, "AvgBreachCost": 9770000, "DowntimeCostPerHour": 300000 },
  "Finance": { "ARO": 0.20, "AvgBreachCost": 6080000, "DowntimeCostPerHour": 5600000 },
  "Retail": { "ARO": 0.14, "AvgBreachCost": 2500000, "DowntimeCostPerHour": 200000 },
  "Manufacturing": { "ARO": 0.62, "AvgBreachCost": 4800000, "DowntimeCostPerHour": 2300000 }
};

window.DR_STRATEGIES = {
  "Cold Site": { recovery_time_hours: 336, annual_cost: 10000 },
  "Warm Site": { recovery_time_hours: 48, annual_cost: 50000 },
  "Hot Site": { recovery_time_hours: 4, annual_cost: 150000 }
};

window.CONTROL_COSTS = { mfa: 25000, phish: 7500, succession: 5000 };

// Calculation helpers
window.formatCurrency = function (n) {
  return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(n);
}

window.computeSLE = function (assetValue, efPercent) {
  const ef = Math.max(0, Math.min(efPercent, 100));
  return assetValue * (ef / 100.0);
}

window.computeALE = function (sle, aro) {
  return sle * aro;
}

window.computeExpectedAnnualBreachCost = function (avgBreachCost, aro) {
  return avgBreachCost * aro;
}

window.computeDowntimeLoss = function (sectorName, strategyName, succession) {
  const sector = window.SECTOR_DATA[sectorName];
  const strategy = window.DR_STRATEGIES[strategyName] || { recovery_time_hours: 0 };
  const hours = strategy.recovery_time_hours || 0;
  const hourly = sector ? sector.DowntimeCostPerHour : 0;
  // succession planning reduces downtime impact a bit; simple reduction if true
  const multiplier = succession ? 0.9 : 1.0;
  return hours * hourly * multiplier;
}

window.computeALEPre = function (sectorName, assetValue, efPercent) {
  // compute ALE using a loss magnitude (e.g., sector AvgBreachCost or provided revenue)
  // Here assetValue parameter is actually the loss magnitude per original Python logic
  const lossMagnitude = assetValue;
  const aro = window.SECTOR_DATA[sectorName] ? window.SECTOR_DATA[sectorName].ARO : 0;
  const ef = Math.max(0, Math.min(efPercent, 100)) / 100.0;
  return lossMagnitude * ef * aro;
}

window.computeALEPost = function (sectorName, assetValue, efPercent, options) {
  // options: { mfa, phish }
  // Follow Python: ALE post uses loss magnitude * EF * reduced ARO
  const lossMagnitude = assetValue;
  let aro = window.SECTOR_DATA[sectorName] ? window.SECTOR_DATA[sectorName].ARO : 0;
  if (options && options.mfa) aro = aro * 0.5; // MFA reduces ARO by 50%
  if (options && options.phish) aro = aro * 0.8; // Phish training reduces ARO by 20%
  const ef = Math.max(0, Math.min(efPercent, 100)) / 100.0;
  return lossMagnitude * ef * aro;
}

window.computeROSI = function (alePre, alePost, moneySaved, costBasis) {
  // follow Python compute_rosi: ((ale_pre - ale_post) + avoided_downtime_loss - cost_of_controls) / cost_of_controls
  const cost_of_controls = costBasis;
  if (cost_of_controls === 0) return Infinity;
  return ((alePre - alePost) + moneySaved - cost_of_controls) / cost_of_controls;
}