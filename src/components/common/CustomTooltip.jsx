import React from 'react';

export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color || p.fill }} className="flex justify-between gap-3">
          <span>{p.name}</span>
          <span className="font-semibold">{p.value?.toLocaleString("fr-FR")}</span>
        </div>
      ))}
    </div>
  );
};