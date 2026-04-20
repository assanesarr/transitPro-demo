import React from 'react';
import { STATUTS_DOSSIER } from '../../constants/statuts';

export const StatutBadge = ({ statut }) => {
  const s = STATUTS_DOSSIER[statut] || STATUTS_DOSSIER.nouveau;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.bg} ${s.color} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};