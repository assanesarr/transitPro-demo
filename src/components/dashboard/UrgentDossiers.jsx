import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatutBadge } from '../common/StatutBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { AvatarCircle } from '../common/AvatarCircle';
import { fmt, resteApayer, tauxPaiement } from '../../utils/formatters';

export const UrgentDossiers = ({ dossiers, clients, onDossierClick }) => {
  const urgentDossiers = dossiers
    .filter(d => !["cloture", "annule"].includes(d.statut))
    .sort((a, b) => a.priorite === "urgente" ? -1 : 1)
    .slice(0, 5);

  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-700">Dossiers prioritaires à traiter</CardTitle>
        <button className="text-xs text-slate-400 hover:text-slate-700 font-medium">Voir tous →</button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-50">
          {urgentDossiers.map((d, i) => {
            const client = clients.find(c => c.id === d.clientId);
            const reste = resteApayer(d);
            const taux = tauxPaiement(d);
            return (
              <div key={d.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 cursor-pointer transition-colors" onClick={() => onDossierClick(d)}>
                <AvatarCircle name={client?.nom || "?"} idx={i} size="w-9 h-9" text="text-xs" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800">{d.id}</span>
                    <PriorityBadge priorite={d.priorite} />
                    <StatutBadge statut={d.statut} />
                  </div>
                  <p className="text-xs text-slate-500 truncate">{client?.nom} · {d.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-400">Reste</p>
                  <p className={`text-sm font-bold ${reste > 0 ? "text-rose-500" : "text-emerald-600"}`}>
                    {reste > 0 ? fmt(reste) : "Soldé"}
                  </p>
                </div>
                <div className="w-16 shrink-0">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Paiement</span>
                    <span>{taux}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div className="h-1.5 bg-emerald-400 rounded-full" style={{ width: `${taux}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};