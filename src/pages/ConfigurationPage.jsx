import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useConfigContext } from '../contexts/ConfigContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { EntrepriseTab } from '../components/configuration/EntrepriseTab';
import { PreferencesTab } from '../components/configuration/PreferencesTab';
import { PermissionsTab } from '../components/configuration/PermissionsTab';
import { CategoriesDecaissementManager } from '../components/configuration/CategoriesDecaissementManager';

export const ConfigurationPage = () => {
  const { config, updateConfig } = useConfigContext();
  const { darkMode, showSolde, setShowSolde, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const [configTab, setConfigTab] = useState("entreprise");
  const [configSaved, setConfigSaved] = useState(false);

  const saveConfig = () => {
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  const tabs = [
    { key: "entreprise", icon: "🏢", label: "Entreprise" },
    { key: "preferences", icon: "🎛️", label: "Préférences" },
    { key: "categories", icon: "📋", label: "Catégories" },
    { key: "permissions", icon: "🔑", label: "Permissions" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Configuration</h1>
          <p className="text-slate-400 text-sm">Paramètres de l'application TransitPro</p>
        </div>
        <button onClick={saveConfig} className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-5 py-2 rounded-xl flex items-center gap-2">
          {configSaved ? "✓ Sauvegardé !" : "💾 Sauvegarder"}
        </button>
      </div>

      <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setConfigTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              configTab === t.key ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {configTab === "entreprise" && <EntrepriseTab config={config} updateConfig={updateConfig} />}
      {configTab === "preferences" && <PreferencesTab config={config} updateConfig={updateConfig} darkMode={darkMode} toggleDarkMode={toggleDarkMode} showSolde={showSolde} setShowSolde={setShowSolde} />}
      {configTab === "categories" && <CategoriesDecaissementManager config={config} updateConfig={updateConfig} />}
      {configTab === "permissions" && <PermissionsTab config={config} updateConfig={updateConfig} />}
    </div>
  );
};