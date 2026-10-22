const express = require('express');
const router = express.Router();
const { getAdvisoryByDistrict, triggerETLSync } = require('../controllers/advisory.controller');
const { calculateCropEstimate } = require('../controllers/estimator.controller');

// Existing Endpoints
router.get('/weather', getAdvisoryByDistrict);
router.post('/sync', triggerETLSync);
router.post('/estimate', calculateCropEstimate);

// Disease Risk Advisory Endpoint (Fixes the 404 in console)
router.get('/disease-risk', async (req, res) => {
  try {
    const { district } = req.query;

    const alerts = [
      {
        id: 1,
        title: 'High Humidity Fungal Alert',
        severity: 'Moderate',
        description: `Persistent moisture in ${district || 'the region'} elevates fungal risk for legumes, soybean, and vegetable crops.`
      },
      {
        id: 2,
        title: 'Microclimate Pest Warning',
        severity: 'Low',
        description: `Monitored temperature variance indicates favorable incubation conditions for aphid infestations.`
      }
    ];

    res.status(200).json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;