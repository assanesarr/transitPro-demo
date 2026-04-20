import { useState, useMemo } from 'react';
import { CLIENTS_INIT } from '../constants/seedData';

export const useClients = () => {
  const [clients, setClients] = useState(CLIENTS_INIT);
  const [clientSearch, setClientSearch] = useState("");
  const [clientTypeFilter, setClientTypeFilter] = useState("all");

   const filteredClients = useMemo(() => {
    const safeClients = Array.isArray(clients) ? clients : [];
    const q = clientSearch.toLowerCase();
    
    return safeClients.filter(c => {
      const matchQ = !q || `${c.nom || ''} ${c.contact || ''} ${c.ville || ''} ${c.ninea || ''}`.toLowerCase().includes(q);
      const matchT = clientTypeFilter === "all" || c.type === clientTypeFilter;
      return matchQ && matchT;
    });
  }, [clients, clientSearch, clientTypeFilter]);

  const ajouterClient = (client) => {
    const newId = Math.max(...clients.map(c => c.id)) + 1;
    setClients(prev => [...prev, { ...client, id: newId }]);
  };

  const modifierClient = (id, updates) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const supprimerClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  return {
    clients: Array.isArray(clients) ? clients : [],
    filteredClients,
    clientSearch, setClientSearch,
    clientTypeFilter, setClientTypeFilter,
    ajouterClient,
    modifierClient,
    supprimerClient,
  };
};