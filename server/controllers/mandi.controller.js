const MandiPrice = require('../models/MandiPrice.model');
const { syncMandiPricesForDistrict } = require('../services/etl/mandi.service');

exports.getMandiPrices = async (req, res) => {
  try {
    const { district, commodity } = req.query;
    const query = {};

    if (district) query.district = new RegExp(`^${district}$`, 'i');
    if (commodity) query.commodity = new RegExp(`^${commodity}$`, 'i');

    const prices = await MandiPrice.find(query).sort({ arrivalDate: -1, modalPrice: -1 });

    res.status(200).json({
      success: true,
      count: prices.length,
      data: prices
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.triggerMandiSync = async (req, res) => {
  try {
    const { district = 'Pune' } = req.body;
    const records = await syncMandiPricesForDistrict(district);

    res.status(200).json({
      success: true,
      message: `Mandi prices synced for ${district}`,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};