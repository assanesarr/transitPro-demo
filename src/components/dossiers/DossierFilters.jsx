import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { STATUTS_DOSSIER } from '../../constants/statuts';

export const DossierFilters = ({
  filtreStatut, setFiltreStatut,
  filtreClient, setFiltreClient,
  filtrePrio, setFiltrePrio,
  recherche, setRecherche,
  clients,
  dossierView, setDossierView,
  resultCount
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap gap-2 items-center">
      <Input 
        placeholder="Rechercher…" 
        className="w-40 h-8 text-xs rounded-xl" 
        value={recherche} 
        onChange={e => setRecherche(e.target.value)} 
      />
      
      <Select value={filtreStatut} onValueChange={setFiltreStatut}>
        <SelectTrigger className="w-36 h-8 text-xs rounded-xl">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous statuts</SelectItem>
          {Object.entries(STATUTS_DOSSIER).map(([k, v]) => (
            <SelectItem key={k} value={k}>{v.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={filtreClient} onValueChange={setFiltreClient}>
        <SelectTrigger className="w-40 h-8 text-xs rounded-xl">
          <SelectValue placeholder="Client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous clients</SelectItem>
          {clients.map(c => (
            <SelectItem key={c.id} value={String(c.id)}>{c.nom}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={filtrePrio} onValueChange={setFiltrePrio}>
        <SelectTrigger className="w-28 h-8 text-xs rounded-xl">
          <SelectValue placeholder="Priorité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes</SelectItem>
          {["urgente", "haute", "normale"].map(p => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <span className="text-xs text-slate-400">{resultCount} résultats</span>
      
      <div className="ml-auto flex items-center">
        <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
          <button onClick={() => setDossierView("grid")} title="Vue grille"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dossierView === "grid" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <rect x="1" y="1" width="6" height="6" rx="1.5" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" />
              <rect x="9" y="9" width="6" height="6" rx="1.5" />
            </svg>
          </button>
          <button onClick={() => setDossierView("list")} title="Vue liste"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dossierView === "list" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
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