const crypto = require('crypto');
const MandiPrice = require('../../models/MandiPrice.model');

const COMMODITY_BASELINES = [
  { commodity: 'Wheat', variety: 'Lokwan', min: 2200, max: 2800, modal: 2500 },
  { commodity: 'Soybean', variety: 'Yellow', min: 4100, max: 4750, modal: 4450 },
  { commodity: 'Cotton', variety: 'Medium Staple', min: 6800, max: 7600, modal: 7200 },
  { commodity: 'Tomato', variety: 'Hybrid', min: 1200, max: 2200, modal: 1700 },
  { commodity: 'Onion', variety: 'Red', min: 1400, max: 2600, modal: 1950 }
];

const MARKETS = {
  Pune: ['Pune APMC', 'Manchar APMC'],
  Nashik: ['Lasalgaon APMC', 'Pimpalgaon APMC'],
  Nagpur: ['Nagpur APMC', 'Katol APMC'],
  Solapur: ['Solapur APMC', 'Karmala APMC'],
  Kolhapur: ['Kolhapur APMC', 'Gadhinglaj APMC']
};

async function syncMandiPricesForDistrict(district = 'Pune', state = 'Maharashtra') {
  const markets = MARKETS[district] || [`${district} Main APMC`];
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  const ingestedRecords = [];

  for (const market of markets) {
    for (const item of COMMODITY_BASELINES) {
      const variance = (Math.random() * 0.1 - 0.05);
      const modalPrice = Math.round(item.modal * (1 + variance));
      const minPrice = Math.round(item.min * (1 + variance));
      const maxPrice = Math.round(item.max * (1 + variance));

      const rawHash = `${district}-${market}-${item.commodity}-${dateString}`;
      const deduplicationHash = crypto.createHash('sha256').update(rawHash).digest('hex');

      const record = {
        state,
        district,
        market,
        commodity: item.commodity,
        variety: item.variety,
        minPrice,
        maxPrice,
        modalPrice,
        arrivalDate: today,
        deduplicationHash
      };

      await MandiPrice.updateOne(
        { deduplicationHash },
        { $setOnInsert: record },
        { upsert: true }
      );

      ingestedRecords.push(record);
    }
  }

  return ingestedRecords;
}

module.exports = { syncMandiPricesForDistrict };