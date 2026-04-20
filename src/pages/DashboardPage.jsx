// pages/DashboardPage.jsx
import React from 'react';
import { KPICards } from '../components/dashboard/KPICards';
import { ChartsSection } from '../components/dashboard/ChartsSection';
import { UrgentDossiers } from '../components/dashboard/UrgentDossiers';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { useStats } from '../hooks/useStats';

export const DashboardPage = ({ dossiers, clients, onNouveauDossier }) => {
  const { user, isAdmin } = useAuth();
  const { darkMode, showSolde, setShowSolde, toggleDarkMode } = useTheme();
  const stats = useStats(dossiers); // Récupération des stats

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            Tableau de bord
          </h1>
          <p className="text-slate-400 text-sm">Activité transitaire — {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <button onClick={() => setShowSolde(!showSolde)}
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                showSolde ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
              }`}
              title={showSolde ? "Masquer les soldes" : "Afficher les soldes"}>
              {showSolde ? "👁 Masquer soldes" : "🙈 Afficher soldes"}
            </button>
          )}
          
          <button onClick={toggleDarkMode}
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
              darkMode ? "bg-amber-400 text-slate-900 border-amber-400" : "bg-white text-slate-600 border-slate-200"
            }`}>
            {darkMode ? "☀️ Mode clair" : "🌙 Mode sombre"}
          </button>
          
          <button onClick={onNouveauDossier}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
            + Nouveau dossier
          </button>
        </div>
      </div>

      <KPICards stats={stats} isAdmin={isAdmin} showSolde={showSolde} />
      <ChartsSection dossiers={dossiers} clients={clients} />
      <UrgentDossiers dossiers={dossiers} clients={clients} onDossierClick={() => {}} />
    </div>
  );
};