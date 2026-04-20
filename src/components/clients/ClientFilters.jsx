import React from 'react';

const CLIENT_TYPES = ["Entreprise", "PME", "Particulier", "ONG", "Administration"];

export const ClientFilters = ({ clientSearch, setClientSearch, clientTypeFilter, setClientTypeFilter, clients, clientView, setClientView }) => {
  const typeCount = CLIENT_TYPES.reduce((acc, t) => { acc[t] = clients.filter(c => c.type === t).length; return acc; }, {});

  return (
    <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 rounded-2xl p-3">
      <div className="relative flex-1 min-w-[180px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
        <input value={clientSearch} onChange={e => setClientSearch(e.target.value)}
          placeholder="Rechercher client, contact, NINEA…"
          className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 bg-slate-50" />
      </div>

      <div className="w-px h-6 bg-slate-200 hidden sm:block" />

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">Type :</span>
        <button onClick={() => setClientTypeFilter("all")}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${clientTypeFilter === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>
          Tous ({clients.length})
        </button>
        {CLIENT_TYPES.filter(t => typeCount[t] > 0).map(t => (
          <button key={t} onClick={() => setClientTypeFilter(clientTypeFilter === t ? "all" : t)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${clientTypeFilter === t ? "bg-amber-400 text-slate-900 border-amber-400 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-700"}`}>
            {t} <span className={`ml-0.5 ${clientTypeFilter === t ? "text-slate-700" : "text-slate-400"}`}>({typeCount[t]})</span>
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-slate-200 hidden sm:block" />

      {(clientSearch || clientTypeFilter !== "all") && (
        <button onClick={() => { setClientSearch(""); setClientTypeFilter("all"); }}
          className="text-xs text-slate-400 hover:text-rose-500 font-medium transition-colors flex items-center gap-1">
          ✕ Réinitialiser
        </button>
      )}

      <div className="ml-auto flex items-center">
        <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
          <button onClick={() => setClientView("grid")} title="Vue grille"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${clientView === "grid" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <rect x="1" y="1" width="6" height="6" rx="1.5" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" />
              <rect x="9" y="9" width="6" height="6" rx="1.5" />
            </svg>
          </button>
          <button onClick={() => setClientView("list")} title="Vue liste"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${clientView === "list" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
              <line x1="3" y1="4" x2="13" y2="4" />
              <line x1="3" y1="8" x2="13" y2="8" />
              <line x1="3" y1="12" x2="13" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};