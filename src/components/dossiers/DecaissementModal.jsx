import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES_DECAISSEMENT, MODES_PAIEMENT } from '../../constants/types';
import { today, fmt } from '../../utils/formatters';

const getCatDecaiss = (key) => CATEGORIES_DECAISSEMENT.find(c => c.key === key) || { label: key, icon: "💸", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };

export const DecaissementModal = ({ open, onClose, onSave, dossierId }) => {
  const [formDecaiss, setFormDecaiss] = useState({ categorie: "Debarquement", montant: "", date: today(), ref: "", mode: "Virement bancaire", note: "" });

  if (!open) return null;

  const catSel = getCatDecaiss(formDecaiss.categorie);

  const handleSave = () => {
    const mt = parseInt(formDecaiss.montant);
    if (!mt || !dossierId) return;
    onSave(dossierId, {
      id: `D${Date.now()}`,
      categorie: formDecaiss.categorie,
      montant: mt,
      date: formDecaiss.date,
      ref: formDecaiss.ref || `REF-${Date.now()}`,
      mode: formDecaiss.mode,
      note: formDecaiss.note,
    });
    setFormDecaiss({ categorie: "Debarquement", montant: "", date: today(), ref: "", mode: "Virement bancaire", note: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 max-h-[92vh] overflow-y-auto">
        <div className="bg-rose-600 px-6 py-4 rounded-t-2xl flex justify-between items-start">
          <div>
            <p className="text-white font-bold text-base">Nouveau décaissement</p>
            <p className="text-rose-200 text-xs mt-0.5">Dossier #{dossierId}</p>
          </div>
          <button onClick={onClose} className="text-rose-200 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Catégorie */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Catégorie de décaissement</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES_DECAISSEMENT.map(cat => {
                const selected = formDecaiss.categorie === cat.key;
                return (
                  <button key={cat.key} onClick={() => setFormDecaiss(f => ({ ...f, categorie: cat.key }))}
                    className={`p-2.5 rounded-xl border text-left transition-all ${selected ? `${cat.bg} ${cat.border} border-2 shadow-sm` : "border-slate-200 hover:border-slate-300 bg-white"}`}>
                    <span className="text-base block mb-1">{cat.icon}</span>
                    <span className={`text-xs font-semibold leading-tight block ${selected ? cat.color : "text-slate-700"}`}>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Montant */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Montant décaissé (FCFA) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 font-bold text-sm">−</span>
              <Input type="number" min="0" placeholder="ex: 320000" value={formDecaiss.montant}
                onChange={e => setFormDecaiss(f => ({ ...f, montant: e.target.value }))}
                className="pl-8 rounded-xl text-base font-semibold" />
              {parseInt(formDecaiss.montant) > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{fmt(parseInt(formDecaiss.montant))}</span>
              )}
            </div>
          </div>

          {/* Date + Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date du paiement</label>
              <Input type="date" value={formDecaiss.date} onChange={e => setFormDecaiss(f => ({ ...f, date: e.target.value }))} className="rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mode de paiement</label>
              <Select value={formDecaiss.mode} onValueChange={v => setFormDecaiss(f => ({ ...f, mode: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{MODES_PAIEMENT.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* Référence + Note */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Référence / Quittance</label>
              <Input placeholder="ex: DD-2026-441" value={formDecaiss.ref} onChange={e => setFormDecaiss(f => ({ ...f, ref: e.target.value }))} className="rounded-xl font-mono text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Note</label>
              <Input placeholder="Commentaire…" value={formDecaiss.note} onChange={e => setFormDecaiss(f => ({ ...f, note: e.target.value }))} className="rounded-xl text-sm" />
            </div>
          </div>

          {/* Aperçu */}
          {parseInt(formDecaiss.montant) > 0 && (
            <div className={`rounded-xl p-4 border ${catSel.bg} ${catSel.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{catSel.icon}</span>
                  <div>
                    <p className={`text-sm font-bold ${catSel.color}`}>{catSel.label}</p>
                    <p className="text-xs text-slate-500">{formDecaiss.date} · {formDecaiss.mode}</p>
                  </div>
                </div>
                <p className="text-lg font-black text-rose-600 tabular-nums">−{fmt(parseInt(formDecaiss.montant))}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-3 rounded-xl">
              Enregistrer le décaissement
            </button>
            <button onClick={onClose} className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};