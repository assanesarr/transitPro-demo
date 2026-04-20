import { useState, useMemo } from 'react';
import { DOSSIERS_INIT } from '../constants/seedData';
import { totalPaye, resteApayer } from '../utils/formatters';

export const useDossiers = (clients) => {
  const [dossiers, setDossiers] = useState(DOSSIERS_INIT || []);
  const [filtreStatut, setFiltreStatut] = useState("all");
  const [filtreClient, setFiltreClient] = useState("all");
  const [filtrePrio, setFiltrePrio] = useState("all");
  const [recherche, setRecherche] = useState("");

  const dossiersFiltres = useMemo(() => {
    const safeDossiers = Array.isArray(dossiers) ? dossiers : [];
    const safeClients = Array.isArray(clients) ? clients : [];
    const q = recherche.toLowerCase();

    return safeDossiers.filter(d => {
      const client = safeClients.find(c => c.id === d.clientId);
      return (
        (filtreStatut === "all" || d.statut === filtreStatut) &&
        (filtreClient === "all" || String(d.clientId) === filtreClient) &&
        (filtrePrio === "all" || d.priorite === filtrePrio) &&
        (!q || d.id?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q) || client?.nom?.toLowerCase().includes(q))
      );
    });
  }, [dossiers, clients, filtreStatut, filtreClient, filtrePrio, recherche]);

  const ajouterDossier = (nouveauDossier) => {
    setDossiers(prev => [nouveauDossier, ...prev]);
  };

  const mettreAJourDossier = (id, updates) => {
    setDossiers(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const supprimerDossier = (id) => {
    setDossiers(prev => prev.filter(d => d.id !== id));
  };

  const ajouterPaiement = (dossierId, paiement) => {
    setDossiers(prev => prev.map(d => {
      if (d.id !== dossierId) return d;
      const nouveauxPaiements = [...d.paiements, paiement];
      const nouveauReste = d.montantTotal - nouveauxPaiements.reduce((s, p) => s + p.montant, 0);
      return { ...d, paiements: nouveauxPaiements, statut: nouveauReste <= 0 ? "cloture" : d.statut };
    }));
  };

  const ajouterDecaissement = (dossierId, decaissement) => {
    setDossiers(prev => prev.map(d => {
      if (d.id !== dossierId) return d;
      return { ...d, decaissements: [...(d.decaissements || []), decaissement] };
    }));
  };

  return {
    dossiers: Array.isArray(dossiers) ? dossiers : [],
    dossiersFiltres,
    filtreStatut, setFiltreStatut,
    filtreClient, setFiltreClient,
    filtrePrio, setFiltrePrio,
    recherche, setRecherche,
    ajouterDossier,
    mettreAJourDossier,
    supprimerDossier,
    ajouterPaiement,
    ajouterDecaissement,
  };
};