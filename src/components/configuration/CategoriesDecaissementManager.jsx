import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ICONS_OPTIONS = ["⚓", "🏛", "📄", "🚛", "🏭", "⏱", "⚠️", "📊", "🏢", "💸"];
const COLOR_OPTIONS = [
  { label: "Bleu", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { label: "Violet", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  { label: "Ambre", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { label: "Teal", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
  { label: "Rose", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
  { label: "Émeraude", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
];

const EMPTY_CAT_FORM = { key: "", label: "", icon: "💸", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };

export const CategoriesDecaissementManager = ({ config, updateConfig }) => {
  const [catForm, setCatForm] = useState(EMPTY_CAT_FORM);
  const [editIdx, setEditIdx] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!catForm.key.trim()) e.key = "Requis";
    if (!catForm.label.trim()) e.label = "Requis";
    const duplicate = config.categoriesDecaiss.some((c, i) => c.key === catForm.key.trim() && i !== editIdx);
    if (duplicate) e.key = "Ce code existe déjà";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const cat = { ...catForm, key: catForm.key.trim(), label: catForm.label.trim() };
    if (editIdx !== null) {
      updateConfig("categoriesDecaiss", editIdx, cat);
    } else {
      updateConfig("categoriesDecaiss", config.categoriesDecaiss.length, [...config.categoriesDecaiss, cat]);
    }
    setCatForm(EMPTY_CAT_FORM);
    setEditIdx(null);
    setErrors({});
  };

  const deleteCat = (idx) => {
    if (window.confirm(`Supprimer "${config.categoriesDecaiss[idx].label}" ?`)) {
      updateConfig("categoriesDecaiss", idx, config.categoriesDecaiss.filter((_, i) => i !== idx));
    }
  };

  const openEdit = (cat, idx) => {
    setCatForm({ ...cat });
    setEditIdx(idx);
    setErrors({});
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700">Catégories de décaissement</CardTitle>
            <button onClick={() => { setCatForm(EMPTY_CAT_FORM); setEditIdx(null); }} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900">
              + Nouvelle catégorie
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                {["Aperçu", "Icône", "Clé", "Libellé", ""].map(h => (
                  <TableHead key={h} className="text-xs font-semibold text-slate-400 first:pl-5 last:pr-4">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {config.categoriesDecaiss.map((cat, i) => (
                <TableRow key={i} className="border-slate-50 hover:bg-slate-50/60 group">
                  <TableCell className="pl-5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                      {cat.icon} {cat.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-xl">{cat.icon}</TableCell>
                  <TableCell><code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{cat.key}</code></TableCell>
                  <TableCell className="text-sm font-medium">{cat.label}</TableCell>
                  <TableCell className="pr-4">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(cat, i)} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500">✏️</button>
                      <button onClick={() => deleteCat(i)} className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500">🗑</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Formulaire d'ajout/édition */}
      {(catForm.key || catForm.label || editIdx !== null) && (
        <Card className="rounded-2xl border-2 border-amber-200 bg-amber-50/20">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Code (key) *</label>
                  <Input value={catForm.key} onChange={e => setCatForm(f => ({ ...f, key: e.target.value.replace(/\s/g, "") }))}
                    placeholder="Debarquement" className={`rounded-xl font-mono ${errors.key ? "border-rose-400" : ""}`} />
                  {errors.key && <p className="text-xs text-rose-500 mt-1">{errors.key}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Libellé *</label>
                  <Input value={catForm.label} onChange={e => setCatForm(f => ({ ...f, label: e.target.value }))}
                    placeholder="Débarquement" className={`rounded-xl ${errors.label ? "border-rose-400" : ""}`} />
                  {errors.label && <p className="text-xs text-rose-500 mt-1">{errors.label}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Icône</label>
                  <div className="flex flex-wrap gap-1.5 p-3 bg-white rounded-xl border">
                    {ICONS_OPTIONS.map(ic => (
                      <button key={ic} onClick={() => setCatForm(f => ({ ...f, icon: ic }))}
                        className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center ${catForm.icon === ic ? "bg-amber-400 shadow-md scale-110" : "hover:bg-slate-100"}`}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Couleur</label>
                  <div className="grid grid-cols-3 gap-2">
                    {COLOR_OPTIONS.map(opt => (
                      <button key={opt.label} onClick={() => setCatForm(f => ({ ...f, color: opt.color, bg: opt.bg, border: opt.border }))}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 ${catForm.color === opt.color ? "border-slate-700" : "border-transparent"} ${opt.bg}`}>
                        <span className={`w-5 h-5 rounded-full border-2 ${opt.bg} ${opt.border}`} />
                        <span className={`text-xs font-semibold ${opt.color}`}>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aperçu */}
                <div className="bg-white rounded-xl p-4 text-center border">
                  <p className="text-xs text-slate-400 mb-2">Aperçu</p>
                  <span className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border ${catForm.bg} ${catForm.color} ${catForm.border}`}>
                    <span>{catForm.icon}</span> {catForm.label || "Libellé"}
                  </span>
                </div>

                <button onClick={submit} className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm py-2.5 rounded-xl">
                  {editIdx !== null ? "✏️ Mettre à jour" : "＋ Ajouter"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};