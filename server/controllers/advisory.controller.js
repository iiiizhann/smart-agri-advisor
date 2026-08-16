const WeatherAdvisory = require('../models/WeatherAdvisory.model');
const { runWeatherETLPipeline } = require('../services/etl/transformer.service');

exports.getAdvisoryByDistrict = async (req, res) => {
  try {
    const { district } = req.query;
    const query = district ? { district: new RegExp(`^${district}$`, 'i') } : {};

    const records = await WeatherAdvisory.find(query)
      .sort({ timestamp: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.triggerETLSync = async (req, res) => {
  try {
    const { district = 'Pune' } = req.body;
    const syncedData = await runWeatherETLPipeline(district);

    res.status(200).json({
      success: true,
      message: `Manual sync completed for ${district}`,
      data: syncedData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};