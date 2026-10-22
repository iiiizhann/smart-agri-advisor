const crypto = require('crypto');
const WeatherAdvisory = require('../../models/WeatherAdvisory.model');
const { fetchDistrictWeatherData } = require('./extractor.service');

function generateAdvisorySummary(temp, humidity, rain) {
  if (rain > 5) return 'Heavy rainfall detected: Suspend irrigation and ensure adequate field drainage.';
  if (temp > 35 && humidity < 40) return 'High heat and dry conditions: Increase irrigation frequency in early mornings.';
  if (humidity > 80) return 'Elevated humidity: Monitor crops closely for fungal and blight risks.';
  return 'Optimal conditions for general crop maintenance.';
}

function transformWeatherData(extracted) {
  if (!extracted || !extracted.rawData) {
    throw new Error('Invalid raw weather payload received');
  }

  const { rawData, lat, lon, district } = extracted;

  const temp = Math.round(rawData.main?.temp ?? 0);
  const humidity = rawData.main?.humidity ?? 0;
  const windSpeed = rawData.wind?.speed ?? 0;
  const rainfall = rawData.rain?.['1h'] ?? 0;
  const advisorySummary = generateAdvisorySummary(temp, humidity, rainfall);

  const targetDistrict = district || extracted.name || 'Unknown';
  const rawHash = `${targetDistrict}-${temp}-${humidity}-${Math.floor(Date.now() / (1000 * 60 * 15))}`;
  const deduplicationHash = crypto.createHash('sha256').update(rawHash).digest('hex');

  return {
    district: targetDistrict,
    location: { lat, lon },
    temperature: temp,
    humidity,
    windSpeed,
    rainfall,
    advisorySummary,
    deduplicationHash,
    timestamp: new Date()
  };
}

async function runWeatherETLPipeline(district = 'Pune') {
  const extracted = await fetchDistrictWeatherData(district);
  const transformed = transformWeatherData(extracted);

  await WeatherAdvisory.updateOne(
    { deduplicationHash: transformed.deduplicationHash },
    { $setOnInsert: transformed },
    { upsert: true }
  );

  return transformed;
}

module.exports = {
  generateAdvisorySummary,
  transformWeatherData,
  runWeatherETLPipeline,
};