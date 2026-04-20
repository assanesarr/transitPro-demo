import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StatutBadge } from '../common/StatutBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { AvatarCircle } from '../common/AvatarCircle';
import { fmt, totalPaye, resteApayer, totalDecaisse, soldeDecaisse, tauxPaiement } from '../../utils/formatters';

export const DossierCard = ({ dossier, client, index, onClick, onPaiement, onDelete, hasDeletePermission }) => {
  const paye = totalPaye(dossier);
  const reste = resteApayer(dossier);
  const taux = tauxPaiement(dossier);
  const decaiss = totalDecaisse(dossier);
  const solde = soldeDecaisse(dossier);
  const cidx = index;

  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={onClick}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors">{dossier.id}</span>
              <PriorityBadge priorite={dossier.priorite} />
            </div>
            <StatutBadge statut={dossier.statut} />
          </div>
          <AvatarCircle name={client?.nom || "?"} idx={cidx} size="w-9 h-9" text="text-xs" />
        </div>
        
        <p className="text-xs text-slate-500 mb-0.5 font-medium">{client?.nom}</p>
        <p className="text-sm text-slate-700 font-medium mb-1 leading-snug line-clamp-2">{dossier.description}</p>
        <p className="text-xs text-slate-400 mb-3">{dossier.type} · {dossier.port}</p>
        
        {/* Financier 3 cols */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <div className="bg-slate-50 rounded-xl p-2">
            <p className="text-xs text-slate-400 mb-0.5 leading-tight">Facturé</p>
            <p className="text-xs font-bold text-slate-700 tabular-nums">{(dossier.montantTotal / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-rose-50 rounded-xl p-2">
            <p className="text-xs text-rose-400 mb-0.5 leading-tight">Décaissé</p>
            <p className="text-xs font-bold text-rose-600 tabular-nums">{(decaiss / 1000).toFixed(0)}k</p>
          </div>
          <div className={`rounded-xl p-2 ${solde >= 0 ? "bg-emerald-50" : "bg-orange-50"}`}>
            <p className={`text-xs mb-0.5 leading-tight ${solde >= 0 ? "text-emerald-500" : "text-orange-500"}`}>Solde</p>
            <p className={`text-xs font-bold tabular-nums ${solde >= 0 ? "text-emerald-600" : "text-orange-600"}`}>
              {solde >= 0 ? "+" : ""}{(solde / 1000).toFixed(0)}k
            </p>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Encaissement</span>
            <span className="font-semibold text-slate-600">{taux}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-1.5 rounded-full transition-all ${taux >= 100 ? "bg-emerald-400" : taux > 50 ? "bg-amber-400" : "bg-rose-400"}`} style={{ width: `${taux}%` }} />
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-400">📅 {dossier.dateEcheance}</div>
          <div className="flex items-center gap-1.5">
            {hasDeletePermission && (
              <button onClick={e => { e.stopPropagation(); if (window.confirm(`Supprimer le dossier ${dossier.id} ?`)) onDelete(); }} 
                className="text-xs p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                🗑
              </button>
            )}
            <button onClick={e => { e.stopPropagation(); onPaiement(); }} disabled={reste <= 0}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${reste > 0 ? "bg-amber-400 hover:bg-amber-500 text-slate-900" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
              {reste > 0 ? "+ Paiement" : "Soldé"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};