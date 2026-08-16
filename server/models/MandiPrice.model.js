const mongoose = require('mongoose');

const MandiPriceSchema = new mongoose.Schema({
  state: { type: String, required: true },
  district: { type: String, required: true },
  market: { type: String, required: true },
  commodity: { type: String, required: true },
  variety: { type: String, default: 'Common' },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  modalPrice: { type: Number, required: true },
  arrivalDate: { type: Date, default: Date.now },
  deduplicationHash: { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MandiPrice', MandiPriceSchema);