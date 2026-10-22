import React from "react";

const DiseaseAlerts = ({ alerts = [] }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-2">Disease Alerts</h2>
      {alerts.length === 0 ? (
        <p className="text-gray-500">No active disease alerts.</p>
      ) : (
        <ul className="space-y-2">
          {alerts.map((alert, index) => (
            <li key={index} className="text-sm text-red-600">
              {alert.message || alert}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DiseaseAlerts;