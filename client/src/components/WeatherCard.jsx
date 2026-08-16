import React from 'react';
import { CloudRain, Thermometer, Wind, Droplets, AlertTriangle } from 'lucide-react';

export default function WeatherCard({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            Live Agro-Climate
          </span>
          <h2 className="text-2xl font-bold text-slate-800 mt-2">{data.district} District</h2>
          <p className="text-xs text-slate-400">
            Last Updated: {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl">
          <Thermometer className="w-6 h-6 text-amber-500" />
          <div>
            <p className="text-xs text-slate-500">Temperature</p>
            <p className="text-lg font-bold text-slate-800">{data.temperature}°C</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl">
          <Droplets className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-xs text-slate-500">Humidity</p>
            <p className="text-lg font-bold text-slate-800">{data.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl">
          <Wind className="w-6 h-6 text-teal-500" />
          <div>
            <p className="text-xs text-slate-500">Wind Speed</p>
            <p className="text-lg font-bold text-slate-800">{data.windSpeed} m/s</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl">
          <CloudRain className="w-6 h-6 text-indigo-500" />
          <div>
            <p className="text-xs text-slate-500">Rainfall (1h)</p>
            <p className="text-lg font-bold text-slate-800">{data.rainfall} mm</p>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-emerald-900 uppercase">Crop Action Advisory</p>
          <p className="text-sm text-emerald-800 mt-0.5">{data.advisorySummary}</p>
        </div>
      </div>
    </div>
  );
}