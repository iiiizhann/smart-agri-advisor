const cropBaselines = require('../data/cropBaselines');
const MandiPrice = require('../models/MandiPrice.model');

exports.calculateCropEstimate = async (req, res) => {
  try {
    const { district = 'Pune', commodity = 'Wheat', acreage = 1 } = req.body;
    const baseline = cropBaselines[commodity];

    if (!baseline) {
      return res.status(400).json({ success: false, message: `Crop '${commodity}' baseline not found.` });
    }

    const latestMandi = await MandiPrice.findOne({
      district: new RegExp(`^${district}$`, 'i'),
      commodity: new RegExp(`^${commodity}$`, 'i')
    }).sort({ arrivalDate: -1 });

    const modalPrice = latestMandi ? latestMandi.modalPrice : 2200;
    const marketName = latestMandi ? latestMandi.market : 'General Market';

    const parsedAcreage = Math.max(0.25, parseFloat(acreage) || 1);
    const estimatedProduction = Math.round(baseline.averageYieldPerAcre * parsedAcreage);
    const estimatedGrossRevenue = Math.round(estimatedProduction * modalPrice);
    const estimatedTotalCost = Math.round(baseline.costPerAcre * parsedAcreage);
    const estimatedNetProfit = estimatedGrossRevenue - estimatedTotalCost;
    const profitMarginPercent = estimatedGrossRevenue > 0 
      ? Math.round((estimatedNetProfit / estimatedGrossRevenue) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        district,
        commodity,
        market: marketName,
        modalPrice,
        acreage: parsedAcreage,
        estimatedProduction,
        estimatedGrossRevenue,
        estimatedTotalCost,
        estimatedNetProfit,
        profitMarginPercent,
        harvestAdvice: baseline.harvestAdvice
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};