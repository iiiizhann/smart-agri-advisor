const mongoose = require('mongoose');

const AgroWeatherSchema = new mongoose.Schema({
  district: { type: String, required: true, index: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [Longitude, Latitude]
  },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  rainfall: { type: Number, default: 0 },
  windSpeed: { type: Number, default: 0 },
  advisorySummary: { type: String },
  timestamp: { type: Date, required: true, index: true },
  deduplicationHash: { type: String, required: true, unique: true }
}, { timestamps: true });

AgroWeatherSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('AgroWeather', AgroWeatherSchema);