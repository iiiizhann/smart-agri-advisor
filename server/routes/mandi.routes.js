const express = require('express');
const router = express.Router();
const { getMandiPrices, triggerMandiSync } = require('../controllers/mandi.controller');

router.get('/', getMandiPrices);
router.post('/sync', triggerMandiSync);

module.exports = router;