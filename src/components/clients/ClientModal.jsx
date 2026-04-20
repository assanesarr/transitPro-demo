// components/clients/ClientModal.jsx
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { initials } from '../../utils/formatters';

const AVATAR_BG = ["bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"];

// Export nommé
export const ClientModal = ({ open, onClose, onSave, initialData }) => {
  const [formClient, setFormClient] = useState({ 
    nom: "", contact: "", tel: "", email: "", ville: "", 
    type: "Entreprise", ninea: "", adresse: "", rc: "", note: "" 
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormClient(initialData);
    } else {
      setFormClient({ 
        nom: "", contact: "", tel: "", email: "", ville: "", 
        type: "Entreprise", ninea: "", adresse: "", rc: "", note: "" 
      });
    }
  }, [initialData]);

  if (!open) return null;

  const validate = () => {
    const errs = {};
    if (!formClient.nom.trim()) errs.nom = "Nom requis";
    if (!formClient.contact.trim()) errs.contact = "Contact requis";
    if (!formClient.tel.trim()) errs.tel = "Téléphone requis";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(formClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        <div className="bg-slate-900 px-6 py-4 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-black text-sm">👥</span>
            </div>
            <div>
              <p className="text-white font-bold">{initialData ? "Modifier le client" : "Nouveau client"}</p>
              <p className="text-slate-400 text-xs">{initialData ? "Mettre à jour les informations" : "Enregistrer un nouveau client"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Identité */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Identité</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Raison sociale / Nom *</label>
                <Input 
                  placeholder="ex: Groupe Teranga SARL" 
                  value={formClient.nom} 
                  onChange={e => setFormClient(f => ({ ...f, nom: e.target.value }))}
                  className={`rounded-xl ${errors.nom ? "border-rose-400" : ""}`} 
                />
                {errors.nom && <p className="text-xs text-rose-500 mt-1">{errors.nom}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Type de client</label>
                  <Select value={formClient.type} onValueChange={v => setFormClient(f => ({ ...f, type: v }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Entreprise", "PME", "Particulier", "ONG", "Administration"].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Ville</label>
                  <Select value={formClient.ville || ""} onValueChange={v => setFormClient(f => ({ ...f, ville: v }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                    <SelectContent>
                      {["Dakar", "Thiès", "Saint-Louis", "Touba", "Kaolack", "Ziguinchor", "Tambacounda", "Diourbel", "Louga", "Kolda", "Fatick", "Kaffrine", "Sédhiou", "Kédougou", "Matam"].map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Adresse complète</label>
                <Input 
                  placeholder="ex: 45 Rue de Thiong, Plateau" 
                  value={formClient.adresse || ""}
                  onChange={e => setFormClient(f => ({ ...f, adresse: e.target.value }))} 
                  className="rounded-xl" 
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Contact</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nom du contact principal *</label>
                <Input 
                  placeholder="ex: M. Ousmane Diop" 
                  value={formClient.contact} 
                  onChange={e => setFormClient(f => ({ ...f, contact: e.target.value }))}
                  className={`rounded-xl ${errors.contact ? "border-rose-400" : ""}`} 
                />
                {errors.contact && <p className="text-xs text-rose-500 mt-1">{errors.contact}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Téléphone *</label>
                  <Input 
                    placeholder="+221 77 000 0000" 
                    value={formClient.tel} 
                    onChange={e => setFormClient(f => ({ ...f, tel: e.target.value }))}
                    className={`rounded-xl ${errors.tel ? "border-rose-400" : ""}`} 
                  />
                  {errors.tel && <p className="text-xs text-rose-500 mt-1">{errors.tel}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email</label>
                  <Input 
                    type="email" 
                    placeholder="contact@societe.sn" 
                    value={formClient.email}
                    onChange={e => setFormClient(f => ({ ...f, email: e.target.value }))} 
                    className="rounded-xl" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informations légales */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Informations légales</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">NINEA</label>
                <Input 
                  placeholder="ex: 00123456-2T1" 
                  value={formClient.ninea} 
                  onChange={e => setFormClient(f => ({ ...f, ninea: e.target.value }))}
                  className="rounded-xl font-mono" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Registre du commerce</label>
                <Input 
                  placeholder="ex: SN-DKR-2020-B-1234" 
                  value={formClient.rc || ""}
                  onChange={e => setFormClient(f => ({ ...f, rc: e.target.value }))} 
                  className="rounded-xl font-mono" 
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Note interne</p>
            <Input 
              placeholder="Informations complémentaires sur ce client…" 
              value={formClient.note || ""}
              onChange={e => setFormClient(f => ({ ...f, note: e.target.value }))} 
              className="rounded-xl" 
            />
          </div>

          {/* Aperçu */}
          {formClient.nom && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Aperçu</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${AVATAR_BG[0]} rounded-xl flex items-center justify-center font-bold text-sm shrink-0`}>
                  {initials(formClient.nom)}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{formClient.nom}</p>
                  <p className="text-xs text-slate-500">{formClient.contact || "Contact non renseigné"} · {formClient.ville || "Ville non renseignée"}</p>
                </div>
                <Badge variant="outline" className="ml-auto text-xs rounded-lg">{formClient.type}</Badge>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm py-3 rounded-xl">
              {initialData ? "Mettre à jour" : "Enregistrer le client"}
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

// Export par défaut également pour plus de compatibilité
export default ClientModal;