const express = require('express');
const router = express.Router();
const { getAdvisoryByDistrict, triggerETLSync } = require('../controllers/advisory.controller');
const { calculateCropEstimate } = require('../controllers/estimator.controller');

router.get('/weather', getAdvisoryByDistrict);
router.post('/sync', triggerETLSync);
router.post('/estimate', calculateCropEstimate);

module.exports = router;