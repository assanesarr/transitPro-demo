import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

export const Sidebar = ({ currentView, onViewChange, isAdmin }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const navItems = [
    { key: "dashboard", icon: "⊞", label: "Tableau de bord", adminOnly: false },
    { key: "dossiers", icon: "📁", label: "Dossiers", adminOnly: false },
    { key: "clients", icon: "👥", label: "Clients", adminOnly: false },
    { key: "salaires", icon: "💼", label: "Salaires", adminOnly: true },
    { key: "configuration", icon: "⚙️", label: "Configuration", adminOnly: true },
  ].filter(n => !n.adminOnly || isAdmin);

  return (
    <aside className={`w-56 h-screen flex flex-col fixed top-0 left-0 z-30 overflow-y-auto transition-colors duration-300 ${darkMode ? "bg-black border-r border-slate-800" : "bg-slate-900"}`}>
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-slate-900 font-black text-sm">T</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">TransitPro</p>
            <p className="text-slate-500 text-xs">Gestionnaire clients</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="mb-2 px-1">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${isAdmin ? "bg-amber-400/20 text-amber-300" : "bg-slate-700 text-slate-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-amber-400" : "bg-slate-500"}`} />
            {user?.role}
          </span>
        </div>

        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => onViewChange(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              currentView === item.key || (currentView === "dossier_detail" && item.key === "dossiers")
                ? "bg-amber-400 text-slate-900 font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isAdmin ? "bg-amber-400 text-slate-900" : "bg-slate-700 text-slate-300"}`}>
              {user?.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.prenom}</p>
              <p className="text-slate-500 text-xs truncate">{user?.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleDarkMode} className="text-slate-500 hover:text-amber-400 transition-colors text-sm">
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={logout} className="text-slate-500 hover:text-amber-400 transition-colors text-xs">⏻</button>
          </div>
        </div>
      </div>
    </aside>
  );
};