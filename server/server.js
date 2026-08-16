const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initWeatherCronJob } = require('./jobs/weather.job');
const advisoryRoutes = require('./routes/advisory.routes');
const mandiRoutes = require('./routes/mandi.routes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api/v1/advisory', advisoryRoutes);
app.use('/api/v1/mandi', mandiRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Smart Agriculture Farmer Advisory System API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

const authRoutes = require('./routes/auth.routes');

// Add under existing routes
app.use('/api/v1/auth', authRoutes);
initWeatherCronJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SmartAgri Server] Running in development mode on port ${PORT}`);
});