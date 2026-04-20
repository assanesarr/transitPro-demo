export const fmt = (n) => Number(n).toLocaleString("fr-FR") + " FCFA";
export const fmtM = (n) => (n >= 1000000 ? (n / 1000000).toFixed(2) + " M" : (n / 1000).toFixed(0) + "k") + " FCFA";
export const initials = (s) => s.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
export const today = () => new Date().toISOString().split("T")[0];

export const totalPaye = (dossier) => dossier.paiements.reduce((s, p) => s + p.montant, 0);
export const resteApayer = (dossier) => dossier.montantTotal - totalPaye(dossier);
export const tauxPaiement = (dossier) => dossier.montantTotal ? Math.round((totalPaye(dossier) / dossier.montantTotal) * 100) : 0;
export const totalDecaisse = (dossier) => (dossier.decaissements || []).reduce((s, x) => s + x.montant, 0);
export const soldeDecaisse = (dossier) => totalPaye(dossier) - totalDecaisse(dossier);