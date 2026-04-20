import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TYPES_PRESTATION } from '../../constants/types';
import { today, fmt } from '../../utils/formatters';

export const NouveauDossierModal = ({ open, onClose, onSave, clients }) => {
  const [formDossier, setFormDossier] = useState({
    clientId: "", type: "Dédouanement import", description: "", dateEcheance: "",
    priorite: "normale", responsable: "", port: "", bl: "",
    prestations: [{ label: "", montant: "" }]
  });

  if (!open) return null;

  const ajouterDossier = () => {
    if (!formDossier.clientId || !formDossier.description) return;
    const total = formDossier.prestations.reduce((s, p) => s + (parseInt(p.montant) || 0), 0);
    const num = String(Date.now()).slice(-4);
    const newDossier = {
      id: `DOS-${new Date().getFullYear()}-${num}`,
      clientId: parseInt(formDossier.clientId),
      type: formDossier.type,
      description: formDossier.description,
      statut: "nouveau",
      dateOuverture: today(),
      dateEcheance: formDossier.dateEcheance,
      montantTotal: total,
      paiements: [],
      prestations: formDossier.prestations.filter(p => p.label && p.montant).map(p => ({ ...p, montant: parseInt(p.montant) })),
      priorite: formDossier.priorite,
      responsable: formDossier.responsable,
      port: formDossier.port,
      bl: formDossier.bl,
      decaissements: [],
    };
    onSave(newDossier);
    setFormDossier({
      clientId: "", type: "Dédouanement import", description: "", dateEcheance: "",
      priorite: "normale", responsable: "", port: "", bl: "",
      prestations: [{ label: "", montant: "" }]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="bg-slate-900 px-6 py-4 rounded-t-2xl flex justify-between items-center sticky top-0">
          <p className="text-white font-bold">Nouveau dossier</p>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Client *</label>
              <Select value={formDossier.clientId} onValueChange={v => setFormDossier(f => ({ ...f, clientId: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                <SelectContent>
                  {clients.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.nom}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Type de prestation</label>
              <Select value={formDossier.type} onValueChange={v => setFormDossier(f => ({ ...f, type: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES_PRESTATION.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description *</label>
            <Input placeholder="ex: Conteneur 40HC électroniques — Chine" value={formDossier.description}
              onChange={e => setFormDossier(f => ({ ...f, description: e.target.value }))} className="rounded-xl" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Priorité</label>
              <Select value={formDossier.priorite} onValueChange={v => setFormDossier(f => ({ ...f, priorite: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["urgente", "haute", "normale"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Date échéance</label>
              <Input type="date" value={formDossier.dateEcheance} onChange={e => setFormDossier(f => ({ ...f, dateEcheance: e.target.value }))} className="rounded-xl" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Responsable</label>
              <Input placeholder="ex: Moussa Diaw" value={formDossier.responsable}
                onChange={e => setFormDossier(f => ({ ...f, responsable: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Port / Aéroport</label>
              <Input placeholder="ex: Port Dakar" value={formDossier.port}
                onChange={e => setFormDossier(f => ({ ...f, port: e.target.value }))} className="rounded-xl" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">B/L · LTA · AWB</label>
            <Input placeholder="ex: BL-SH-2026-4521" value={formDossier.bl}
              onChange={e => setFormDossier(f => ({ ...f, bl: e.target.value }))} className="rounded-xl" />
          </div>

          {/* Prestations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lignes de prestation</label>
              <button onClick={() => setFormDossier(f => ({ ...f, prestations: [...f.prestations, { label: "", montant: "" }] }))}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Ajouter ligne</button>
            </div>
            <div className="space-y-2">
              {formDossier.prestations.map((p, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input placeholder="Libellé prestation" value={p.label}
                    onChange={e => setFormDossier(f => ({ ...f, prestations: f.prestations.map((x, j) => j === i ? { ...x, label: e.target.value } : x) }))}
                    className="rounded-xl flex-1 text-sm" />
                  <Input type="number" placeholder="Montant" value={p.montant}
                    onChange={e => setFormDossier(f => ({ ...f, prestations: f.prestations.map((x, j) => j === i ? { ...x, montant: e.target.value } : x) }))}
                    className="rounded-xl w-32 text-sm" />
                  {formDossier.prestations.length > 1 && (
                    <button onClick={() => setFormDossier(f => ({ ...f, prestations: f.prestations.filter((_, j) => j !== i) }))}
                      className="text-slate-300 hover:text-rose-400 shrink-0">✕</button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-right text-xs text-slate-400">
              Total : <span className="font-bold text-slate-700">{fmt(formDossier.prestations.reduce((s, p) => s + (parseInt(p.montant) || 0), 0))}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={ajouterDossier} className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm py-2.5 rounded-xl">
              Créer le dossier
            </button>
            <button onClick={onClose} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};