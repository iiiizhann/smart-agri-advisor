const AgroWeather = require('../../models/AgroWeather.model');

/**
 * Loads transformed records into MongoDB using idempotent upsert operations
 */
async function loadAgroWeatherData(record) {
  try {
    const result = await AgroWeather.updateOne(
      { deduplicationHash: record.deduplicationHash },
      { $setOnInsert: record },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log(`[ETL Load] Ingested new weather advisory for ${record.district}`);
    } else {
      console.log(`[ETL Deduplication] Record for ${record.district} at this hour already exists.`);
    }
  } catch (error) {
    console.error(`[ETL Load Error]: ${error.message}`);
    throw error;
  }
}

module.exports = { loadAgroWeatherData };