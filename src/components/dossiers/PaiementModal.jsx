import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MODES_PAIEMENT } from '../../constants/types';
import { fmt, resteApayer, today } from '../../utils/formatters';

export const PaiementModal = ({ open, onClose, onSave, dossierId, dossiers }) => {
  const [formPaiement, setFormPaiement] = useState({ montant: "", mode: "Virement bancaire", date: today(), ref: "", note: "" });

  if (!open) return null;

  const dossier = dossiers.find(d => d.id === dossierId);
  const reste = dossier ? resteApayer(dossier) : 0;

  const handleSave = () => {
    const mt = parseInt(formPaiement.montant);
    if (!mt || !dossierId) return;
    if (mt > reste) {
      alert("Montant supérieur au reste à payer");
      return;
    }
    onSave(dossierId, {
      id: `P${Date.now()}`,
      date: formPaiement.date,
      montant: mt,
      mode: formPaiement.mode,
      ref: formPaiement.ref || `REF-${Date.now()}`,
      note: formPaiement.note,
    });
    setFormPaiement({ montant: "", mode: "Virement bancaire", date: today(), ref: "", note: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
        <div className="bg-slate-900 px-6 py-4 rounded-t-2xl flex justify-between items-start">
          <div>
            <p className="text-white font-bold">Enregistrer un paiement</p>
            <p className="text-slate-400 text-xs mt-0.5">{dossier?.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex justify-between">
            <span className="text-rose-600 text-sm font-medium">Reste à percevoir</span>
            <span className="text-rose-700 font-bold tabular-nums">{fmt(reste)}</span>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Montant reçu (FCFA) *</label>
            <Input 
              type="number" 
              max={reste} 
              placeholder={`Max: ${reste.toLocaleString("fr-FR")}`}
              value={formPaiement.montant} 
              onChange={e => setFormPaiement(f => ({ ...f, montant: e.target.value }))}
              className="rounded-xl text-lg font-semibold" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Mode de paiement</label>
              <Select value={formPaiement.mode} onValueChange={v => setFormPaiement(f => ({ ...f, mode: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MODES_PAIEMENT.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Date</label>
              <Input type="date" value={formPaiement.date} onChange={e => setFormPaiement(f => ({ ...f, date: e.target.value }))} className="rounded-xl" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Référence</label>
            <Input placeholder="ex: VIR-2026-042" value={formPaiement.ref} onChange={e => setFormPaiement(f => ({ ...f, ref: e.target.value }))} className="rounded-xl" />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Note</label>
            <Input placeholder="Commentaire optionnel" value={formPaiement.note} onChange={e => setFormPaiement(f => ({ ...f, note: e.target.value }))} className="rounded-xl" />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm py-2.5 rounded-xl">
              Confirmer le paiement
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