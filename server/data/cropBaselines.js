module.exports = {
  Wheat: {
    averageYieldPerAcre: 18,
    costPerAcre: 16500,
    optimalTempRange: { min: 15, max: 28 },
    optimalHumidityRange: { min: 40, max: 65 },
    harvestAdvice: "Harvest when grains turn golden-amber and moisture content drops below 12%."
  },
  Soybean: {
    averageYieldPerAcre: 10,
    costPerAcre: 14000,
    optimalTempRange: { min: 20, max: 32 },
    optimalHumidityRange: { min: 50, max: 75 },
    harvestAdvice: "Pods should be dry and rattle when shaken. Avoid harvesting during high moisture mornings."
  },
  Cotton: {
    averageYieldPerAcre: 12,
    costPerAcre: 24000,
    optimalTempRange: { min: 21, max: 35 },
    optimalHumidityRange: { min: 45, max: 70 },
    harvestAdvice: "Pick bolls once fully burst in sunny, dry weather to protect fiber grade."
  },
  Tomato: {
    averageYieldPerAcre: 140,
    costPerAcre: 45000,
    optimalTempRange: { min: 18, max: 30 },
    optimalHumidityRange: { min: 50, max: 70 },
    harvestAdvice: "Pick at breaker stage for distant market transit, or table-ripe for immediate local APMC sale."
  },
  Onion: {
    averageYieldPerAcre: 110,
    costPerAcre: 38000,
    optimalTempRange: { min: 15, max: 32 },
    optimalHumidityRange: { min: 45, max: 65 },
    harvestAdvice: "Harvest when 50% of tops have fallen over. Cure in shade for 7-10 days before transport."
  }
};