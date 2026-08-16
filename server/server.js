const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initWeatherCronJob } = require('./jobs/weather.job');

// Route imports
const advisoryRoutes = require('./routes/advisory.routes');
const mandiRoutes = require('./routes/mandi.routes');
const authRoutes = require('./routes/auth.routes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Smart Agriculture Farmer Advisory System API',
    version: '1.0.0',
    status: 'healthy',
    documentation: '/api/v1/health'
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/advisory', advisoryRoutes);
app.use('/api/v1/mandi', mandiRoutes);

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Smart Agriculture Farmer Advisory System API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Initialize Cron Jobs
initWeatherCronJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SmartAgri Server] Running on port ${PORT}`);
});