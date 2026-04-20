import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const PreferencesTab = ({ config, updateConfig, darkMode, toggleDarkMode, showSolde, setShowSolde }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">Paramètres financiers</CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {[
            { label: "Devise", key: "devise", type: "select", opts: ["FCFA", "EUR", "USD"] },
            { label: "Taux TVA (%)", key: "tauxTVA", type: "number" },
            { label: "Délai de paiement (jours)", key: "delaiPaiement", type: "number" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{f.label}</label>
              {f.type === "select" ? (
                <Select value={String(config.preferences[f.key])} onValueChange={v => updateConfig("preferences", f.key, v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>{f.opts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              ) : (
                <Input type="number" value={config.preferences[f.key]} onChange={e => updateConfig("preferences", f.key, parseInt(e.target.value))} className="rounded-xl" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">Apparence</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Thème</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => toggleDarkMode(false)} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold ${!darkMode ? "bg-amber-400 text-slate-900 border-amber-400" : "bg-white text-slate-500 border-slate-200"}`}>
                  ☀️ Mode clair
                </button>
                <button onClick={() => toggleDarkMode(true)} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold ${darkMode ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200"}`}>
                  🌙 Mode sombre
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Visibilité des soldes</label>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-700">{showSolde ? "Soldes visibles" : "Soldes masqués"}</p>
                  <p className="text-xs text-slate-400">{showSolde ? "Les montants sont affichés en clair" : "Les montants apparaissent comme ••••••"}</p>
                </div>
                <button onClick={() => setShowSolde(!showSolde)} className={`w-12 h-6 rounded-full transition-all relative ${showSolde ? "bg-emerald-500" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${showSolde ? "left-6" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};