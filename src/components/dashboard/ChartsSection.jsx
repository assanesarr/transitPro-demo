// components/dashboard/ChartsSection.jsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend  // ← Ajouter Legend ici
} from 'recharts';
import { STATUTS_DOSSIER } from '../../constants/statuts';
import { CustomTooltip } from '../common/CustomTooltip';
import { totalPaye } from '../../utils/formatters';

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#f97316", "#06b6d4", "#10b981", "#ec4899"];

export const ChartsSection = ({ dossiers = [], clients = [] }) => {
  // Vérification et valeurs par défaut
  const safeDossiers = Array.isArray(dossiers) ? dossiers : [];
  const safeClients = Array.isArray(clients) ? clients : [];

  const pieData = useMemo(() => {
    if (safeDossiers.length === 0) return [];
    
    return Object.entries(STATUTS_DOSSIER)
      .map(([k, v]) => ({
        name: v.label, 
        value: safeDossiers.filter(d => d.statut === k).length
      }))
      .filter(x => x.value > 0);
  }, [safeDossiers]);

  const barEncaissement = useMemo(() => {
    if (safeClients.length === 0 || safeDossiers.length === 0) return [];
    
    return safeClients.slice(0, 6).map(c => {
      const dos = safeDossiers.filter(d => d.clientId === c.id);
      return {
        name: c.nom?.split(" ")[0] || c.nom || "Client",
        Facturé: dos.reduce((s, d) => s + (d.montantTotal || 0), 0),
        Encaissé: dos.reduce((s, d) => s + totalPaye(d), 0),
      };
    }).filter(item => item.Facturé > 0 || item.Encaissé > 0);
  }, [safeDossiers, safeClients]);

  // Si pas de données, afficher un message
  if (safeDossiers.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 rounded-2xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Facturé vs Encaissé par client</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-48">
            <p className="text-slate-400 text-sm">Aucune donnée disponible</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Statuts dossiers</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-48">
            <p className="text-slate-400 text-sm">Aucun dossier</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2 rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">Facturé vs Encaissé par client</CardTitle>
        </CardHeader>
        <CardContent>
          {barEncaissement.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-slate-400 text-sm">Aucune donnée à afficher</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barEncaissement} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 10, fill: "#94a3b8" }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={v => v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : (v / 1000).toFixed(0) + "k"} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Facturé" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={18} />
                <Bar dataKey="Encaissé" fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">Statuts dossiers</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-slate-400 text-sm">Aucun statut</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={45} 
                    outerRadius={70} 
                    paddingAngle={2}
                  >
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v + " dossier(s)", n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;