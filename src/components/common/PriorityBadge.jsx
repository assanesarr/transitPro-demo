import React from 'react';

export const PriorityBadge = ({ priorite }) => {
  const cfg = {
    urgente: "bg-rose-100 text-rose-700 border-rose-200",
    haute: "bg-orange-100 text-orange-700 border-orange-200",
    normale: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg[priorite] || cfg.normale}`}>
      {priorite}
    </span>
  );
};