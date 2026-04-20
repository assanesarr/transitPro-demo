import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AvatarCircle } from '../common/AvatarCircle';
import { resteApayer } from '../../utils/formatters';

export const ClientCard = ({ client, index, dossiers, onEdit, onDelete, hasDeletePermission }) => {
  const totalClient = dossiers.reduce((s, d) => s + d.montantTotal, 0);
  const payeClient = dossiers.reduce((s, d) => s + d.paiements.reduce((ss, p) => ss + p.montant, 0), 0);
  const resteClient = totalClient - payeClient;
  const actifs = dossiers.filter(d => !["cloture", "annule"].includes(d.statut)).length;

  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <AvatarCircle name={client.nom} idx={index} size="w-11 h-11" text="text-sm" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-sm leading-tight">{client.nom}</p>
            <p className="text-xs text-slate-500">{client.contact}</p>
            <Badge variant="outline" className="text-xs mt-1 rounded-lg">{client.type}</Badge>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-400 flex items-center justify-center text-xs" title="Modifier">✏️</button>
            {hasDeletePermission && (
              <button onClick={onDelete} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-400 flex items-center justify-center text-xs" title="Supprimer">🗑</button>
            )}
          </div>
        </div>
        
        <div className="space-y-1.5 text-xs mb-4">
          {[
            { icon: "📍", v: [client.ville, client.adresse].filter(Boolean).join(" — ") || "—" },
            { icon: "📞", v: client.tel || "—" },
            { icon: "✉", v: client.email || "—" },
            { icon: "🏛", v: `NINEA: ${client.ninea || "—"}` },
          ].map(r => (
            <div key={r.v} className="flex items-center gap-2 text-slate-500">
              <span>{r.icon}</span>
              <span className="truncate">{r.v}</span>
            </div>
          ))}
        </div>
        
        {client.note && <p className="text-xs text-slate-400 italic mb-3 border-l-2 border-slate-200 pl-2">{client.note}</p>}
        
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
          {[
            { label: "Dossiers", value: dossiers.length, color: "text-slate-800" },
            { label: "Actifs", value: actifs, color: "text-blue-600" },
            { label: "Reste", value: resteClient > 0 ? `${(resteClient / 1000).toFixed(0)}k` : "Soldé", color: resteClient > 0 ? "text-rose-500" : "text-emerald-600" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-xs text-slate-400 mb-0.5">{s.label}</p>
              <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};