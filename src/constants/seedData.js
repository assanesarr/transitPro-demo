export const CLIENTS_INIT = [
  { id: 1, nom: "Groupe Teranga SARL", contact: "Ousmane Diop", tel: "+221 77 456 7890", email: "o.diop@teranga.sn", ville: "Dakar", type: "Entreprise", ninea: "00123456-2T1" },
  { id: 2, nom: "Import Export Sénégal", contact: "Aminata Fall", tel: "+221 76 234 5678", email: "a.fall@ies.sn", ville: "Dakar", type: "Entreprise", ninea: "00234567-2T2" },
  { id: 3, nom: "Société Mbaye & Frères", contact: "Ibrahima Mbaye", tel: "+221 70 345 6789", email: "i.mbaye@mbaye.sn", ville: "Thiès", type: "PME", ninea: "00345678-2T1" },
  { id: 4, nom: "Mouride Trading Co.", contact: "Serigne Diallo", tel: "+221 77 567 8901", email: "s.diallo@mtr.sn", ville: "Touba", type: "PME", ninea: "00456789-2T3" },
  { id: 5, nom: "Atlantic Fish SA", contact: "Fatou Ndiaye", tel: "+221 76 678 9012", email: "f.ndiaye@atlantic.sn", ville: "Saint-Louis", type: "Entreprise", ninea: "00567890-2T2" },
];

export const DOSSIERS_INIT = [
  { id: "DOS-2026-001", clientId: 1, type: "Dédouanement import", description: "Conteneur 40HC électroniques — Chine", statut: "en_cours", dateOuverture: "2026-03-10", dateEcheance: "2026-04-15", montantTotal: 1850000, paiements: [], prestations: [{ label: "Dédouanement", montant: 900000 }, { label: "Transit port", montant: 450000 }, { label: "Transport Dakar", montant: 300000 }, { label: "Frais divers", montant: 200000 }], priorite: "haute", responsable: "Moussa Diaw", port: "Port Dakar", bl: "BL-SH-2026-4521", decaissements: [] },
  { id: "DOS-2026-002", clientId: 2, type: "Transit maritime", description: "Marchandises alimentaires — France", statut: "attente_doc", dateOuverture: "2026-03-15", dateEcheance: "2026-04-10", montantTotal: 1200000, paiements: [], prestations: [{ label: "Dédouanement", montant: 600000 }, { label: "Transit", montant: 350000 }, { label: "Entreposage", montant: 250000 }], priorite: "normale", responsable: "Awa Sarr", port: "Port Dakar", bl: "BL-FR-2026-1892", decaissements: [] },
  // ... autres dossiers
];