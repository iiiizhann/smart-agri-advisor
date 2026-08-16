import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calculator, IndianRupee, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Tomato', 'Onion'];

export default function ProfitEstimator({ district }) {
  const [commodity, setCommodity] = useState('Soybean');
  const [acreage, setAcreage] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateProfit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/v1/advisory/estimate', {
        district,
        commodity,
        acreage: Number(acreage)
      });
      setResult(res.data.data);
    } catch (err) {
      console.error('Calculation error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateProfit();
  }, [district, commodity, acreage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input Form Panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center space-x-2 text-emerald-700">
          <Calculator className="w-5 h-5" />
          <h3 className="text-lg font-bold text-slate-800">Profit & Yield Estimator</h3>
        </div>
        <p className="text-xs text-slate-400">
          Computes projected revenue using live {district} APMC modal rates against state cultivation expenditure baselines.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Select Crop</label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {COMMODITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Land Area (Acres)</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={acreage}
              onChange={(e) => setAcreage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Results Display */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
        {result ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                  {result.market}
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-1">
                  {result.commodity} Financial Forecast ({result.acreage} Acres)
                </h4>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">APMC Benchmark Rate</p>
                <p className="text-lg font-bold text-slate-800">₹{result.modalPrice} <span className="text-xs font-normal text-slate-500">/ Qtl</span></p>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Expected Yield</p>
                <p className="text-lg font-bold text-slate-800">{result.estimatedProduction} Qtl</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Est. Input Costs</p>
                <p className="text-lg font-bold text-slate-700">₹{result.estimatedTotalCost.toLocaleString()}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500">Gross Revenue</p>
                <p className="text-lg font-bold text-slate-900">₹{result.estimatedGrossRevenue.toLocaleString()}</p>
              </div>

              <div className={`p-4 rounded-xl ${result.estimatedNetProfit >= 0 ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'}`}>
                <p className="text-xs font-semibold">Net Margin</p>
                <p className="text-lg font-black flex items-center">
                  ₹{result.estimatedNetProfit.toLocaleString()}
                  {result.estimatedNetProfit >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 ml-1 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 ml-1 text-red-600" />
                  )}
                </p>
              </div>
            </div>

            {/* Agricultural Advisory Note */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900 uppercase">Harvesting Guidance</p>
                <p className="text-sm text-amber-800 mt-0.5">{result.harvestAdvice}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-slate-400">Loading forecast...</div>
        )}
      </div>
    </div>
  );
}