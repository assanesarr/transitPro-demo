import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ALL_PERMISSIONS = [
  { key: "dossier.read", label: "Lire les dossiers", cat: "Dossiers", icon: "📋" },
  { key: "dossier.write", label: "Créer / modifier dossiers", cat: "Dossiers", icon: "✏️" },
  { key: "dossier.delete", label: "Supprimer des dossiers", cat: "Dossiers", icon: "🗑" },
  { key: "client.read", label: "Lire les clients", cat: "Clients", icon: "📋" },
  { key: "client.write", label: "Créer / modifier clients", cat: "Clients", icon: "✏️" },
  { key: "client.delete", label: "Supprimer des clients", cat: "Clients", icon: "🗑" },
  { key: "paiement.read", label: "Voir les encaissements", cat: "Paiements", icon: "👁" },
  { key: "paiement.write", label: "Saisir des encaissements", cat: "Paiements", icon: "✏️" },
  { key: "decaissement.read", label: "Voir les décaissements", cat: "Décaissements", icon: "👁" },
  { key: "decaissement.write", label: "Saisir des décaissements", cat: "Décaissements", icon: "✏️" },
  { key: "solde.view", label: "Voir les soldes", cat: "Finance", icon: "💰" },
  { key: "config.read", label: "Accès configuration", cat: "Admin", icon: "⚙️" },
  { key: "personnel.manage", label: "Gérer le personnel", cat: "Admin", icon: "👥" },
];

const ROLES = ["Administrateur", "Transitaire", "Agent douanier", "Comptable", "Commercial", "Directeur", "Stagiaire"];
const CATEGORIES = [...new Set(ALL_PERMISSIONS.map(p => p.cat))];

export const PermissionsTab = ({ config, updateConfig }) => {
  const [selectedRole, setSelectedRole] = useState("Transitaire");

  const hasPerm = (role, perm) => {
    if (role === "Administrateur") return true;
    return (config.rolePermissions[role] || []).includes(perm);
  };

  const togglePerm = (role, perm) => {
    if (role === "Administrateur") return;
    const current = config.rolePermissions[role] || [];
    const updated = current.includes(perm) ? current.filter(p => p !== perm) : [...current, perm];
    updateConfig("rolePermissions", role, updated);
  };

  const countPerms = (role) => {
    if (role === "Administrateur") return ALL_PERMISSIONS.length;
    return (config.rolePermissions[role] || []).length;
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Rôles */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rôles</p>
          <div className="space-y-1.5">
            {ROLES.map(role => (
              <button key={role} onClick={() => setSelectedRole(role)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                  selectedRole === role ? "bg-slate-900 border-slate-900 shadow-sm" : "bg-white border-slate-200 hover:border-slate-400"
                }`}>
                <span className={`text-sm ${selectedRole === role ? "text-white" : "text-slate-700"} font-medium`}>{role}</span>
                <span className={`text-xs font-bold ${selectedRole === role ? "text-amber-400" : "text-slate-400"}`}>
                  {countPerms(role)}/{ALL_PERMISSIONS.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions matrix */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Permissions — <span className="text-amber-600">{selectedRole}</span></h3>
          </div>

          {CATEGORIES.map(cat => {
            const catPerms = ALL_PERMISSIONS.filter(p => p.cat === cat);
            return (
              <Card key={cat} className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">{cat}</p>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {catPerms.map(perm => {
                      const granted = hasPerm(selectedRole, perm.key);
                      const isAdm = selectedRole === "Administrateur";
                      return (
                        <div key={perm.key} onClick={() => !isAdm && togglePerm(selectedRole, perm.key)}
                          className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            granted ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"
                          } ${isAdm ? "opacity-80 cursor-default" : "hover:shadow-sm"}`}>
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{perm.icon}</span>
                            <span className={`text-xs font-semibold ${granted ? "text-emerald-800" : "text-slate-600"}`}>{perm.label}</span>
                          </div>
                          <div className={`w-10 h-5 rounded-full relative transition-all ${granted ? "bg-emerald-500" : "bg-slate-300"}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${granted ? "left-5" : "left-0.5"}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};