// components/dashboard/KPICards.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { fmtM } from '../../utils/formatters';

export const KPICards = ({ stats, isAdmin, showSolde }) => {
  // Valeurs par défaut pour éviter l'erreur
  const defaultStats = {
    total: 0,
    paye: 0,
    totalDecaiss: 0,
    soldeNet: 0,
    reste: 0
  };
  
  const safeStats = stats || defaultStats;

  const kpis = [
    { 
      label: "Total facturé", 
      value: fmtM(safeStats.total), 
      color: "text-slate-900", 
      bg: "bg-white", 
      icon: "💰", 
      sub: "Prestations TTC" 
    },
    { 
      label: "Encaissements", 
      value: fmtM(safeStats.paye), 
      color: "text-emerald-600", 
      bg: "bg-emerald-50", 
      icon: "⬇", 
      sub: "Reçus clients" 
    },
    { 
      label: "Décaissements", 
      value: fmtM(safeStats.totalDecaiss), 
      color: "text-rose-600", 
      bg: "bg-rose-50", 
      icon: "⬆", 
      sub: "Frais réglés" 
    },
    { 
      label: "Solde net", 
      value: fmtM(Math.abs(safeStats.soldeNet)), 
      color: safeStats.soldeNet >= 0 ? "text-blue-700" : "text-orange-600", 
      bg: safeStats.soldeNet >= 0 ? "bg-blue-50" : "bg-orange-50", 
      icon: safeStats.soldeNet >= 0 ? "✓" : "!", 
      sub: safeStats.soldeNet >= 0 ? "Bénéfice" : "Déficit" 
    },
    { 
      label: "Reste à percevoir", 
      value: fmtM(safeStats.reste), 
      color: "text-amber-600", 
      bg: "bg-amber-50", 
      icon: "⏳", 
      sub: "Non encaissé" 
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpis.map(k => (
        <Card key={k.label} className={`rounded-2xl border-0 shadow-sm ${k.bg}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">{k.label}</p>
              <span className={`text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center ${k.color} bg-white/60`}>
                {k.icon}
              </span>
            </div>
            <p className={`text-xl font-black ${k.color} leading-tight tabular-nums`}>
              {(isAdmin && showSolde) ? k.value : "••••••"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICards;