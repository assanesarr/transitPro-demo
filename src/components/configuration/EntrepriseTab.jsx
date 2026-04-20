import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export const EntrepriseTab = ({ config, updateConfig }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-4">
        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Identité de la société</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Raison sociale</label>
                <Input value={config.entreprise.nom} onChange={e => updateConfig("entreprise", "nom", e.target.value)} className="rounded-xl" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Slogan</label>
                <Input value={config.entreprise.slogan} onChange={e => updateConfig("entreprise", "slogan", e.target.value)} className="rounded-xl" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Adresse</label>
                <Input value={config.entreprise.adresse} onChange={e => updateConfig("entreprise", "adresse", e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ville</label>
                <Input value={config.entreprise.ville} onChange={e => updateConfig("entreprise", "ville", e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Téléphone</label>
                <Input value={config.entreprise.tel} onChange={e => updateConfig("entreprise", "tel", e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <Input type="email" value={config.entreprise.email} onChange={e => updateConfig("entreprise", "email", e.target.value)} className="rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Site web</label>
                <Input value={config.entreprise.site} onChange={e => updateConfig("entreprise", "site", e.target.value)} className="rounded-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Identifiants légaux</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "NINEA", key: "ninea" },
                { label: "RCCM", key: "rc" },
                { label: "Agrément DGD", key: "agrement" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <Input value={config.entreprise[f.key] || ""} onChange={e => updateConfig("entreprise", f.key, e.target.value)} className="rounded-xl font-mono text-sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aperçu */}
      <div>
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden sticky top-6">
          <div className="bg-slate-900 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-slate-900 font-black text-lg">T</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">{config.entreprise.nom}</p>
                <p className="text-slate-400 text-xs">{config.entreprise.slogan}</p>
              </div>
            </div>
          </div>
          <CardContent className="p-4 space-y-2 text-xs text-slate-500">
            <p>📍 {config.entreprise.adresse}</p>
            <p>🏙 {config.entreprise.ville}</p>
            <p>📞 {config.entreprise.tel}</p>
            <p>✉ {config.entreprise.email}</p>
            <div className="border-t border-slate-100 pt-3 mt-3">
              <p className="text-slate-400">NINEA : <span className="text-slate-700">{config.entreprise.ninea}</span></p>
              <p className="text-slate-400">RCCM : <span className="text-slate-700">{config.entreprise.rc}</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};