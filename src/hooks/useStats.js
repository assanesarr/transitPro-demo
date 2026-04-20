// hooks/useStats.js
import { useMemo } from 'react';
import { totalPaye, totalDecaisse } from '../utils/formatters';

export const useStats = (dossiers) => {
  const stats = useMemo(() => {
    // Vérification que dossiers existe et est un tableau
    if (!dossiers || !Array.isArray(dossiers) || dossiers.length === 0) {
      return {
        total: 0,
        paye: 0,
        reste: 0,
        totalDecaiss: 0,
        soldeNet: 0,
        enCours: 0,
        urgents: 0,
        aTraiter: 0
      };
    }

    const total = dossiers.reduce((s, d) => s + (d.montantTotal || 0), 0);
    const paye = dossiers.reduce((s, d) => s + totalPaye(d), 0);
    const reste = total - paye;
    const totalDecaiss = dossiers.reduce((s, d) => s + totalDecaisse(d), 0);
    const soldeNet = paye - totalDecaiss;
    const enCours = dossiers.filter(d => !["cloture", "annule"].includes(d.statut)).length;
    const urgents = dossiers.filter(d => d.priorite === "urgente" && !["cloture", "annule"].includes(d.statut)).length;
    const aTraiter = dossiers.filter(d => ["nouveau", "attente_doc"].includes(d.statut)).length;
    
    return { total, paye, reste, totalDecaiss, soldeNet, enCours, urgents, aTraiter };
  }, [dossiers]);

  return stats;
};

export default useStats;