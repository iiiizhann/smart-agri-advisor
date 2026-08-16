import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import DiseaseAlerts from './components/DiseaseAlerts';
import TrendChart from './components/TrendChart';
import MandiTable from './components/MandiTable';
import ProfitEstimator from './components/ProfitEstimator';
import AuthModal from './components/AuthModal';
import {
  RefreshCw,
  Sprout,
  CloudSun,
  TrendingUp,
  Calculator,
  Inbox,
  UserCheck,
  LogOut
} from 'lucide-react';

const DISTRICTS = ['Pune', 'Nashik', 'Nagpur', 'Solapur', 'Kolhapur'];

export default function App() {
  const [activeTab, setActiveTab] = useState('weather'); // 'weather' | 'mandi' | 'estimator'
  const [district, setDistrict] = useState('Pune');
  const [weatherRecords, setWeatherRecords] = useState([]);
  const [mandiRecords, setMandiRecords] = useState([]);
  const [diseaseAlerts, setDiseaseAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('agri_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('agri_token');
    localStorage.removeItem('agri_user');
    setCurrentUser(null);
  };

  const fetchDistrictData = async (targetDistrict) => {
    setLoading(true);
    setErrorMessage('');

    // 1. Fetch Weather Records
    try {
      const weatherRes = await axios.get(`http://localhost:5000/api/v1/advisory/weather?district=${targetDistrict}`);
      setWeatherRecords(weatherRes.data.data || []);
    } catch (err) {
      console.error('Weather fetch error:', err.response?.data || err.message);
    }

    // 2. Fetch Mandi Records
    try {
      const mandiRes = await axios.get(`http://localhost:5000/api/v1/mandi?district=${targetDistrict}`);
      setMandiRecords(mandiRes.data.data || []);
    } catch (err) {
      console.error('Mandi fetch error:', err.response?.data || err.message);
    }

    // 3. Fetch Disease & Microclimate Warnings
    try {
      const diseaseRes = await axios.get(`http://localhost:5000/api/v1/advisory/disease-risk?district=${targetDistrict}`);
      setDiseaseAlerts(diseaseRes.data.data || []);
    } catch (err) {
      console.error('Disease risk fetch error:', err.response?.data || err.message);
    }

    setLoading(false);
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setErrorMessage('');

    try {
      await axios.post('http://localhost:5000/api/v1/advisory/sync', { district });
    } catch (err) {
      console.error('Weather sync failed:', err.response?.data || err.message);
      setErrorMessage(`Weather sync failed: ${err.message}`);
    }

    try {
      await axios.post('http://localhost:5000/api/v1/mandi/sync', { district });
    } catch (err) {
      console.error('Mandi sync failed:', err.response?.data || err.message);
    }

    await fetchDistrictData(district);
    setSyncing(false);
  };

  useEffect(() => {
    fetchDistrictData(district);
  }, [district]);

  const latestWeather = weatherRecords[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 text-white p-2 rounded-xl">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">AgriPulse</h1>
              <p className="text-xs text-slate-400">Smart Agriculture Farmer Advisory System</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-slate-100 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Live'}</span>
            </button>

            {/* Auth Profile / Login Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700">{currentUser.name}</span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {currentUser.role}
                </span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="text-slate-400 hover:text-red-500 ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="max-w-6xl mx-auto px-4 flex space-x-6 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('weather')}
            className={`py-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'weather'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span>Agro-Climate Advisory</span>
          </button>

          <button
            onClick={() => setActiveTab('mandi')}
            className={`py-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'mandi'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Mandi APMC Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('estimator')}
            className={`py-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'estimator'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Profit & Yield Estimator</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-6">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {errorMessage}
          </div>
        )}

        {loading && weatherRecords.length === 0 && mandiRecords.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium">Fetching district telemetry...</div>
        ) : (
          <>
            {activeTab === 'weather' && (
              <>
                {latestWeather ? (
                  <>
                    <WeatherCard data={latestWeather} />
                    <DiseaseAlerts alerts={diseaseAlerts} />
                    {weatherRecords.length > 0 && <TrendChart history={weatherRecords} />}
                  </>
                ) : (
                  <div className="bg-white p-12 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
                    <Inbox className="w-10 h-10 text-slate-300" />
                    <p className="text-slate-600 font-semibold text-base">No agro-climate telemetry found for {district}.</p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Click the green <strong>"Sync Live"</strong> button above to pull real-time weather data and compute farming advisories.
                    </p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'mandi' && (
              <MandiTable data={mandiRecords} />
            )}

            {activeTab === 'estimator' && (
              <ProfitEstimator district={district} />
            )}
          </>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={setCurrentUser}
      />
    </div>
  );
}