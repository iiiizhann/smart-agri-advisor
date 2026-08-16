const cron = require('node-cron');
const { fetchDistrictWeatherData } = require('../services/etl/extractor.service');
const { transformWeatherData } = require('../services/etl/transformer.service');
const { loadAgroWeatherData } = require('../services/etl/loader.service');

const TARGET_DISTRICTS = ['Pune', 'Nashik', 'Nagpur', 'Solapur', 'Kolhapur'];

function initWeatherCronJob() {
  // Runs every 30 minutes: "*/30 * * * *"
  cron.schedule('*/30 * * * *', async () => {
    console.log('[CRON] Initiating AgriPulse Weather & Advisory Pipeline...');
    
    for (const district of TARGET_DISTRICTS) {
      try {
        const raw = await fetchDistrictWeatherData(district);
        const transformed = transformWeatherData(raw);
        await loadAgroWeatherData(transformed);
      } catch (err) {
        console.error(`[CRON ERROR] Ingestion failed for ${district}: ${err.message}`);
      }
    }
  });

  console.log('[Job Scheduler] Weather ETL Cron Job initialized.');
}

module.exports = { initWeatherCronJob };