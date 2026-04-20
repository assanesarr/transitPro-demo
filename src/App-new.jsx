import React, {useState} from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ConfigProvider } from './contexts/ConfigContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DossiersPage } from './pages/DossiersPage';
import { ClientsPage } from './pages/ClientsPage';
import { SalairesPage } from './pages/SalairesPage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { Sidebar } from './components/layout/Sidebar';

import { useDossiers } from './hooks/useDossiers';
import { useClients } from './hooks/useClients';


const AppContent = () => {
  const { user, isAdmin } = useAuth();
  const { clients = [] } = useClients();
  const { dossiers = [] } = useDossiers(clients);
  const [vue, setVue] = useState("dashboard");

  if (!user) return <LoginPage />;

  const safeDossiers = Array.isArray(dossiers) ? dossiers : [];
  const safeClients = Array.isArray(clients) ? clients : [];

  const renderContent = () => {
    switch (vue) {
      case "dashboard":
        return (
          <DashboardPage
            dossiers={safeDossiers}
            clients={safeClients}
            onNouveauDossier={() => setVue("dossiers")}
          />
        );
      case "dossiers":
        return <DossiersPage />;
      case "clients":
        return <ClientsPage />;
      default:
        return (
          <DashboardPage
            dossiers={safeDossiers}
            clients={safeClients}
            onNouveauDossier={() => setVue("dossiers")}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={vue} onViewChange={setVue} isAdmin={isAdmin} user={user} />
      <main className="flex-1 ml-56 p-6">
        {renderContent()}
      </main>
    </div>
  );
};

const AccessDenied = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center text-4xl mb-5">🔒</div>
    <h2 className="text-2xl font-black mb-2">Accès refusé</h2>
    <p className="text-slate-400">Cette section est réservée aux administrateurs.</p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ConfigProvider>
    </AuthProvider>
  );
}