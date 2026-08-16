const axios = require('axios');

const DISTRICT_COORDINATES = {
  Pune: { lat: 18.5204, lon: 73.8567 },
  Nashik: { lat: 19.9975, lon: 73.7898 },
  Nagpur: { lat: 21.1458, lon: 79.0882 },
  Solapur: { lat: 17.6599, lon: 75.9064 },
  Kolhapur: { lat: 16.7050, lon: 74.2433 }
};

function generateFallbackTelemetry(district) {
  const coords = DISTRICT_COORDINATES[district] || { lat: 18.5204, lon: 73.8567 };

  return {
    district,
    lat: coords.lat,
    lon: coords.lon,
    rawData: {
      main: {
        temp: Math.round(27 + Math.random() * 8), // 27°C - 35°C
        humidity: Math.round(55 + Math.random() * 30) // 55% - 85%
      },
      wind: {
        speed: parseFloat((2.5 + Math.random() * 5).toFixed(1))
      },
      rain: {
        '1h': parseFloat((Math.random() * 1.5).toFixed(1))
      },
      dt: Math.floor(Date.now() / 1000)
    }
  };
}

async function fetchDistrictWeatherData(district = 'Pune') {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${district},IN&limit=1&appid=${apiKey}`;
    const geoRes = await axios.get(geoUrl, { timeout: 3000 });

    if (!geoRes.data || geoRes.data.length === 0) {
      throw new Error(`Location not found: ${district}`);
    }

    const { lat, lon, name } = geoRes.data[0];
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherRes = await axios.get(weatherUrl, { timeout: 3000 });

    return {
      district: name,
      lat,
      lon,
      rawData: weatherRes.data
    };
  } catch (error) {
    console.warn(`[ETL Extractor] External API unavailable (${error.response?.status || error.message}). Applying fallback telemetry for ${district}.`);
    return generateFallbackTelemetry(district);
  }
}

module.exports = { fetchDistrictWeatherData };