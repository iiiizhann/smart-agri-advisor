import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function MandiTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400">
        No Mandi price data available. Click "Sync Live" to ingest APMC records.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">APMC Market Rates</h3>
          <p className="text-xs text-slate-400">Modal, Minimum, and Maximum price per Quintal (₹/Qtl)</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
            <tr>
              <th className="px-6 py-3.5">Commodity</th>
              <th className="px-6 py-3.5">Market (Mandi)</th>
              <th className="px-6 py-3.5">Variety</th>
              <th className="px-6 py-3.5">Min Price</th>
              <th className="px-6 py-3.5">Max Price</th>
              <th className="px-6 py-3.5">Modal Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {data.map((item) => (
              <tr key={item._id || item.deduplicationHash} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-bold text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>{item.commodity}</span>
                </td>
                <td className="px-6 py-4">{item.market}</td>
                <td className="px-6 py-4 text-slate-500">{item.variety}</td>
                <td className="px-6 py-4 font-medium text-slate-600">₹{item.minPrice}</td>
                <td className="px-6 py-4 font-medium text-slate-600">₹{item.maxPrice}</td>
                <td className="px-6 py-4 font-bold text-emerald-700">₹{item.modalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}