import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatutBadge } from '../common/StatutBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { AvatarCircle } from '../common/AvatarCircle';
import { STATUTS_DOSSIER } from '../../constants/statuts';
import { CATEGORIES_DECAISSEMENT } from '../../constants/types';
import { fmt, totalPaye, resteApayer, totalDecaisse, soldeDecaisse, tauxPaiement } from '../../utils/formatters';

const getCatDecaiss = (key) => CATEGORIES_DECAISSEMENT.find(c => c.key === key) || { label: key, icon: "💸", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };

export const DossierDetail = ({ dossier, clients, onBack, onUpdate, onDelete, onPaiement, onDecaissement }) => {
  const client = clients.find(c => c.id === dossier.clientId);
  const paye = totalPaye(dossier);
  const reste = resteApayer(dossier);
  const taux = tauxPaiement(dossier);
  const cidx = clients.findIndex(c => c.id === dossier.clientId);

  const changerStatut = (statut) => onUpdate(dossier.id, { statut });

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-sm mb-1">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-700">← Dossiers</button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600 font-medium">{dossier.id}</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">{dossier.id}</h1>
            <StatutBadge statut={dossier.statut} />
            <PriorityBadge priorite={dossier.priorite} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={dossier.statut} onValueChange={changerStatut}>
              <SelectTrigger className="h-8 text-xs rounded-xl w-40 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUTS_DOSSIER).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button onClick={() => onDecaissement(dossier.id)} className="text-sm font-bold px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white">
              − Décaissement
            </button>
            <button onClick={() => onPaiement(dossier.id)} disabled={reste <= 0}
              className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${reste > 0 ? "bg-amber-400 hover:bg-amber-500 text-slate-900" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
              + Encaissement
            </button>
            <button onClick={() => { if (window.confirm("Supprimer définitivement le dossier ?")) onDelete(); }}
              className="text-sm font-bold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-500">
              🗑 Supprimer
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Colonne gauche */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info dossier */}
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AvatarCircle name={client?.nom || "?"} idx={cidx} />
                <div>
                  <p className="text-white font-semibold">{client?.nom}</p>
                  <p className="text-slate-400 text-xs">{client?.contact} · {client?.ville}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">B/L · LTA · AWB</p>
                <p className="text-white text-sm font-mono font-semibold">{dossier.bl}</p>
              </div>
            </div>
            <CardContent className="p-5">
              <p className="font-semibold text-slate-800 mb-1">{dossier.description}</p>
              <p className="text-sm text-slate-500 mb-4">{dossier.type}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                {[
                  { label: "Port / Aéroport", value: dossier.port },
                  { label: "Responsable", value: dossier.responsable },
                  { label: "Date ouverture", value: dossier.dateOuverture },
                  { label: "Date échéance", value: dossier.dateEcheance },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-slate-400 mb-0.5">{f.label}</p>
                    <p className="font-semibold text-slate-700">{f.value || "—"}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prestations */}
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Détail des prestations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    {["Prestation", "Montant HT", "% du total"].map(h => (
                      <TableHead key={h} className="text-xs font-semibold text-slate-400 first:pl-5 last:pr-5">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dossier.prestations.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-5 text-sm text-slate-700">{p.label}</TableCell>
                      <TableCell className="font-semibold text-slate-800 tabular-nums text-sm">{fmt(p.montant)}</TableCell>
                      <TableCell className="pr-5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 bg-slate-100 rounded-full w-16 overflow-hidden">
                            <div className="h-1.5 bg-blue-400 rounded-full" style={{ width: `${Math.round(p.montant / dossier.montantTotal * 100)}%` }} />
                          </div>
                          <span className="text-xs text-slate-400">{Math.round(p.montant / dossier.montantTotal * 100)}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center px-5 py-3 border-t border-slate-100 bg-slate-50/60">
                <span className="text-sm font-bold text-slate-700">Total</span>
                <span className="text-base font-black text-slate-900 tabular-nums">{fmt(dossier.montantTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite */}
        <div className="space-y-4">
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <div className={`px-5 py-4 ${reste <= 0 ? "bg-emerald-600" : "bg-slate-900"}`}>
              <p className={`text-xs uppercase tracking-widest mb-1 ${reste <= 0 ? "text-emerald-100" : "text-slate-400"}`}>
                Situation financière
              </p>
              <p className={`text-2xl font-black ${reste <= 0 ? "text-white" : "text-white"}`}>
                {reste <= 0 ? "Soldé" : fmt(reste)}
              </p>
              <p className={`text-xs mt-0.5 ${reste <= 0 ? "text-emerald-200" : "text-slate-400"}`}>
                {reste <= 0 ? "Paiement complet reçu" : "Reste à percevoir"}
              </p>
            </div>
            <CardContent className="p-4 space-y-3">
              {[
                { label: "Montant total", value: fmt(dossier.montantTotal), color: "text-slate-800" },
                { label: "Encaissé", value: fmt(paye), color: "text-emerald-600" },
                { label: "Reste", value: fmt(reste), color: reste > 0 ? "text-rose-500" : "text-emerald-600" },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-slate-400">{r.label}</span>
                  <span className={`font-bold tabular-nums ${r.color}`}>{r.value}</span>
                </div>
              ))}
              <div className="pt-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Taux d'encaissement</span>
                  <span className="font-semibold text-slate-600">{taux}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-3 rounded-full transition-all ${taux >= 100 ? "bg-emerald-400" : taux > 50 ? "bg-amber-400" : "bg-rose-400"}`} style={{ width: `${taux}%` }} />
                </div>
              </div>
              {reste > 0 && (
                <button onClick={() => onPaiement(dossier.id)} className="w-full mt-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm py-2.5 rounded-xl">
                  + Enregistrer un paiement
                </button>
              )}
            </CardContent>
          </Card>

          {/* Mini résumé décaissements */}
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <div className="bg-rose-600 px-4 py-3 rounded-t-2xl flex justify-between items-center">
              <p className="text-rose-100 text-xs font-semibold uppercase tracking-widest">Décaissements</p>
              <p className="text-white text-lg font-black tabular-nums">{fmt(totalDecaisse(dossier))}</p>
            </div>
            <CardContent className="p-4 space-y-1.5">
              {CATEGORIES_DECAISSEMENT.map(cat => {
                const montantCat = (dossier.decaissements || []).filter(x => x.categorie === cat.key).reduce((s, x) => s + x.montant, 0);
                if (!montantCat) return null;
                const pctCat = totalDecaisse(dossier) ? Math.round(montantCat / totalDecaisse(dossier) * 100) : 0;
                return (
                  <div key={cat.key} className="flex items-center gap-2">
                    <span className="text-sm shrink-0">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-slate-600 truncate font-medium">{cat.label}</span>
                        <span className="text-rose-600 font-semibold tabular-nums shrink-0 ml-2">{(montantCat / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full">
                        <div className="h-1 bg-rose-300 rounded-full" style={{ width: `${pctCat}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
              {(dossier.decaissements || []).length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">Aucun décaissement</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};