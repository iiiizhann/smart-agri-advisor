const crypto = require('crypto');
const WeatherAdvisory = require('../../models/WeatherAdvisory.model');
const { fetchDistrictWeatherData } = require('./extractor.service');

function generateAdvisorySummary(temp, humidity, rain) {
  if (rain > 5) return 'Heavy rainfall detected: Suspend irrigation and ensure adequate field drainage.';
  if (temp > 35 && humidity < 40) return 'High heat and dry conditions: Increase irrigation frequency in early mornings.';
  if (humidity > 80) return 'Elevated humidity: Monitor crops closely for fungal and blight risks.';
  return 'Optimal conditions for general crop maintenance.';
}

async function runWeatherETLPipeline(district = 'Pune') {
  const extracted = await fetchDistrictWeatherData(district);
  const { rawData, lat, lon } = extracted;

  const temp = Math.round(rawData.main.temp);
  const humidity = rawData.main.humidity;
  const windSpeed = rawData.wind?.speed || 0;
  const rainfall = rawData.rain?.['1h'] || 0;
  const advisorySummary = generateAdvisorySummary(temp, humidity, rainfall);

  const rawHash = `${district}-${temp}-${humidity}-${Math.floor(Date.now() / (1000 * 60 * 15))}`;
  const deduplicationHash = crypto.createHash('sha256').update(rawHash).digest('hex');

  const advisoryData = {
    district,
    location: { lat, lon },
    temperature: temp,
    humidity,
    windSpeed,
    rainfall,
    advisorySummary,
    deduplicationHash,
    timestamp: new Date()
  };

  await WeatherAdvisory.updateOne(
    { deduplicationHash },
    { $setOnInsert: advisoryData },
    { upsert: true }
  );

  return advisoryData;
}

module.exports = {
  transformWeatherData, // ensure this is listed here
};