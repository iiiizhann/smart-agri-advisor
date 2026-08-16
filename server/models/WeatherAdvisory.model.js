const mongoose = require('mongoose');

const WeatherAdvisorySchema = new mongoose.Schema({
  district: { type: String, required: true },
  location: {
    lat: { type: Number },
    lon: { type: Number }
  },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  windSpeed: { type: Number, default: 0 },
  rainfall: { type: Number, default: 0 },
  advisorySummary: { type: String, required: true },
  deduplicationHash: { type: String, unique: true, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('WeatherAdvisory', WeatherAdvisorySchema);