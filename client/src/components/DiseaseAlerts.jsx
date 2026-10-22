import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function DiseaseAlerts({ alerts = [] }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 mb-6">
      <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm mb-3">
        <ShieldAlert className="w-5 h-5 text-amber-600" />
        <span>Disease & Microclimate Early Warnings</span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((item, idx) => {
          // Handle case if item is a plain string
          if (typeof item === 'string') {
            return (
              <div key={idx} className="flex items-start space-x-2 text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            );
          }

          // Handle case if item is an object { id, title, severity, description }
          return (
            <div
              key={item.id || idx}
              className="bg-white/80 p-3 rounded-xl border border-amber-100 flex flex-col space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">{item.title || 'Advisory Alert'}</span>
                {item.severity && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {item.severity}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}