// constants/types.js
export const TYPES_PRESTATION = [
  "Dédouanement import", "Dédouanement export", "Transit routier",
  "Transit maritime", "Transit aérien", "Entreposage", "Groupage",
  "Conseil douanier", "Fret international", "Assurance marchandise",
];

export const MODES_PAIEMENT = ["Virement bancaire", "Chèque", "Espèces", "Mobile Money", "Traite"];

export const ROLES_LIST = ["Administrateur", "Transitaire", "Agent douanier", "Comptable", "Commercial", "Directeur", "Stagiaire"];

export const CATEGORIES_DECAISSEMENT = [
  { key: "Debarquement", label: "Débarquement", icon: "⚓", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { key: "Droit-Douanes", label: "Droit de Douanes", icon: "🏛", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  { key: "B.A.E", label: "B.A.E", icon: "📄", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { key: "Enlevement", label: "Enlèvement", icon: "🚛", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
  { key: "Magasinage", label: "Magasinage", icon: "🏭", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  { key: "Surestarie", label: "Surestarie", icon: "⏱", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
  { key: "Amende", label: "Amende", icon: "⚠️", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { key: "Liquidation", label: "Liquidation", icon: "📊", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
  { key: "Douanes Thies", label: "Douanes Thiès", icon: "🏢", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { key: "Douane Diourbel", label: "Douane Diourbel", icon: "🏢", color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
  { key: "Douane Mbour", label: "Douane Mbour", icon: "🏢", color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-200" },
  { key: "Douane Kedougou", label: "Douane Kédougou", icon: "🏢", color: "text-lime-600", bg: "bg-lime-50", border: "border-lime-200" },
];

// Export par défaut pour les imports plus simples
const types = {
  TYPES_PRESTATION,
  MODES_PAIEMENT,
  ROLES_LIST,
  CATEGORIES_DECAISSEMENT,
};

export default types;