import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

/* ═══════════════════════════════════════
   CONSTANTS & SEED DATA
═══════════════════════════════════════ */
const STATUTS_DOSSIER = {
  nouveau: { label: "Nouveau", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" },
  en_cours: { label: "En cours", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  attente_doc: { label: "Attente docs", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", dot: "bg-violet-500" },
  douane: { label: "En douane", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500" },
  livraison: { label: "En livraison", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", dot: "bg-teal-500" },
  cloture: { label: "Clôturé", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  annule: { label: "Annulé", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500" },
};

const TYPES_PRESTATION = [
  "Dédouanement import", "Dédouanement export", "Transit routier",
  "Transit maritime", "Transit aérien", "Entreposage", "Groupage",
  "Conseil douanier", "Fret international", "Assurance marchandise",
];

const MODES_PAIEMENT = ["Virement bancaire", "Chèque", "Espèces", "Mobile Money", "Traite"];

const CATEGORIES_DECAISSEMENT = [
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

const AVATAR_BG = [
  "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700", "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700", "bg-indigo-100 text-indigo-700",
];

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#f97316", "#06b6d4", "#10b981", "#ec4899"];

/* ─── Clients ─── */
const CLIENTS_INIT = [
  { id: 1, nom: "Groupe Teranga SARL", contact: "Ousmane Diop", tel: "+221 77 456 7890", email: "o.diop@teranga.sn", ville: "Dakar", type: "Entreprise", ninea: "00123456-2T1" },
  { id: 2, nom: "Import Export Sénégal", contact: "Aminata Fall", tel: "+221 76 234 5678", email: "a.fall@ies.sn", ville: "Dakar", type: "Entreprise", ninea: "00234567-2T2" },
  { id: 3, nom: "Société Mbaye & Frères", contact: "Ibrahima Mbaye", tel: "+221 70 345 6789", email: "i.mbaye@mbaye.sn", ville: "Thiès", type: "PME", ninea: "00345678-2T1" },
  { id: 4, nom: "Mouride Trading Co.", contact: "Serigne Diallo", tel: "+221 77 567 8901", email: "s.diallo@mtr.sn", ville: "Touba", type: "PME", ninea: "00456789-2T3" },
  { id: 5, nom: "Atlantic Fish SA", contact: "Fatou Ndiaye", tel: "+221 76 678 9012", email: "f.ndiaye@atlantic.sn", ville: "Saint-Louis", type: "Entreprise", ninea: "00567890-2T2" },
  { id: 6, nom: "BTP Sénégal SUARL", contact: "Mamadou Sow", tel: "+221 70 789 0123", email: "m.sow@btpsen.sn", ville: "Dakar", type: "Entreprise", ninea: "00678901-2T1" },
  { id: 7, nom: "AgroSen Distribution", contact: "Rokhaya Dieng", tel: "+221 77 890 1234", email: "r.dieng@agrosen.sn", ville: "Kaolack", type: "PME", ninea: "00789012-2T2" },
  { id: 8, nom: "SONACOS Partenaires", contact: "Cheikh Ba", tel: "+221 76 901 2345", email: "c.ba@sonacos.sn", ville: "Ziguinchor", type: "Entreprise", ninea: "00890123-2T3" },
];

/* ─── Dossiers ─── */
const DOSSIERS_INIT = [
  { id: "DOS-2026-001", clientId: 1, type: "Dédouanement import", description: "Conteneur 40HC électroniques — Chine", statut: "en_cours", dateOuverture: "2026-03-10", dateEcheance: "2026-04-15", montantTotal: 1850000, paiements: [], prestations: [{ label: "Dédouanement", montant: 900000 }, { label: "Transit port", montant: 450000 }, { label: "Transport Dakar", montant: 300000 }, { label: "Frais divers", montant: 200000 }], priorite: "haute", responsable: "Moussa Diaw", port: "Port Dakar", bl: "BL-SH-2026-4521", decaissements: [{ id: "D1", categorie: "Debarquement", montant: 320000, date: "2026-03-12", ref: "DEB-001", mode: "Virement bancaire", note: "Terminal Dakar" }, { id: "D2", categorie: "Droit-Douanes", montant: 450000, date: "2026-03-18", ref: "DD-2026-441", mode: "Virement bancaire", note: "" }, { id: "D3", categorie: "B.A.E", montant: 85000, date: "2026-03-19", ref: "BAE-2026-012", mode: "Chèque", note: "" }] },
  { id: "DOS-2026-002", clientId: 2, type: "Transit maritime", description: "Marchandises alimentaires — France", statut: "attente_doc", dateOuverture: "2026-03-15", dateEcheance: "2026-04-10", montantTotal: 1200000, paiements: [], prestations: [{ label: "Dédouanement", montant: 600000 }, { label: "Transit", montant: 350000 }, { label: "Entreposage", montant: 250000 }], priorite: "normale", responsable: "Awa Sarr", port: "Port Dakar", bl: "BL-FR-2026-1892", decaissements: [{ id: "D4", categorie: "Droit-Douanes", montant: 280000, date: "2026-03-17", ref: "DD-2026-442", mode: "Virement bancaire", note: "" }] },
  { id: "DOS-2026-003", clientId: 3, type: "Transit routier", description: "Marchandises — Mali via Bamako", statut: "douane", dateOuverture: "2026-03-20", dateEcheance: "2026-04-20", montantTotal: 780000, paiements: [], prestations: [{ label: "Transit routier", montant: 500000 }, { label: "Assurance", montant: 180000 }, { label: "Frais douane", montant: 100000 }], priorite: "haute", responsable: "Moussa Diaw", port: "Frontière Kidira", bl: "LTA-ML-2026-023", decaissements: [{ id: "D5", categorie: "Enlevement", montant: 150000, date: "2026-03-22", ref: "ENL-2026-031", mode: "Espèces", note: "" }, { id: "D6", categorie: "Surestarie", montant: 75000, date: "2026-03-25", ref: "SUR-2026-009", mode: "Espèces", note: "3 jours" }] },
  { id: "DOS-2026-004", clientId: 5, type: "Dédouanement export", description: "Poissons congelés — Europe", statut: "livraison", dateOuverture: "2026-03-05", dateEcheance: "2026-04-05", montantTotal: 2100000, paiements: [{ id: "P1", date: "2026-03-20", montant: 1050000, mode: "Virement bancaire", ref: "VIR-2026-041" }], prestations: [{ label: "Dédouanement export", montant: 1000000 }, { label: "Fret maritime", montant: 700000 }, { label: "Assurance", montant: 250000 }, { label: "Manutention", montant: 150000 }], priorite: "normale", responsable: "Awa Sarr", port: "Port Dakar", bl: "BL-EU-2026-7731", decaissements: [{ id: "D7", categorie: "Droit-Douanes", montant: 520000, date: "2026-03-07", ref: "DD-2026-389", mode: "Virement bancaire", note: "" }, { id: "D8", categorie: "Liquidation", montant: 95000, date: "2026-03-08", ref: "LIQ-2026-021", mode: "Chèque", note: "" }] },
  { id: "DOS-2026-005", clientId: 6, type: "Dédouanement import", description: "Matériaux BTP — Turquie", statut: "nouveau", dateOuverture: "2026-04-01", dateEcheance: "2026-05-01", montantTotal: 3200000, paiements: [], prestations: [{ label: "Dédouanement", montant: 1500000 }, { label: "Transport", montant: 800000 }, { label: "Entreposage", montant: 500000 }, { label: "Assurance", montant: 400000 }], priorite: "haute", responsable: "Ibou Faye", port: "Port Dakar", bl: "BL-TR-2026-0091", decaissements: [] },
  { id: "DOS-2026-006", clientId: 4, type: "Groupage", description: "Diverses marchandises — Chine", statut: "en_cours", dateOuverture: "2026-03-25", dateEcheance: "2026-04-25", montantTotal: 950000, paiements: [{ id: "P2", date: "2026-04-01", montant: 475000, mode: "Chèque", ref: "CHQ-2026-188" }], prestations: [{ label: "Groupage", montant: 600000 }, { label: "Dédouanement", montant: 250000 }, { label: "Transport", montant: 100000 }], priorite: "normale", responsable: "Ibou Faye", port: "Port Dakar", bl: "BL-CN-2026-3302", decaissements: [{ id: "D9", categorie: "Debarquement", montant: 180000, date: "2026-03-27", ref: "DEB-002", mode: "Virement bancaire", note: "" }] },
  { id: "DOS-2026-007", clientId: 7, type: "Transit aérien", description: "Produits agricoles urgents — Brésil", statut: "en_cours", dateOuverture: "2026-04-02", dateEcheance: "2026-04-12", montantTotal: 1600000, paiements: [{ id: "P3", date: "2026-04-03", montant: 1600000, mode: "Virement bancaire", ref: "VIR-2026-055" }], prestations: [{ label: "Fret aérien", montant: 900000 }, { label: "Dédouanement", montant: 500000 }, { label: "Transport", montant: 200000 }], priorite: "urgente", responsable: "Moussa Diaw", port: "Aéroport AIBD", bl: "AWB-2026-5541", decaissements: [{ id: "D10", categorie: "B.A.E", montant: 120000, date: "2026-04-03", ref: "BAE-2026-013", mode: "Mobile Money", note: "" }, { id: "D11", categorie: "Droit-Douanes", montant: 390000, date: "2026-04-04", ref: "DD-2026-501", mode: "Virement bancaire", note: "" }] },
  { id: "DOS-2026-008", clientId: 8, type: "Conseil douanier", description: "Audit procédures — Cashew export", statut: "cloture", dateOuverture: "2026-02-10", dateEcheance: "2026-03-10", montantTotal: 450000, paiements: [{ id: "P4", date: "2026-03-08", montant: 450000, mode: "Mobile Money", ref: "MM-2026-0211" }], prestations: [{ label: "Conseil", montant: 350000 }, { label: "Rapport", montant: 100000 }], priorite: "normale", responsable: "Awa Sarr", port: "—", bl: "—", decaissements: [] },
  { id: "DOS-2026-009", clientId: 1, type: "Entreposage", description: "Stockage conteneur 20ft — 3 mois", statut: "en_cours", dateOuverture: "2026-03-01", dateEcheance: "2026-06-01", montantTotal: 600000, paiements: [{ id: "P5", date: "2026-03-01", montant: 200000, mode: "Espèces", ref: "CASH-2026-012" }], prestations: [{ label: "Entreposage m1", montant: 200000 }, { label: "Entreposage m2", montant: 200000 }, { label: "Entreposage m3", montant: 200000 }], priorite: "normale", responsable: "Ibou Faye", port: "Entrepôt Zone Franche", bl: "—", decaissements: [{ id: "D12", categorie: "Magasinage", montant: 200000, date: "2026-03-01", ref: "MAG-2026-001", mode: "Chèque", note: "Mois 1" }, { id: "D13", categorie: "Magasinage", montant: 200000, date: "2026-04-01", ref: "MAG-2026-002", mode: "Chèque", note: "Mois 2" }] },
];

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
const fmt = n => Number(n).toLocaleString("fr-FR") + " FCFA";
const fmtM = n => (n >= 1000000 ? (n / 1000000).toFixed(2) + " M" : (n / 1000).toFixed(0) + "k") + " FCFA";
const initials = s => s.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const today = new Date().toISOString().split("T")[0];

const totalPaye = d => d.paiements.reduce((s, p) => s + p.montant, 0);
const resteApayer = d => d.montantTotal - totalPaye(d);
const tauxPaiement = d => d.montantTotal ? Math.round((totalPaye(d) / d.montantTotal) * 100) : 0;
const totalDecaisse = d => (d.decaissements || []).reduce((s, x) => s + x.montant, 0);
const soldeDecaisse = d => totalPaye(d) - totalDecaisse(d);
const getCatDecaiss = key => CATEGORIES_DECAISSEMENT.find(c => c.key === key) || { label: key, icon: "💸", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };

function StatutBadge({ statut }) {
  const s = STATUTS_DOSSIER[statut] || STATUTS_DOSSIER.nouveau;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.bg} ${s.color} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function PriorityBadge({ priorite }) {
  const cfg = {
    urgente: "bg-rose-100 text-rose-700 border-rose-200",
    haute: "bg-orange-100 text-orange-700 border-orange-200",
    normale: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg[priorite] || cfg.normale}`}>{priorite}</span>;
}

function AvatarCircle({ name, idx, size = "w-9 h-9", text = "text-sm" }) {
  const c = AVATAR_BG[idx % AVATAR_BG.length];
  return <div className={`${size} ${c} rounded-xl flex items-center justify-center font-bold ${text} shrink-0`}>{initials(name)}</div>;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color || p.fill }} className="flex justify-between gap-3">
          <span>{p.name}</span><span className="font-semibold">{p.value?.toLocaleString("fr-FR")}</span>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════
   PRINT SERVICE
═══════════════════════════════════════ */
function printHTML(html, title = "Impression") {
  const win = window.open("", "_blank", "width=900,height=700");
  win.document.write(`<!DOCTYPE html><html lang="fr"><head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Sora',sans-serif;font-size:11px;color:#1e293b;background:#fff;padding:20px;}
      h1{font-size:20px;font-weight:700;margin-bottom:4px;}
      h2{font-size:14px;font-weight:600;margin:18px 0 8px;color:#334155;}
      .meta{font-size:10px;color:#64748b;margin-bottom:16px;}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid #0f172a;}
      .logo-box{display:flex;align-items:center;gap:10px;}
      .logo{width:36px;height:36px;background:#f59e0b;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#0f172a;}
      .company-name{font-size:16px;font-weight:700;}
      .company-sub{font-size:9px;color:#64748b;margin-top:2px;}
      .print-date{font-size:10px;color:#94a3b8;text-align:right;}
      table{width:100%;border-collapse:collapse;margin-bottom:14px;}
      th{background:#0f172a;color:#fff;padding:6px 8px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;}
      td{padding:5px 8px;border-bottom:1px solid #e2e8f0;vertical-align:middle;}
      tr:nth-child(even) td{background:#f8fafc;}
      .badge{display:inline-block;padding:1px 7px;border-radius:9999px;font-size:9px;font-weight:600;}
      .badge-blue{background:#dbeafe;color:#1d4ed8;}
      .badge-green{background:#dcfce7;color:#15803d;}
      .badge-amber{background:#fef3c7;color:#b45309;}
      .badge-rose{background:#ffe4e6;color:#be123c;}
      .badge-violet{background:#ede9fe;color:#7c3aed;}
      .badge-teal{background:#ccfbf1;color:#0f766e;}
      .badge-orange{background:#ffedd5;color:#c2410c;}
      .badge-gray{background:#f1f5f9;color:#475569;}
      .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;}
      .kpi{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;}
      .kpi-label{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px;}
      .kpi-value{font-size:15px;font-weight:700;}
      .kpi-green{color:#15803d;} .kpi-red{color:#be123c;} .kpi-blue{color:#1d4ed8;} .kpi-amber{color:#b45309;}
      .section-card{border:1px solid #e2e8f0;border-radius:8px;margin-bottom:14px;overflow:hidden;}
      .section-card-header{background:#f1f5f9;padding:7px 12px;font-size:11px;font-weight:600;color:#334155;border-bottom:1px solid #e2e8f0;}
      .bar-wrap{display:flex;align-items:center;gap:8px;margin:4px 0;}
      .bar-track{flex:1;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;}
      .bar-fill{height:6px;border-radius:3px;}
      .footer{margin-top:20px;padding-top:10px;border-top:1px solid #e2e8f0;font-size:9px;color:#94a3b8;display:flex;justify-content:space-between;}
      .text-right{text-align:right;} .text-center{text-align:center;}
      .nowrap{white-space:nowrap;}
      .green{color:#15803d;font-weight:600;} .red{color:#be123c;font-weight:600;} .blue{color:#1d4ed8;font-weight:600;}
      @media print{body{padding:0;} @page{margin:1.2cm;size:A4;}}
    </style>
  </head><body>${html}</body></html>`);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 400);
}

function buildPageHeader(entreprise, title, subtitle) {
  const now = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  return `
    <div class="header">
      <div class="logo-box">
        <div class="logo">T</div>
        <div>
          <div class="company-name">${entreprise.nom}</div>
          <div class="company-sub">${entreprise.adresse} · ${entreprise.ville} · NINEA: ${entreprise.ninea}</div>
        </div>
      </div>
      <div class="print-date"><strong>${title}</strong><br/>${subtitle}<br/>Imprimé le ${now}</div>
    </div>
  `;
}

function printTableClients(clients, dossiers, entreprise) {
  const rows = clients.map((c, i) => {
    const dos = dossiers.filter(d => d.clientId === c.id);
    const total = dos.reduce((s, d) => s + d.montantTotal, 0);
    const paye = dos.reduce((s, d) => d.paiements.reduce((ss, p) => ss + p.montant, 0) + s, 0);
    const reste = total - paye;
    const actifs = dos.filter(d => !["cloture", "annule"].includes(d.statut)).length;
    const badgeCls = c.type === "Entreprise" ? "badge-blue" : c.type === "PME" ? "badge-amber" : "badge-gray";
    return `<tr>
      <td>${i + 1}</td>
      <td><strong>${c.nom}</strong><br/><span style="color:#64748b;font-size:9px;">${c.contact}</span></td>
      <td><span class="badge ${badgeCls}">${c.type}</span></td>
      <td>${c.ville || "—"}</td>
      <td class="nowrap">${c.tel || "—"}</td>
      <td style="font-family:monospace;font-size:9px;">${c.ninea || "—"}</td>
      <td class="text-center">${dos.length}</td>
      <td class="text-center">${actifs}</td>
      <td class="text-right">${total > 0 ? total.toLocaleString("fr-FR") + " FCFA" : "—"}</td>
      <td class="text-right ${reste > 0 ? "red" : "green"}">${reste > 0 ? reste.toLocaleString("fr-FR") + " FCFA" : "Soldé"}</td>
    </tr>`;
  }).join("");

  const totalGlobal = clients.reduce((s, c) => s + dossiers.filter(d => d.clientId === c.id).reduce((ss, d) => ss + d.montantTotal, 0), 0);
  const payeGlobal = clients.reduce((s, c) => s + dossiers.filter(d => d.clientId === c.id).reduce((ss, d) => d.paiements.reduce((sss, p) => sss + p.montant, 0) + ss, 0), 0);

  const html = `
    ${buildPageHeader(entreprise, "Liste des Clients", clients.length + " clients enregistrés")}
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Total clients</div><div class="kpi-value kpi-blue">${clients.length}</div></div>
      <div class="kpi"><div class="kpi-label">Dossiers total</div><div class="kpi-value">${dossiers.length}</div></div>
      <div class="kpi"><div class="kpi-label">Facturation totale</div><div class="kpi-value kpi-blue">${(totalGlobal / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Reste à percevoir</div><div class="kpi-value kpi-red">${((totalGlobal - payeGlobal) / 1000000).toFixed(2)} M FCFA</div></div>
    </div>
    <table>
      <thead><tr>
        <th>#</th><th>Client / Contact</th><th>Type</th><th>Ville</th><th>Téléphone</th>
        <th>NINEA</th><th>Dossiers</th><th>Actifs</th><th class="text-right">Facturé</th><th class="text-right">Reste</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="footer"><span>© ${entreprise.nom} — Document confidentiel</span><span>Page 1/1</span></div>
  `;
  printHTML(html, "Liste des Clients — " + entreprise.nom);
}

function printTableDossiers(dossiers, clients, entreprise, statuts) {
  const rows = dossiers.map((d, i) => {
    const client = clients.find(c => c.id === d.clientId);
    const paye = d.paiements.reduce((s, p) => s + p.montant, 0);
    const reste = d.montantTotal - paye;
    const decaiss = (d.decaissements || []).reduce((s, x) => s + x.montant, 0);
    const solde = paye - decaiss;
    const st = statuts[d.statut];
    const stClsMap = { nouveau: "badge-blue", en_cours: "badge-amber", attente_doc: "badge-violet", douane: "badge-orange", livraison: "badge-teal", cloture: "badge-green", annule: "badge-rose" };
    const prioMap = { urgente: "badge-rose", haute: "badge-orange", normale: "badge-gray" };
    return `<tr>
      <td style="font-family:monospace;font-size:9px;">${d.id}</td>
      <td>${client?.nom || "—"}<br/><span style="color:#64748b;font-size:9px;">${d.type}</span></td>
      <td style="font-size:9px;max-width:120px;overflow:hidden;">${d.description}</td>
      <td><span class="badge ${stClsMap[d.statut] || "badge-gray"}">${st?.label || d.statut}</span></td>
      <td><span class="badge ${prioMap[d.priorite] || "badge-gray"}">${d.priorite}</span></td>
      <td class="text-right">${d.montantTotal.toLocaleString("fr-FR")}</td>
      <td class="text-right green">${paye.toLocaleString("fr-FR")}</td>
      <td class="text-right red">${decaiss.toLocaleString("fr-FR")}</td>
      <td class="text-right ${solde >= 0 ? "green" : "red"}">${solde >= 0 ? "+" : ""}${solde.toLocaleString("fr-FR")}</td>
      <td class="nowrap">${d.dateEcheance || "—"}</td>
    </tr>`;
  }).join("");

  const totFact = dossiers.reduce((s, d) => s + d.montantTotal, 0);
  const totPaye = dossiers.reduce((s, d) => s + d.paiements.reduce((ss, p) => ss + p.montant, 0), 0);
  const totDecaiss = dossiers.reduce((s, d) => s + (d.decaissements || []).reduce((ss, x) => ss + x.montant, 0), 0);
  const totSolde = totPaye - totDecaiss;

  const html = `
    ${buildPageHeader(entreprise, "Liste des Dossiers", dossiers.length + " dossier(s)")}
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Total facturé</div><div class="kpi-value">${(totFact / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Encaissé</div><div class="kpi-value kpi-green">${(totPaye / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Décaissé</div><div class="kpi-value kpi-red">${(totDecaiss / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Solde net</div><div class="kpi-value ${totSolde >= 0 ? "kpi-blue" : "kpi-red"}">${totSolde >= 0 ? "+" : ""}${(totSolde / 1000000).toFixed(2)} M FCFA</div></div>
    </div>
    <table>
      <thead><tr>
        <th>N° Dossier</th><th>Client / Type</th><th>Description</th><th>Statut</th><th>Priorité</th>
        <th class="text-right">Facturé</th><th class="text-right">Encaissé</th><th class="text-right">Décaissé</th><th class="text-right">Solde net</th><th>Échéance</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tr style="background:#0f172a;color:#fff;font-weight:700;">
        <td colspan="5">TOTAUX</td>
        <td class="text-right">${totFact.toLocaleString("fr-FR")}</td>
        <td class="text-right">${totPaye.toLocaleString("fr-FR")}</td>
        <td class="text-right">${totDecaiss.toLocaleString("fr-FR")}</td>
        <td class="text-right">${totSolde >= 0 ? "+" : ""}${totSolde.toLocaleString("fr-FR")}</td>
        <td></td>
      </tr>
    </table>
    <div class="footer"><span>© ${entreprise.nom} — Document confidentiel</span><span>Page 1/1</span></div>
  `;
  printHTML(html, "Liste des Dossiers — " + entreprise.nom);
}

function printRapportAnnuel(dossiers, clients, entreprise, statuts) {
  const annee = new Date().getFullYear();
  const totFact = dossiers.reduce((s, d) => s + d.montantTotal, 0);
  const totPaye = dossiers.reduce((s, d) => s + d.paiements.reduce((ss, p) => ss + p.montant, 0), 0);
  const totDecaiss = dossiers.reduce((s, d) => s + (d.decaissements || []).reduce((ss, x) => ss + x.montant, 0), 0);
  const soldeNet = totPaye - totDecaiss;
  const reste = totFact - totPaye;
  const clotures = dossiers.filter(d => d.statut === "cloture").length;
  const actifs = dossiers.filter(d => !["cloture", "annule"].includes(d.statut)).length;

  // By status
  const statRows = Object.entries(statuts).map(([k, v]) => {
    const count = dossiers.filter(d => d.statut === k).length;
    const mt = dossiers.filter(d => d.statut === k).reduce((s, d) => s + d.montantTotal, 0);
    if (!count) return "";
    const stClsMap = { nouveau: "badge-blue", en_cours: "badge-amber", attente_doc: "badge-violet", douane: "badge-orange", livraison: "badge-teal", cloture: "badge-green", annule: "badge-rose" };
    const pct = dossiers.length ? Math.round(count / dossiers.length * 100) : 0;
    return `<tr>
      <td><span class="badge ${stClsMap[k] || "badge-gray"}">${v.label}</span></td>
      <td class="text-center">${count}</td>
      <td class="text-center">${pct}%</td>
      <td class="text-right">${mt.toLocaleString("fr-FR")} FCFA</td>
      <td>
        <div class="bar-wrap"><div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:#f59e0b;"></div></div><span>${pct}%</span></div>
      </td>
    </tr>`;
  }).join("");

  // Top clients
  const topClients = clients.map(c => {
    const dos = dossiers.filter(d => d.clientId === c.id);
    const total = dos.reduce((s, d) => s + d.montantTotal, 0);
    const paye = dos.reduce((s, d) => s + d.paiements.reduce((ss, p) => ss + p.montant, 0), 0);
    return { nom: c.nom, ville: c.ville || "—", total, paye, count: dos.length };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total).slice(0, 8);

  const topRows = topClients.map((c, i) => {
    const pct = totFact ? Math.round(c.total / totFact * 100) : 0;
    return `<tr>
      <td>${i + 1}</td>
      <td><strong>${c.nom}</strong></td>
      <td class="text-center">${c.count}</td>
      <td class="text-right">${c.total.toLocaleString("fr-FR")} FCFA</td>
      <td class="text-right green">${c.paye.toLocaleString("fr-FR")} FCFA</td>
      <td class="text-right red">${(c.total - c.paye).toLocaleString("fr-FR")} FCFA</td>
      <td>${pct}% du CA</td>
    </tr>`;
  }).join("");

  // Decaissement by category
  const catTotals = {};
  dossiers.forEach(d => (d.decaissements || []).forEach(x => { catTotals[x.categorie] = (catTotals[x.categorie] || 0) + x.montant; }));
  const catRows = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).map(([k, v]) => {
    const pct = totDecaiss ? Math.round(v / totDecaiss * 100) : 0;
    return `<tr><td>${k}</td><td class="text-right">${v.toLocaleString("fr-FR")} FCFA</td>
      <td><div class="bar-wrap"><div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:#ef4444;"></div></div>${pct}%</div></td></tr>`;
  }).join("") || "<tr><td colspan='3' style='color:#94a3b8;text-align:center'>Aucun décaissement</td></tr>";

  const html = `
    ${buildPageHeader(entreprise, "Rapport Annuel " + annee, "Synthèse complète de l'activité transitaire")}

    <h2>📊 Indicateurs clés de performance</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Chiffre d'affaires</div><div class="kpi-value kpi-blue">${(totFact / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Encaissements</div><div class="kpi-value kpi-green">${(totPaye / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Décaissements</div><div class="kpi-value kpi-red">${(totDecaiss / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Solde net</div><div class="kpi-value ${soldeNet >= 0 ? "kpi-blue" : "kpi-red"}">${soldeNet >= 0 ? "+" : ""}${(soldeNet / 1000000).toFixed(2)} M FCFA</div></div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Reste à percevoir</div><div class="kpi-value kpi-amber">${(reste / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Total dossiers</div><div class="kpi-value">${dossiers.length}</div></div>
      <div class="kpi"><div class="kpi-label">Dossiers actifs</div><div class="kpi-value kpi-blue">${actifs}</div></div>
      <div class="kpi"><div class="kpi-label">Dossiers clôturés</div><div class="kpi-value kpi-green">${clotures}</div></div>
    </div>

    <h2>📁 Répartition par statut des dossiers</h2>
    <table>
      <thead><tr><th>Statut</th><th class="text-center">Nb</th><th class="text-center">%</th><th class="text-right">Montant</th><th>Répartition</th></tr></thead>
      <tbody>${statRows}</tbody>
    </table>

    <h2>🏆 Top clients par chiffre d'affaires</h2>
    <table>
      <thead><tr><th>#</th><th>Client</th><th class="text-center">Dossiers</th><th class="text-right">Facturé</th><th class="text-right">Encaissé</th><th class="text-right">Reste</th><th>Part CA</th></tr></thead>
      <tbody>${topRows}</tbody>
    </table>

    <h2>💸 Répartition des décaissements par catégorie</h2>
    <table>
      <thead><tr><th>Catégorie</th><th class="text-right">Montant</th><th>Proportion</th></tr></thead>
      <tbody>${catRows}</tbody>
      ${totDecaiss > 0 ? "<tr style='font-weight:700;background:#fef2f2;'><td>TOTAL</td><td class='text-right'>" + totDecaiss.toLocaleString("fr-FR") + " FCFA</td><td></td></tr>" : ""}
    </table>

    <h2>📋 Synthèse financière</h2>
    <table>
      <tbody>
        <tr><td><strong>Chiffre d'affaires (facturé)</strong></td><td class="text-right">${totFact.toLocaleString("fr-FR")} FCFA</td></tr>
        <tr><td>Encaissements reçus</td><td class="text-right green">${totPaye.toLocaleString("fr-FR")} FCFA</td></tr>
        <tr><td>Reste à encaisser</td><td class="text-right red">${reste.toLocaleString("fr-FR")} FCFA</td></tr>
        <tr><td>Total décaissements</td><td class="text-right red">(${totDecaiss.toLocaleString("fr-FR")} FCFA)</td></tr>
        <tr style="background:#f8fafc;font-weight:700;border-top:2px solid #0f172a;">
          <td><strong>Solde net (Enc. − Déc.)</strong></td>
          <td class="text-right ${soldeNet >= 0 ? "green" : "red"}">${soldeNet >= 0 ? "+" : ""}${soldeNet.toLocaleString("fr-FR")} FCFA</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <span>© ${annee} ${entreprise.nom} · NINEA: ${entreprise.ninea} · RC: ${entreprise.rc || "—"} · Agrément DGD: ${entreprise.agrement || "—"}</span>
      <span>Rapport généré le ${new Date().toLocaleDateString("fr-FR")} — Document confidentiel</span>
    </div>
  `;
  printHTML(html, "Rapport Annuel " + annee + " — " + entreprise.nom);
}

/* ═══════════════════════════════════════
   PRINT FACTURE PROFORMAT / ENCAISSEMENT / RECU DECAISSEMENT
═══════════════════════════════════════ */
function printFactureProformat(dossier, client, entreprise) {
  const now = new Date().toLocaleDateString("fr-FR");
  const num = "PRO-" + dossier.id;
  const rows = dossier.prestations.map((p, i) => `<tr>
    <td>${i + 1}</td><td>${p.label}</td><td>1</td><td>Forfait</td>
    <td style="text-align:right;font-family:monospace;">${p.montant.toLocaleString("fr-FR")}</td>
    <td style="text-align:right;font-family:monospace;font-weight:700;">${p.montant.toLocaleString("fr-FR")}</td>
  </tr>`).join("");
  const tva = Math.round(dossier.montantTotal * 0.18);
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Facture Proformat ${num}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Sora',sans-serif;font-size:11px;color:#1e293b;}
    .page{max-width:760px;margin:0 auto;padding:28px;}
    .top-bar{height:5px;background:linear-gradient(90deg,#0f172a 60%,#f59e0b);margin-bottom:0;}
    .head{display:flex;justify-content:space-between;align-items:flex-start;background:#0f172a;padding:22px 28px;}
    .logo{width:42px;height:42px;background:#f59e0b;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#0f172a;margin-right:12px;}
    .co{color:white;}.co-name{font-size:17px;font-weight:700;}.co-sub{font-size:9px;color:#94a3b8;margin-top:3px;}
    .doc-tag{background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.3);border-radius:10px;padding:12px 18px;text-align:right;}
    .doc-type{font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;margin-bottom:4px;}
    .doc-num{font-size:20px;font-weight:800;color:white;font-family:monospace;}
    .doc-date{font-size:9px;color:#64748b;margin-top:3px;}
    .parties{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px 28px;background:#f8fafc;border-bottom:1px solid #e2e8f0;}
    .party-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:6px;}
    .party-name{font-size:13px;font-weight:700;color:#0f172a;}.party-info{font-size:10px;color:#475569;margin-top:3px;line-height:1.5;}
    .objet{padding:10px 28px;background:#fef3c7;border-bottom:1px solid #fde68a;font-size:11px;}
    .objet strong{color:#92400e;}
    .body{padding:18px 28px;}
    table{width:100%;border-collapse:collapse;margin-bottom:14px;}
    th{background:#0f172a;color:white;padding:7px 10px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;}
    td{padding:6px 10px;border-bottom:1px solid #e2e8f0;font-size:11px;}
    tr:nth-child(even) td{background:#f8fafc;}
    .totals{display:flex;justify-content:flex-end;margin-bottom:16px;}
    .totals-box{width:280px;}
    .tot-row{display:flex;justify-content:space-between;padding:5px 10px;font-size:11px;}
    .tot-row.grand{background:#0f172a;color:white;font-weight:700;border-radius:8px;margin-top:6px;font-size:13px;}
    .conditions{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;font-size:10px;color:#475569;margin-bottom:14px;}
    .conditions h4{font-size:10px;font-weight:700;color:#334155;margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em;}
    .stamp{display:inline-block;border:2px solid #f59e0b;color:#92400e;padding:6px 14px;border-radius:6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;}
    .footer{display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid #e2e8f0;font-size:9px;color:#94a3b8;}
    @media print{@page{margin:1cm;size:A4;}body{font-size:10px;}}
  </style></head><body><div class="page">
  <div class="top-bar"></div>
  <div class="head" style="display:flex;align-items:center;">
    <div style="display:flex;align-items:center;flex:1;">
      <div class="logo">T</div>
      <div class="co"><div class="co-name">${entreprise.nom}</div>
        <div class="co-sub">${entreprise.adresse} · ${entreprise.ville}</div>
        <div class="co-sub">NINEA: ${entreprise.ninea} · Agr. DGD: ${entreprise.agrement || "—"}</div>
      </div>
    </div>
    <div class="doc-tag">
      <div class="doc-type">Facture Proformat</div>
      <div class="doc-num">${num}</div>
      <div class="doc-date">Émise le ${now}</div>
    </div>
  </div>
  <div class="parties">
    <div><div class="party-label">Émetteur</div><div class="party-name">${entreprise.nom}</div>
      <div class="party-info">${entreprise.adresse}<br/>${entreprise.ville}<br/>Tél: ${entreprise.tel || "—"} · ${entreprise.email || "—"}</div>
    </div>
    <div><div class="party-label">Facturé à</div><div class="party-name">${client?.nom || "—"}</div>
      <div class="party-info">${client?.contact || ""}<br/>${client?.adresse || ""} ${client?.ville || ""}<br/>NINEA: ${client?.ninea || "—"}</div>
    </div>
  </div>
  <div class="objet"><strong>Objet :</strong> ${dossier.description} · B/L: ${dossier.bl || "—"} · Port: ${dossier.port || "—"}</div>
  <div class="body">
    <table>
      <thead><tr><th>#</th><th>Désignation de la prestation</th><th>Qté</th><th>Unité</th><th style="text-align:right">PU HT (FCFA)</th><th style="text-align:right">Total HT (FCFA)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals"><div class="totals-box">
      <div class="tot-row"><span>Sous-total HT</span><span style="font-family:monospace;">${dossier.montantTotal.toLocaleString("fr-FR")}</span></div>
      <div class="tot-row"><span>TVA (18%)</span><span style="font-family:monospace;">${tva.toLocaleString("fr-FR")}</span></div>
      <div class="tot-row grand"><span>TOTAL TTC</span><span style="font-family:monospace;">${(dossier.montantTotal + tva).toLocaleString("fr-FR")} FCFA</span></div>
    </div></div>
    <div class="conditions">
      <h4>Conditions de règlement</h4>
      Paiement à 30 jours date de facture. Mode de règlement : virement bancaire.<br/>
      <strong>Validité de la proforma :</strong> 30 jours à compter de la date d'émission.<br/>
      Ce document est une facture proforma et ne constitue pas un titre de créance.
    </div>
    <div style="margin-bottom:16px;"><span class="stamp">Document Proforma — Non fiscal</span></div>
    <div class="footer"><span>© ${entreprise.nom} · NINEA: ${entreprise.ninea}</span><span>${num} · ${now}</span></div>
  </div></div></body></html>`;
  const w = window.open("", "_blank", "width=820,height=700"); w.document.write(html); w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 400);
}

function printFactureEncaissement(dossier, client, paiement, entreprise) {
  const now = new Date().toLocaleDateString("fr-FR");
  const numFac = "FAC-" + dossier.id + "-" + (paiement?.id || "ALL");
  const totPaye = dossier.paiements.reduce((s, p) => s + p.montant, 0);
  const reste = dossier.montantTotal - totPaye;
  const rows = dossier.paiements.map((p, i) => `<tr>
    <td>${i + 1}</td><td style="font-family:monospace;font-size:9px;">${p.date}</td>
    <td style="font-family:monospace;font-size:9px;">${p.ref}</td>
    <td>${p.mode}</td>
    <td style="text-align:right;font-family:monospace;font-weight:700;color:#15803d;">${p.montant.toLocaleString("fr-FR")}</td>
    <td style="font-size:9px;color:#64748b;">${p.note || "—"}</td>
  </tr>`).join("");
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Facture Encaissement ${numFac}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Sora',sans-serif;font-size:11px;color:#1e293b;}
    .page{max-width:760px;margin:0 auto;padding:28px;}
    .top-bar{height:5px;background:linear-gradient(90deg,#059669 60%,#f59e0b);}
    .head{display:flex;justify-content:space-between;align-items:center;background:#064e3b;padding:22px 28px;}
    .logo{width:40px;height:40px;background:#f59e0b;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#0f172a;margin-right:12px;flex-shrink:0;}
    .co-name{font-size:16px;font-weight:700;color:white;}.co-sub{font-size:9px;color:#6ee7b7;margin-top:2px;}
    .doc-tag{background:rgba(16,185,129,.2);border:1px solid rgba(16,185,129,.4);border-radius:10px;padding:12px 18px;text-align:right;}
    .doc-type{font-size:9px;color:#6ee7b7;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;}
    .doc-num{font-size:18px;font-weight:800;color:white;font-family:monospace;}
    .parties{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:14px 28px;background:#f0fdf4;border-bottom:1px solid #bbf7d0;}
    .party-label{font-size:9px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;}
    .party-name{font-size:13px;font-weight:700;}.party-info{font-size:10px;color:#475569;margin-top:2px;line-height:1.5;}
    .ref-row{padding:10px 28px;background:#dcfce7;border-bottom:1px solid #bbf7d0;font-size:11px;display:flex;gap:20px;}
    .body{padding:18px 28px;}
    .summary-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;}
    .scard{border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;}
    .scard-label{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px;}
    .scard-val{font-size:14px;font-weight:800;font-family:monospace;}
    table{width:100%;border-collapse:collapse;margin-bottom:14px;}
    th{background:#064e3b;color:white;padding:6px 10px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;}
    td{padding:6px 10px;border-bottom:1px solid #d1fae5;}
    tr:nth-child(even) td{background:#f0fdf4;}
    .solde-box{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-radius:10px;margin-bottom:14px;}
    .solde-ok{background:#064e3b;color:white;}.solde-due{background:#fef2f2;border:1px solid #fecaca;}
    .footer{display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid #bbf7d0;font-size:9px;color:#94a3b8;}
    @media print{@page{margin:1cm;size:A4;}}
  </style></head><body><div class="page">
  <div class="top-bar"></div>
  <div class="head" style="display:flex;align-items:center;">
    <div style="display:flex;align-items:center;flex:1;">
      <div class="logo">T</div>
      <div><div class="co-name">${entreprise.nom}</div><div class="co-sub">${entreprise.adresse} · ${entreprise.ville}</div></div>
    </div>
    <div class="doc-tag"><div class="doc-type">Facture d'Encaissement</div><div class="doc-num">${numFac}</div><div style="font-size:9px;color:#6ee7b7;margin-top:3px;">Émise le ${now}</div></div>
  </div>
  <div class="parties">
    <div><div class="party-label">Prestataire</div><div class="party-name">${entreprise.nom}</div><div class="party-info">NINEA: ${entreprise.ninea}</div></div>
    <div><div class="party-label">Client</div><div class="party-name">${client?.nom || "—"}</div><div class="party-info">${client?.contact || ""} · NINEA: ${client?.ninea || "—"}</div></div>
  </div>
  <div class="ref-row">
    <span><strong>Dossier :</strong> ${dossier.id}</span>
    <span><strong>Objet :</strong> ${dossier.description}</span>
    <span><strong>B/L :</strong> ${dossier.bl || "—"}</span>
  </div>
  <div class="body">
    <div class="summary-cards">
      <div class="scard"><div class="scard-label">Montant facturé</div><div class="scard-val">${dossier.montantTotal.toLocaleString("fr-FR")}</div></div>
      <div class="scard"><div class="scard-label">Total encaissé</div><div class="scard-val" style="color:#15803d;">${totPaye.toLocaleString("fr-FR")}</div></div>
      <div class="scard"><div class="scard-label">Reste à percevoir</div><div class="scard-val" style="color:${reste > 0 ? "#be123c" : "#15803d"};">${reste > 0 ? reste.toLocaleString("fr-FR") + " FCFA" : "Soldé"}</div></div>
    </div>
    <h3 style="font-size:10px;font-weight:700;text-transform:uppercase;color:#16a34a;letter-spacing:.06em;margin-bottom:8px;">Historique des encaissements</h3>
    <table>
      <thead><tr><th>#</th><th>Date</th><th>Référence</th><th>Mode</th><th style="text-align:right">Montant (FCFA)</th><th>Note</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="solde-box ${reste <= 0 ? "solde-ok" : "solde-due"}">
      <div><div style="font-size:9px;${reste <= 0 ? "color:#6ee7b7" : "color:#94a3b8"};text-transform:uppercase;letter-spacing:.06em;">${reste <= 0 ? "Dossier soldé" : "Solde restant dû"}</div>
        <div style="font-size:20px;font-weight:800;font-family:monospace;${reste <= 0 ? "color:white" : "color:#be123c"};">${reste <= 0 ? "Paiement complet ✓" : reste.toLocaleString("fr-FR") + " FCFA"}</div>
      </div>
      ${reste <= 0 ? `<div style="font-size:10px;color:#6ee7b7;">Merci pour votre règlement</div>` : `<div style="font-size:10px;color:#94a3b8;">Échéance: ${dossier.dateEcheance || "—"}</div>`}
    </div>
    <div class="footer"><span>© ${entreprise.nom} · NINEA: ${entreprise.ninea}</span><span>${numFac} · ${now}</span></div>
  </div></div></body></html>`;
  const w = window.open("", "_blank", "width=820,height=700"); w.document.write(html); w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 400);
}

function printRecuDecaissement(charge, entreprise) {
  const now = new Date().toLocaleDateString("fr-FR");
  const num = "REC-" + charge.ref;
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Reçu ${num}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Sora',sans-serif;font-size:11px;color:#1e293b;}
    .page{max-width:500px;margin:0 auto;padding:24px;}
    .top-bar{height:4px;background:linear-gradient(90deg,#be123c,#f97316);margin-bottom:0;}
    .head{background:#be123c;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;}
    .logo{width:36px;height:36px;background:#f59e0b;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#0f172a;margin-right:10px;flex-shrink:0;}
    .co-name{font-size:14px;font-weight:700;color:white;}.co-sub{font-size:9px;color:#fecaca;margin-top:2px;}
    .doc-tag{text-align:right;}
    .doc-type{font-size:9px;color:#fecaca;text-transform:uppercase;letter-spacing:.1em;}
    .doc-num{font-size:16px;font-weight:800;color:white;font-family:monospace;}
    .body{padding:20px 22px;}
    .amount-box{background:#fef2f2;border:2px solid #fecaca;border-radius:12px;padding:16px 20px;text-align:center;margin-bottom:16px;}
    .amount-label{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
    .amount-val{font-size:28px;font-weight:900;color:#be123c;font-family:monospace;}
    .amount-fcfa{font-size:14px;font-weight:500;color:#94a3b8;}
    .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:16px;}
    .detail-cell{padding:8px 12px;border-bottom:1px solid #e2e8f0;border-right:1px solid #e2e8f0;}
    .detail-cell:nth-child(even){border-right:none;}
    .detail-cell:nth-last-child(-n+2){border-bottom:none;}
    .dl{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;}
    .dv{font-size:11px;font-weight:600;color:#334155;}
    .cat-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:10px;font-weight:700;}
    .desc-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:11px;color:#475569;}
    .stamp-row{display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid #e2e8f0;}
    .paid-stamp{border:2px solid #15803d;color:#15803d;padding:4px 12px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;transform:rotate(-2deg);display:inline-block;}
    .footer{font-size:9px;color:#94a3b8;text-align:center;margin-top:10px;}
    @media print{@page{margin:1cm;size:A5 portrait;}}
  </style></head><body><div class="page">
  <div class="top-bar"></div>
  <div class="head" style="display:flex;align-items:center;">
    <div style="display:flex;align-items:center;flex:1;"><div class="logo">T</div>
      <div><div class="co-name">${entreprise.nom}</div><div class="co-sub">${entreprise.adresse}</div></div>
    </div>
    <div class="doc-tag"><div class="doc-type">Reçu de Décaissement</div><div class="doc-num">${num}</div></div>
  </div>
  <div class="body">
    <div class="amount-box">
      <div class="amount-label">Montant décaissé</div>
      <div class="amount-val">${charge.montant.toLocaleString("fr-FR")} <span class="amount-fcfa">FCFA</span></div>
    </div>
    <div class="detail-grid">
      <div class="detail-cell"><div class="dl">Référence</div><div class="dv" style="font-family:monospace;">${charge.ref}</div></div>
      <div class="detail-cell"><div class="dl">Date</div><div class="dv">${charge.date}</div></div>
      <div class="detail-cell"><div class="dl">Catégorie</div><div class="dv">${charge.categorie}</div></div>
      <div class="detail-cell"><div class="dl">Mode de paiement</div><div class="dv">${charge.mode}</div></div>
      <div class="detail-cell"><div class="dl">Bénéficiaire</div><div class="dv">${charge.beneficiaire || "—"}</div></div>
      <div class="detail-cell"><div class="dl">Statut</div><div class="dv" style="color:#15803d;font-weight:700;">✓ ${charge.statut || "Payé"}</div></div>
    </div>
    <div class="desc-box"><strong>Description :</strong> ${charge.description || "—"}</div>
    <div class="stamp-row">
      <div class="paid-stamp">✓ Payé</div>
      <div style="text-align:right;font-size:9px;color:#94a3b8;">Imprimé le ${now}<br/>Par: ${entreprise.nom}</div>
    </div>
  </div>
  <div class="footer">© ${entreprise.nom} · NINEA: ${entreprise.ninea} · ${num}</div>
  </div></body></html>`;
  const w = window.open("", "_blank", "width=600,height=600"); w.document.write(html); w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 400);
}

function printRecapChargesBureau(charges, moisIdx, annee, moisLabels, entreprise) {
  const moisLabel = moisLabels[moisIdx];
  const duMois = charges.filter(c => c.mois === moisIdx && c.annee === annee);
  const total = duMois.reduce((s, c) => s + c.montant, 0);
  const now = new Date().toLocaleDateString("fr-FR");
  const cats = {};
  duMois.forEach(c => { cats[c.categorie] = (cats[c.categorie] || 0) + c.montant; });
  const rows = duMois.map((c, i) => `<tr>
    <td style="font-family:monospace;font-size:9px;">${c.ref}</td>
    <td>${c.categorie}</td>
    <td>${c.description || "—"}</td>
    <td>${c.beneficiaire || "—"}</td>
    <td>${c.mode}</td>
    <td style="font-family:monospace;font-size:9px;">${c.date}</td>
    <td style="text-align:right;font-family:monospace;font-weight:700;color:#be123c;">${c.montant.toLocaleString("fr-FR")}</td>
  </tr>`).join("");
  const catRows = Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([k, v]) => {
    const pct = total ? Math.round(v / total * 100) : 0;
    return `<tr><td>${k}</td><td style="text-align:right;font-family:monospace;">${v.toLocaleString("fr-FR")}</td><td>${pct}%</td></tr>`;
  }).join("");
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Charges Bureau ${moisLabel} ${annee}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Sora',sans-serif;font-size:11px;color:#1e293b;}
    .page{max-width:760px;margin:0 auto;padding:28px;}
    .top-bar{height:4px;background:linear-gradient(90deg,#be123c,#f97316);}
    .head{background:#0f172a;padding:20px 28px;display:flex;justify-content:space-between;align-items:center;}
    .logo{width:38px;height:38px;background:#f59e0b;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900;color:#0f172a;margin-right:11px;flex-shrink:0;}
    .co-name{font-size:15px;font-weight:700;color:white;}.co-sub{font-size:9px;color:#94a3b8;margin-top:2px;}
    .doc-tag{background:rgba(190,18,60,.2);border:1px solid rgba(190,18,60,.4);border-radius:9px;padding:10px 16px;text-align:right;}
    .doc-type{font-size:9px;color:#fca5a5;text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px;}
    .doc-period{font-size:17px;font-weight:800;color:white;}
    .kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px 28px;background:#f8fafc;border-bottom:1px solid #e2e8f0;}
    .kpi{background:white;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;}
    .kpi-label{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px;}
    .kpi-val{font-size:15px;font-weight:800;}
    .body{padding:18px 28px;}
    table{width:100%;border-collapse:collapse;margin-bottom:14px;}
    th{background:#0f172a;color:white;padding:6px 9px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;}
    td{padding:5px 9px;border-bottom:1px solid #e2e8f0;font-size:11px;}
    tr:nth-child(even) td{background:#fef2f2;}
    h3{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#64748b;margin-bottom:8px;}
    .footer{display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid #e2e8f0;font-size:9px;color:#94a3b8;}
    @media print{@page{margin:1cm;size:A4;}}
  </style></head><body><div class="page">
  <div class="top-bar"></div>
  <div class="head" style="display:flex;align-items:center;">
    <div style="display:flex;align-items:center;flex:1;"><div class="logo">T</div>
      <div><div class="co-name">${entreprise.nom}</div><div class="co-sub">${entreprise.adresse} · NINEA: ${entreprise.ninea}</div></div>
    </div>
    <div class="doc-tag"><div class="doc-type">Récapitulatif Charges Bureau</div><div class="doc-period">${moisLabel} ${annee}</div></div>
  </div>
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-label">Total décaissé</div><div class="kpi-val" style="color:#be123c;">${total.toLocaleString("fr-FR")} FCFA</div></div>
    <div class="kpi"><div class="kpi-label">Nb. opérations</div><div class="kpi-val">${duMois.length}</div></div>
    <div class="kpi"><div class="kpi-label">Catégories</div><div class="kpi-val">${Object.keys(cats).length}</div></div>
  </div>
  <div class="body">
    <h3>Répartition par catégorie</h3>
    <table style="max-width:320px;margin-bottom:18px;">
      <thead><tr><th>Catégorie</th><th style="text-align:right">Montant</th><th>Part</th></tr></thead>
      <tbody>${catRows}</tbody>
      <tr style="background:#0f172a;color:white;font-weight:700;"><td>TOTAL</td><td style="text-align:right;font-family:monospace;">${total.toLocaleString("fr-FR")}</td><td>100%</td></tr>
    </table>
    <h3>Détail des opérations</h3>
    <table>
      <thead><tr><th>Réf</th><th>Catégorie</th><th>Description</th><th>Bénéficiaire</th><th>Mode</th><th>Date</th><th style="text-align:right">Montant (FCFA)</th></tr></thead>
      <tbody>${rows}</tbody>
      <tr style="background:#0f172a;color:white;font-weight:700;"><td colspan="6">TOTAL ${moisLabel} ${annee}</td><td style="text-align:right;font-family:monospace;">${total.toLocaleString("fr-FR")}</td></tr>
    </table>
    <div class="footer"><span>© ${entreprise.nom} — Document confidentiel</span><span>Généré le ${now}</span></div>
  </div></div></body></html>`;
  const w = window.open("", "_blank", "width=820,height=700"); w.document.write(html); w.document.close(); setTimeout(() => { w.focus(); w.print(); }, 400);
}

/* ═══════════════════════════════════════
   BULLETIN SALAIRE PRINT
═══════════════════════════════════════ */
function printBulletinSalaire(emp, moisIdx, annee, calcResult, entreprise) {
  const moisLabels = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const moisLabel = moisLabels[moisIdx];
  const now = new Date().toLocaleDateString("fr-FR");
  const { brut, ipres, ir, net, patron, primes, deductions } = calcResult;
  const initials = (emp.prenom[0] || "") + (emp.nom[0] || "");

  const html = `
    <!DOCTYPE html><html lang="fr"><head>
    <meta charset="UTF-8">
    <title>Bulletin de salaire — ${emp.prenom} ${emp.nom} — ${moisLabel} ${annee}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Sora',sans-serif;font-size:11px;color:#1e293b;background:#fff;}
      .page{max-width:740px;margin:0 auto;padding:24px;}
      .header-bar{height:4px;background:linear-gradient(90deg,#0f172a,#475569,#f59e0b);margin-bottom:0;}
      .header{background:#0f172a;color:white;padding:20px 24px;display:flex;justify-content:space-between;align-items:flex-start;}
      .logo-area{display:flex;align-items:center;gap:12px;}
      .logo{width:40px;height:40px;background:#f59e0b;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#0f172a;}
      .co-name{font-size:16px;font-weight:700;line-height:1.2;}
      .co-sub{font-size:9px;color:#94a3b8;margin-top:3px;}
      .doc-box{background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:10px 16px;text-align:right;}
      .doc-title{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;}
      .doc-month{font-size:18px;font-weight:700;color:white;margin-top:2px;}
      .emp-row{background:#f8fafc;padding:14px 24px;display:flex;align-items:center;gap:16px;border-bottom:1px solid #e2e8f0;}
      .avatar{width:44px;height:44px;background:#dbeafe;color:#1d4ed8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;flex-shrink:0;}
      .emp-info{flex:1;}
      .emp-name{font-size:15px;font-weight:700;}
      .emp-sub{font-size:10px;color:#64748b;margin-top:2px;}
      .meta-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-bottom:1px solid #e2e8f0;}
      .meta-cell{padding:9px 20px;border-right:1px solid #e2e8f0;}
      .meta-cell:last-child{border-right:none;}
      .meta-label{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;}
      .meta-val{font-size:11px;font-weight:600;color:#334155;font-family:monospace;}
      .body{padding:16px 24px;}
      h3{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin-bottom:6px;}
      .section{background:#f8fafc;border-radius:10px;overflow:hidden;margin-bottom:10px;}
      .section-label{display:inline-flex;align-items:center;gap:6px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:4px 12px;border-radius:20px;margin-bottom:6px;}
      .sec-blue{background:#dbeafe;color:#1d4ed8;}
      .sec-red{background:#ffe4e6;color:#be123c;}
      table.items{width:100%;border-collapse:collapse;}
      table.items td{padding:6px 12px;border-bottom:1px solid #e2e8f0;font-size:11px;}
      table.items tr:last-child td{border-bottom:none;}
      table.items .label-col{color:#475569;}
      table.items .val-col{text-align:right;font-weight:600;font-family:monospace;}
      table.items .pos{color:#15803d;} table.items .neg{color:#be123c;}
      .total-row{display:flex;justify-content:space-between;align-items:center;background:#0f172a;color:white;padding:14px 20px;border-radius:10px;margin-bottom:12px;}
      .total-label{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;}
      .total-amount{font-size:26px;font-weight:800;font-family:monospace;}
      .total-sub{font-size:9px;color:#64748b;margin-top:3px;}
      .charges-row{background:#fff3cd;border:1px solid #fde68a;border-radius:8px;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
      .recap-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
      .recap-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;text-align:center;}
      .recap-card-label{font-size:9px;color:#94a3b8;margin-bottom:2px;}
      .recap-card-val{font-size:13px;font-weight:700;}
      .footer-bar{height:2px;background:linear-gradient(90deg,#0f172a,#475569,#f59e0b);}
      .footer{background:#0f172a;padding:10px 24px;display:flex;justify-content:space-between;align-items:center;}
      .footer-left{font-size:9px;color:#64748b;}
      .footer-right{font-size:9px;color:#475569;font-family:monospace;}
      .payment-date{font-size:11px;color:#94a3b8;margin-top:4px;}
      .text-right{text-align:right;}
      @media print{body{background:#fff;} @page{margin:.8cm;size:A4 portrait;}}
    </style></head><body>
    <div class="page">
      <div class="header-bar"></div>
      <div class="header">
        <div class="logo-area">
          <div class="logo">T</div>
          <div>
            <div class="co-name">${entreprise.nom}</div>
            <div class="co-sub">${entreprise.adresse} · ${entreprise.ville}</div>
            <div class="co-sub">NINEA: ${entreprise.ninea} · RC: ${entreprise.rc || "—"}</div>
          </div>
        </div>
        <div class="doc-box">
          <div class="doc-title">Bulletin de salaire</div>
          <div class="doc-month">${moisLabel} ${annee}</div>
          <div style="font-size:9px;color:#64748b;margin-top:4px;">Émis le ${now}</div>
        </div>
      </div>

      <div class="emp-row">
        <div class="avatar">${initials}</div>
        <div class="emp-info">
          <div class="emp-name">${emp.prenom} ${emp.nom}</div>
          <div class="emp-sub">${emp.poste} · ${emp.dept}</div>
        </div>
        <div style="text-align:right;">
          <div class="meta-label">Salaire de base</div>
          <div style="font-size:16px;font-weight:700;color:#0f172a;">${emp.salaire.toLocaleString("fr-FR")} FCFA</div>
        </div>
      </div>

      <div class="meta-grid">
        ${[["Matricule", emp.matricule || "—"], ["Date embauche", emp.dateEmbauche || "—"], ["N° CNSS", emp.cnss || "—"], ["RIB", emp.rib ? emp.rib.slice(-8) + "…" : "—"]].map(([l, v]) => `<div class="meta-cell"><div class="meta-label">${l}</div><div class="meta-val">${v}</div></div>`).join("")}
      </div>

      <div class="body">
        <!-- Rémunération -->
        <div><span class="section-label sec-blue">💰 Rémunération</span></div>
        <div class="section">
          <table class="items">
            <tr><td class="label-col">Salaire de base</td><td class="val-col">${emp.salaire.toLocaleString("fr-FR")} FCFA</td></tr>
            ${primes > 0 ? `<tr><td class="label-col">Primes & bonus</td><td class="val-col pos">+${primes.toLocaleString("fr-FR")} FCFA</td></tr>` : ""}
            ${deductions > 0 ? `<tr><td class="label-col">Déductions (absence / avance)</td><td class="val-col neg">−${deductions.toLocaleString("fr-FR")} FCFA</td></tr>` : ""}
            <tr style="background:#f1f5f9;font-weight:700;"><td class="label-col">Salaire brut</td><td class="val-col">${brut.toLocaleString("fr-FR")} FCFA</td></tr>
          </table>
        </div>

        <!-- Déductions -->
        <div><span class="section-label sec-red">📉 Déductions salariales</span></div>
        <div class="section">
          <table class="items">
            <tr><td class="label-col">IPRES salarié (6%)</td><td class="val-col neg">−${ipres.toLocaleString("fr-FR")} FCFA</td></tr>
            <tr><td class="label-col">Impôt sur le Revenu (IR 8%)</td><td class="val-col neg">−${ir.toLocaleString("fr-FR")} FCFA</td></tr>
            <tr style="background:#fff5f5;font-weight:700;"><td class="label-col">Total déductions</td><td class="val-col neg">−${(ipres + ir).toLocaleString("fr-FR")} FCFA</td></tr>
          </table>
        </div>

        <!-- Net à payer -->
        <div class="total-row">
          <div>
            <div class="total-label">Net à payer</div>
            <div class="total-amount">${net.toLocaleString("fr-FR")} FCFA</div>
            <div class="payment-date">Virement bancaire · ${emp.rib || "—"}</div>
          </div>
          <div style="text-align:right;">
            <div class="total-label">Date de paiement</div>
            <div style="font-size:14px;font-weight:700;color:white;margin-top:4px;">30 ${moisLabel} ${annee}</div>
          </div>
        </div>

        <!-- Charges patronales -->
        <div class="charges-row">
          <div>
            <div style="font-size:10px;font-weight:600;color:#92400e;">Charges patronales (22%)</div>
            <div style="font-size:9px;color:#78350f;">Cotisations employeur — non déduites du salaire net</div>
          </div>
          <div style="font-size:14px;font-weight:700;color:#92400e;">${patron.toLocaleString("fr-FR")} FCFA</div>
        </div>

        <!-- Recap -->
        <div class="recap-grid">
          <div class="recap-card"><div class="recap-card-label">Brut</div><div class="recap-card-val" style="color:#1e293b">${(brut / 1000).toFixed(0)}k</div></div>
          <div class="recap-card"><div class="recap-card-label">Déductions</div><div class="recap-card-val" style="color:#be123c">−${((ipres + ir) / 1000).toFixed(0)}k</div></div>
          <div class="recap-card"><div class="recap-card-label">Net</div><div class="recap-card-val" style="color:#15803d">${(net / 1000).toFixed(0)}k</div></div>
        </div>

        <p style="font-size:9px;color:#94a3b8;text-align:center;margin-bottom:8px;">Ce bulletin est établi conformément au Code du Travail sénégalais et à la réglementation de l'IPRES.</p>
      </div>

      <div class="footer-bar"></div>
      <div class="footer">
        <div class="footer-left">${entreprise.nom} · ${entreprise.email || ""} · ${entreprise.tel || ""}</div>
        <div class="footer-right">${emp.matricule || "—"} · ${moisLabel.toUpperCase()}-${annee}</div>
      </div>
    </div>
    </body></html>
  `;
  const win = window.open("", "_blank", "width=820,height=700");
  win.document.write(html);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 500);
}

/* ═══════════════════════════════════════
   USERS DATABASE
═══════════════════════════════════════ */
const USERS_DB = [
  { id: 1, nom: "Moussa Diaw", prenom: "Moussa", email: "admin@transitpro.sn", password: "admin123", role: "Administrateur", poste: "Transitaire senior", avatar: "MD", actif: true },
  { id: 2, nom: "Awa Sarr", prenom: "Awa", email: "awa@transitpro.sn", password: "awa123", role: "Transitaire", poste: "Transitaire", avatar: "AS", actif: true },
  { id: 3, nom: "Ibou Faye", prenom: "Ibou", email: "ibou@transitpro.sn", password: "ibou123", role: "Agent douanier", poste: "Agent douanier", avatar: "IF", actif: true },
  { id: 4, nom: "Rokhaya Dieng", prenom: "Rokhaya", email: "rokhaya@transitpro.sn", password: "rok123", role: "Comptable", poste: "Comptable", avatar: "RD", actif: false },
];

/* ═══════════════════════════════════════
   LOGIN COMPONENT
═══════════════════════════════════════ */
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (!email || !password) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.actif);
      setLoading(false);
      if (user) {
        onLogin(user);
      } else {
        const exists = USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!exists) setError("Aucun compte trouvé avec cet email.");
        else if (!exists.actif) setError("Ce compte est désactivé. Contactez l'administrateur.");
        else setError("Mot de passe incorrect.");
      }
    }, 800);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');*{font-family:'Sora',sans-serif;}`}</style>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-800/50 rounded-full blur-3xl" />
        {/* Grid dots */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#f59e0b" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400 rounded-2xl shadow-2xl shadow-amber-400/30 mb-4">
            <span className="text-slate-900 font-black text-3xl" style={{ fontFamily: "Georgia,serif" }}>T</span>
          </div>
          <h1 className="text-white font-bold text-2xl tracking-tight">TransitPro</h1>
          <p className="text-slate-400 text-sm mt-1">Solutions douanières & logistiques</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-white font-semibold text-lg">Connexion</h2>
            <p className="text-slate-400 text-sm mt-0.5">Accédez à votre espace de gestion</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-5">
              <span className="text-rose-400 text-base shrink-0">⚠</span>
              <p className="text-rose-300 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">✉</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={handleKeyDown}
                  placeholder="votre@email.sn"
                  className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mot de passe</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔒</span>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-xl pl-9 pr-12 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
                />
                <button
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-sm">
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <button
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center text-xs ${rememberMe ? "bg-amber-400 border-amber-400 text-slate-900" : "border-slate-600 bg-transparent"}`}>
                  {rememberMe && "✓"}
                </button>
                <span className="text-slate-400 text-xs">Se souvenir de moi</span>
              </label>
              <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium">
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Connexion en cours…
                </>
              ) : "Se connecter →"}
            </button>
          </div>

          {/* Comptes de démo */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <p className="text-xs text-slate-500 text-center mb-3 uppercase tracking-wider font-semibold">Comptes de démonstration</p>
            <div className="grid grid-cols-2 gap-2">
              {USERS_DB.filter(u => u.actif).map(u => (
                <button key={u.id}
                  onClick={() => { setEmail(u.email); setPassword(u.password); setError(""); }}
                  className="text-left p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-900/80 border border-slate-700/50 hover:border-amber-400/40 transition-all group">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-amber-400/10 border border-amber-400/20 rounded-lg flex items-center justify-center text-xs font-bold text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-900 transition-all shrink-0">
                      {u.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-medium truncate">{u.prenom}</p>
                      <p className="text-slate-500 text-xs truncate">{u.role}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2026 TransitPro SARL · Tous droits réservés
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function TransitaireDashboard() {
  const [authUser, setAuthUser] = useState(null); // null = logged out
  const isAdmin = authUser?.role === "Administrateur"; // true = full access
  const [dossiers, setDossiers] = useState(DOSSIERS_INIT);
  const [clients, setClients] = useState(CLIENTS_INIT);
  const [vue, setVue] = useState("dashboard"); // dashboard | dossiers | clients | dossier_detail
  const [dossierActif, setDossierActif] = useState(null);
  const [clientActif, setClientActif] = useState(null);
  const [dossierView, setDossierView] = useState("grid"); // "grid" | "list"
  const [clientView, setClientView] = useState("grid"); // "grid" | "list"
  const [clientSearch, setClientSearch] = useState("");
  const [clientTypeFilter, setClientTypeFilter] = useState("all");

  // ── Charges de bureau state ──
  const CATS_CHARGES = [
    { key: "Transport", label: "Transport", icon: "🚌", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    { key: "Repas", label: "Repas", icon: "🍽️", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
    { key: "Internet", label: "Internet", icon: "📡", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
    { key: "Telephone", label: "Téléphone", icon: "📱", color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
    { key: "Electricite", label: "Électricité", icon: "⚡", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
    { key: "Location", label: "Location", icon: "🏢", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
    { key: "Salaire", label: "Salaire", icon: "💼", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
  ];
  const MOIS_CHARGES = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const [charges, setCharges] = useState([
    { id: 1, categorie: "Transport", montant: 45000, date: "2026-04-03", mois: 3, annee: 2026, description: "Carburant véhicule bureau", ref: "TRS-001", mode: "Espèces", beneficiaire: "Shell Dakar", statut: "payé" },
    { id: 2, categorie: "Repas", montant: 32000, date: "2026-04-08", mois: 3, annee: 2026, description: "Déjeuner réunion clients", ref: "REP-002", mode: "Mobile Money", beneficiaire: "Restaurant Le Baobab", statut: "payé" },
    { id: 3, categorie: "Internet", montant: 25000, date: "2026-04-01", mois: 3, annee: 2026, description: "Abonnement fibre optique", ref: "INT-003", mode: "Virement", beneficiaire: "Orange Sénégal", statut: "payé" },
    { id: 4, categorie: "Telephone", montant: 18500, date: "2026-04-01", mois: 3, annee: 2026, description: "Forfait téléphonique pro", ref: "TEL-004", mode: "Virement", beneficiaire: "Expresso Sénégal", statut: "payé" },
    { id: 5, categorie: "Electricite", montant: 87000, date: "2026-04-10", mois: 3, annee: 2026, description: "Facture SENELEC mensuelle", ref: "ELEC-005", mode: "Chèque", beneficiaire: "SENELEC", statut: "payé" },
    { id: 6, categorie: "Location", montant: 180000, date: "2026-04-01", mois: 3, annee: 2026, description: "Loyer bureau Plateau", ref: "LOC-006", mode: "Virement", beneficiaire: "SCI Dakar Immo", statut: "payé" },
    { id: 7, categorie: "Salaire", montant: 850000, date: "2026-04-30", mois: 3, annee: 2026, description: "Masse salariale mensuelle", ref: "SAL-007", mode: "Virement", beneficiaire: "Employés", statut: "payé" },
    { id: 8, categorie: "Transport", montant: 52000, date: "2026-03-05", mois: 2, annee: 2026, description: "Transport conteneur port", ref: "TRS-008", mode: "Espèces", beneficiaire: "Trans Sahel", statut: "payé" },
    { id: 9, categorie: "Repas", montant: 41000, date: "2026-03-18", mois: 2, annee: 2026, description: "Repas équipe projet", ref: "REP-009", mode: "Espèces", beneficiaire: "Café de Paris", statut: "payé" },
    { id: 10, categorie: "Electricite", montant: 92000, date: "2026-03-10", mois: 2, annee: 2026, description: "SENELEC mars 2026", ref: "ELEC-010", mode: "Chèque", beneficiaire: "SENELEC", statut: "payé" },
    { id: 11, categorie: "Location", montant: 180000, date: "2026-03-01", mois: 2, annee: 2026, description: "Loyer bureau mars", ref: "LOC-011", mode: "Virement", beneficiaire: "SCI Dakar Immo", statut: "payé" },
    { id: 12, categorie: "Salaire", montant: 850000, date: "2026-03-31", mois: 2, annee: 2026, description: "Masse salariale mars", ref: "SAL-012", mode: "Virement", beneficiaire: "Employés", statut: "payé" },
  ]);
  const [moisCharges, setMoisCharges] = useState(3); // 0-indexed
  const [anneeCharges, setAnneeCharges] = useState(2026);
  const [filtreChargesCat, setFiltreChargesCat] = useState("all");
  const [chargeModal, setChargeModal] = useState(false);
  const [editChargeId, setEditChargeId] = useState(null);
  const EMPTY_CHARGE = { categorie: "Transport", montant: "", date: today, mois: 3, annee: 2026, description: "", ref: "", mode: "Virement", beneficiaire: "", statut: "payé" };
  const [chargeForm, setChargeForm] = useState(EMPTY_CHARGE);

  // ── Salaires state ──
  const TAUX_IPRES = 0.06;
  const TAUX_IR = 0.08;
  const TAUX_PATRON = 0.22;
  const MOIS_LABELS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const [employes, setEmployes] = useState([
    { id: 1, prenom: "Aminata", nom: "Diallo", poste: "Développeuse Senior", dept: "IT", salaire: 850000, dateEmbauche: "2021-03-15", matricule: "EMP-001", cnss: "SN-1234567", rib: "SN28 0001 0000 1234", actif: true },
    { id: 2, prenom: "Moussa", nom: "Traoré", poste: "Comptable", dept: "Finance", salaire: 620000, dateEmbauche: "2019-07-01", matricule: "EMP-002", cnss: "SN-2345678", rib: "SN28 0001 0000 2345", actif: true },
    { id: 3, prenom: "Fatou", nom: "Sow", poste: "Chargée RH", dept: "RH", salaire: 480000, dateEmbauche: "2022-01-10", matricule: "EMP-003", cnss: "SN-3456789", rib: "SN28 0001 0000 3456", actif: true },
    { id: 4, prenom: "Ibrahima", nom: "Ba", poste: "Responsable Ventes", dept: "Commercial", salaire: 750000, dateEmbauche: "2020-05-20", matricule: "EMP-004", cnss: "SN-4567890", rib: "SN28 0001 0000 4567", actif: true },
    { id: 5, prenom: "Mariama", nom: "Ndiaye", poste: "Analyste Données", dept: "IT", salaire: 520000, dateEmbauche: "2026-02-01", matricule: "EMP-005", cnss: "SN-5678901", rib: "SN28 0001 0000 5678", actif: true },
    { id: 6, prenom: "Ousmane", nom: "Fall", poste: "Chef de Projet", dept: "Opérations", salaire: 690000, dateEmbauche: "2018-11-12", matricule: "EMP-006", cnss: "SN-6789012", rib: "SN28 0001 0000 6789", actif: true },
  ]);
  const [moisSalaire, setMoisSalaire] = useState(new Date().getMonth()); // 0-indexed
  const [anneeSalaire, setAnneeSalaire] = useState(new Date().getFullYear());
  const [mouvementsSalaire, setMouvementsSalaire] = useState([
    { id: 1, employeId: 1, type: "prime", montant: 85000, mois: 2, annee: 2026, label: "Prime Q1" },
    { id: 2, employeId: 3, type: "absence", montant: 24000, mois: 1, annee: 2026, label: "Absence 3j" },
    { id: 3, employeId: 4, type: "avance", montant: 150000, mois: 3, annee: 2026, label: "Avance mai" },
  ]);
  const [empSalaireModal, setEmpSalaireModal] = useState(false);
  const [empSalaireForm, setEmpSalaireForm] = useState({ prenom: "", nom: "", poste: "", dept: "Transit", salaire: "", dateEmbauche: "", matricule: "", cnss: "", rib: "", actif: true });
  const [editEmpSalaireId, setEditEmpSalaireId] = useState(null);

  const calcSalaire = (emp, mois, annee) => {
    const mvts = mouvementsSalaire.filter(m => m.employeId === emp.id && m.mois === mois && m.annee === annee);
    const primes = mvts.filter(m => m.type === "prime" || m.type === "bonus").reduce((s, m) => s + m.montant, 0);
    const deductions = mvts.filter(m => m.type === "absence" || m.type === "avance" || m.type === "penalite").reduce((s, m) => s + m.montant, 0);
    const brut = emp.salaire + primes - deductions;
    const ipres = Math.round(brut * TAUX_IPRES);
    const ir = Math.round(brut * TAUX_IR);
    const net = brut - ipres - ir;
    const patron = Math.round(brut * TAUX_PATRON);
    return { brut, ipres, ir, net, patron, primes, deductions };
  };
  const [darkMode, setDarkMode] = useState(false);
  const [showSolde, setShowSolde] = useState(true);

  // Config app
  const EMPTY_PERS = { id: null, prenom: "", nom: "", poste: "", role: "Transitaire", dept: "Transit", tel: "", email: "", avatar: "", password: "", adresse: "", dateEmbauche: "", actif: true, note: "" };

  const [personnel, setPersonnel] = useState(USERS_DB.map(u => ({
    ...u, dept: "Transit", adresse: "", dateEmbauche: "", note: "",
  })));
  const [form, setForm] = useState(EMPTY_PERS);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [searchP, setSearchP] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const [filterActif, setFilterActif] = useState("all"); // "all" | "actif" | "inactif"

  const EMPTY_CAT_FORM = { key: "", label: "", icon: "💸", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };
  const [catForm, setCatForm] = useState(EMPTY_CAT_FORM);
  const [catFormErr, setCatFormErr] = useState({});
  const [editIdx, setEditIdx] = useState(null); // null = add, number = edit

  const [selectedRole, setSelectedRole] = useState("Transitaire");
  const [showNewRoleForm, setShowNewRoleForm] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({ nom: "", description: "", baseRole: "" });
  const [newRoleError, setNewRoleError] = useState("");
  const [editRoleName, setEditRoleName] = useState(null); // role being renamed
  const [editRoleInput, setEditRoleInput] = useState("");
  const [roleDescriptions, setRoleDescriptions] = useState({
    "Administrateur": "Accès complet à toutes les fonctionnalités",
    "Transitaire": "Gestion des dossiers et clients",
    "Agent douanier": "Consultation dossiers et décaissements",
    "Comptable": "Gestion financière et soldes",
    "Commercial": "Gestion clients et dossiers commerciaux",
    "Directeur": "Supervision générale avec accès financier",
    "Stagiaire": "Accès en lecture seule",
  });

  const [config, setConfig] = useState({
    entreprise: {
      nom: "TransitPro SARL",
      slogan: "Solutions douanières & logistiques",
      adresse: "15 Avenue Léopold Sédar Senghor",
      ville: "Dakar, Sénégal",
      tel: "+221 33 820 00 00",
      email: "contact@transitpro.sn",
      site: "www.transitpro.sn",
      ninea: "00112233-2T1",
      rc: "SN-DKR-2018-B-12345",
      agrement: "AGR-DGD-2018-0042",
    },
    utilisateur: {
      nom: "Moussa Diaw",
      prenom: "Moussa",
      poste: "Transitaire senior",
      email: "m.diaw@transitpro.sn",
      tel: "+221 77 123 4567",
      avatar: "MD",
    },
    preferences: {
      devise: "FCFA",
      langue: "fr",
      dateFormat: "DD/MM/YYYY",
      tauxTVA: 18,
      delaiPaiement: 30,
      alerteEcheance: 7,
      couleurAccent: "amber",
      notifEmail: true,
      notifSMS: false,
      signatureAuto: true,
    },
    responsables: [
      { id: 1, nom: "Moussa Diaw", poste: "Transitaire senior", tel: "+221 77 123 4567", actif: true },
      { id: 2, nom: "Awa Sarr", poste: "Transitaire", tel: "+221 76 234 5678", actif: true },
      { id: 3, nom: "Ibou Faye", poste: "Agent douanier", tel: "+221 70 345 6789", actif: true },
    ],
    categoriesDecaiss: [...CATEGORIES_DECAISSEMENT],
    typesPrestation: [...TYPES_PRESTATION],
    modesPaiement: [...MODES_PAIEMENT],
    rolePermissions: {
      "Administrateur": [
        "dossier.read", "dossier.write", "dossier.delete",
        "client.read", "client.write", "client.delete",
        "paiement.read", "paiement.write", "paiement.delete",
        "decaissement.read", "decaissement.write", "decaissement.delete",
        "config.read", "config.write",
        "solde.view", "personnel.manage",
      ],
      "Transitaire": [
        "dossier.read", "dossier.write",
        "client.read", "client.write",
        "paiement.read", "paiement.write",
        "decaissement.read", "decaissement.write",
      ],
      "Agent douanier": [
        "dossier.read",
        "client.read",
        "decaissement.read", "decaissement.write",
      ],
      "Comptable": [
        "dossier.read",
        "client.read",
        "paiement.read", "paiement.write",
        "decaissement.read",
        "solde.view",
      ],
      "Commercial": [
        "dossier.read", "dossier.write",
        "client.read", "client.write",
      ],
      "Directeur": [
        "dossier.read", "dossier.write", "dossier.delete",
        "client.read", "client.write", "client.delete",
        "paiement.read", "paiement.write",
        "decaissement.read",
        "solde.view",
      ],
      "Stagiaire": [
        "dossier.read",
        "client.read",
      ],
    },
  });
  const [configTab, setConfigTab] = useState("entreprise");
  const [configSaved, setConfigSaved] = useState(false);

  const saveConfig = () => {
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };
  const setConf = (section, key, val) => setConfig(c => ({ ...c, [section]: { ...c[section], [key]: val } }));

  // Permission checker — uses config.rolePermissions for non-admin, always true for admin
  const hasPermission = (perm) => {
    if (!authUser) return false;
    if (authUser.role === "Administrateur") return true;
    const perms = config.rolePermissions[authUser.role] || [];
    return perms.includes(perm);
  };

  // Filtres dossiers
  const [filtreStatut, setFiltreStatut] = useState("all");
  const [filtreClient, setFiltreClient] = useState("all");
  const [filtrePrio, setFiltrePrio] = useState("all");
  const [recherche, setRecherche] = useState("");

  // Modal paiement
  const [paiementModal, setPaiementModal] = useState(false);
  const [paiementDossierId, setPaiementDossierId] = useState(null);
  const [formPaiement, setFormPaiement] = useState({ montant: "", mode: "Virement bancaire", date: today, ref: "", note: "" });

  // Modal nouveau dossier
  const [nouveauDossierModal, setNouveauDossierModal] = useState(false);
  const [formDossier, setFormDossier] = useState({ clientId: "", type: "Dédouanement import", description: "", dateEcheance: "", priorite: "normale", responsable: "", port: "", bl: "", prestations: [{ label: "", montant: "" }] });

  // Modal décaissement
  const [decaissementModal, setDecaissementModal] = useState(false);
  const [decaissementDossierId, setDecaissementDossierId] = useState(null);
  const EMPTY_DECAISS = { categorie: "Debarquement", montant: "", date: today, ref: "", mode: "Virement bancaire", note: "" };
  const [formDecaiss, setFormDecaiss] = useState(EMPTY_DECAISS);

  const enregistrerDecaissement = () => {
    const mt = parseInt(formDecaiss.montant);
    if (!mt || !decaissementDossierId) return;
    setDossiers(prev => prev.map(d => {
      if (d.id !== decaissementDossierId) return d;
      const newD = [...(d.decaissements || []), {
        id: `D${Date.now()}`,
        categorie: formDecaiss.categorie,
        montant: mt,
        date: formDecaiss.date,
        ref: formDecaiss.ref || `REF-${Date.now()}`,
        mode: formDecaiss.mode,
        note: formDecaiss.note,
      }];
      return { ...d, decaissements: newD };
    }));
    setFormDecaiss(EMPTY_DECAISS);
    setDecaissementModal(false);
  };

  // Modal nouveau client
  const [nouveauClientModal, setNouveauClientModal] = useState(false);
  const [clientEditId, setClientEditId] = useState(null);
  const EMPTY_CLIENT = { nom: "", contact: "", tel: "", email: "", ville: "", type: "Entreprise", ninea: "", adresse: "", rc: "", note: "" };
  const [formClient, setFormClient] = useState(EMPTY_CLIENT);
  const [clientErrors, setClientErrors] = useState({});

  const ouvrirNouveauClient = () => { setClientEditId(null); setFormClient(EMPTY_CLIENT); setClientErrors({}); setNouveauClientModal(true); };
  const ouvrirEditerClient = (c) => { setClientEditId(c.id); setFormClient({ ...c }); setClientErrors({}); setNouveauClientModal(true); };

  const sauvegarderClient = () => {
    const errs = {};
    if (!formClient.nom.trim()) errs.nom = "Nom requis";
    if (!formClient.contact.trim()) errs.contact = "Contact requis";
    if (!formClient.tel.trim()) errs.tel = "Téléphone requis";
    if (Object.keys(errs).length) { setClientErrors(errs); return; }
    if (clientEditId) {
      setClients(prev => prev.map(c => c.id === clientEditId ? { ...c, ...formClient } : c));
    } else {
      const newId = Math.max(...clients.map(c => c.id)) + 1;
      setClients(prev => [...prev, { ...formClient, id: newId }]);
    }
    setNouveauClientModal(false);
  };

  const supprimerClient = (id) => {
    if (dossiers.some(d => d.clientId === id)) { alert("Ce client a des dossiers associés. Clôturez-les avant de supprimer."); return; }
    setClients(prev => prev.filter(c => c.id !== id));
  };

  /* ── Stats globales ── */
  const stats = useMemo(() => {
    const total = dossiers.reduce((s, d) => s + d.montantTotal, 0);
    const paye = dossiers.reduce((s, d) => s + totalPaye(d), 0);
    const reste = total - paye;
    const totalDecaiss = dossiers.reduce((s, d) => s + totalDecaisse(d), 0);
    const soldeNet = paye - totalDecaiss;
    const enCours = dossiers.filter(d => !["cloture", "annule"].includes(d.statut)).length;
    const urgents = dossiers.filter(d => d.priorite === "urgente" && !["cloture", "annule"].includes(d.statut)).length;
    const aTraiter = dossiers.filter(d => ["nouveau", "attente_doc"].includes(d.statut)).length;
    return { total, paye, reste, totalDecaiss, soldeNet, enCours, urgents, aTraiter };
  }, [dossiers]);

  /* ── Dossiers filtrés ── */
  const dossiersFiltres = useMemo(() => {
    const q = recherche.toLowerCase();
    return dossiers.filter(d => {
      const client = clients.find(c => c.id === d.clientId);
      return (
        (filtreStatut === "all" || d.statut === filtreStatut) &&
        (filtreClient === "all" || String(d.clientId) === filtreClient) &&
        (filtrePrio === "all" || d.priorite === filtrePrio) &&
        (!q || d.id.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || client?.nom.toLowerCase().includes(q))
      );
    });
  }, [dossiers, clients, filtreStatut, filtreClient, filtrePrio, recherche]);

  /* ── Données charts ── */
  const pieData = useMemo(() => {
    return Object.entries(STATUTS_DOSSIER).map(([k, v]) => ({
      name: v.label, value: dossiers.filter(d => d.statut === k).length
    })).filter(x => x.value > 0);
  }, [dossiers]);

  const barEncaissement = useMemo(() => {
    return clients.slice(0, 6).map(c => {
      const dos = dossiers.filter(d => d.clientId === c.id);
      return {
        name: c.nom.split(" ")[0],
        Facturé: dos.reduce((s, d) => s + d.montantTotal, 0),
        Encaissé: dos.reduce((s, d) => s + totalPaye(d), 0),
      };
    });
  }, [dossiers, clients]);

  /* ── Enregistrer paiement ── */
  const enregistrerPaiement = () => {
    const mt = parseInt(formPaiement.montant);
    if (!mt || !paiementDossierId) return;
    const dos = dossiers.find(d => d.id === paiementDossierId);
    if (!dos || mt > resteApayer(dos)) return alert("Montant supérieur au reste à payer");
    setDossiers(prev => prev.map(d => {
      if (d.id !== paiementDossierId) return d;
      const newPaiements = [...d.paiements, { id: `P${Date.now()}`, date: formPaiement.date, montant: mt, mode: formPaiement.mode, ref: formPaiement.ref || `REF-${Date.now()}`, note: formPaiement.note }];
      const newReste = d.montantTotal - newPaiements.reduce((s, p) => s + p.montant, 0);
      return { ...d, paiements: newPaiements, statut: newReste <= 0 && d.statut === "en_cours" ? d.statut : d.statut };
    }));
    setFormPaiement({ montant: "", mode: "Virement bancaire", date: today, ref: "", note: "" });
    setPaiementModal(false);
  };

  /* ── Ajouter dossier ── */
  const ajouterDossier = () => {
    if (!formDossier.clientId || !formDossier.description) return;
    const total = formDossier.prestations.reduce((s, p) => s + (parseInt(p.montant) || 0), 0);
    const num = String(dossiers.length + 1).padStart(3, "0");
    const newD = {
      id: `DOS-2026-${num}`, clientId: parseInt(formDossier.clientId), type: formDossier.type,
      description: formDossier.description, statut: "nouveau", dateOuverture: today,
      dateEcheance: formDossier.dateEcheance, montantTotal: total, paiements: [],
      prestations: formDossier.prestations.filter(p => p.label && p.montant).map(p => ({ ...p, montant: parseInt(p.montant) })),
      priorite: formDossier.priorite, responsable: formDossier.responsable,
      port: formDossier.port, bl: formDossier.bl,
    };
    setDossiers(prev => [newD, ...prev]);
    setNouveauDossierModal(false);
    setFormDossier({ clientId: "", type: "Dédouanement import", description: "", dateEcheance: "", priorite: "normale", responsable: "", port: "", bl: "", prestations: [{ label: "", montant: "" }] });
  };

  /* ── Changer statut ── */
  const changerStatut = (id, statut) => setDossiers(prev => prev.map(d => d.id === id ? { ...d, statut } : d));

  const supprimerDossier = (id) => {
    setDossiers(prev => prev.filter(d => d.id !== id));
    setVue("dossiers");
  };

  const supprimerPaiement = (dossierId, paiementId) => {
    setDossiers(prev => prev.map(d =>
      d.id === dossierId ? { ...d, paiements: d.paiements.filter(p => p.id !== paiementId) } : d
    ));
  };

  const supprimerDecaissement = (dossierId, decaissId) => {
    setDossiers(prev => prev.map(d =>
      d.id === dossierId ? { ...d, decaissements: (d.decaissements || []).filter(x => x.id !== decaissId) } : d
    ));
  };

  /* ── Ouvrir fiche dossier ── */
  const ouvrirDossier = (d) => { setDossierActif(d); setVue("dossier_detail"); };

  /* ════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════ */
  // ── Show login if not authenticated ──
  if (!authUser) return <LoginPage onLogin={(user) => setAuthUser(user)} />;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? "bg-slate-950" : "bg-slate-50"}`}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');*{font-family:'Sora',sans-serif;}`}</style>

      {/* ══ SIDEBAR + HEADER layout ══ */}
      <div className="flex">

        {/* ── Sidebar fixed ── */}
        <aside className={`w-56 h-screen flex flex-col hidden md:flex shrink-0 fixed top-0 left-0 z-30 overflow-y-auto transition-colors duration-300 ${darkMode ? "bg-black border-r border-slate-800" : "bg-slate-900"}`}>
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
            {/* Role badge */}
            <div className="mb-2 px-1">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${isAdmin ? "bg-amber-400/20 text-amber-300" : "bg-slate-700 text-slate-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-amber-400" : "bg-slate-500"}`} />
                {authUser?.role}
              </span>
            </div>
            {[
              { key: "dashboard", icon: "⊞", label: "Tableau de bord", adminOnly: false },
              { key: "dossiers", icon: "📁", label: "Dossiers", adminOnly: false },
              { key: "clients", icon: "👥", label: "Clients", adminOnly: false },
              { key: "charges", icon: "🏦", label: "Charges bureau", adminOnly: false },
              { key: "salaires", icon: "💼", label: "Salaires", adminOnly: true },
              { key: "configuration", icon: "⚙️", label: "Configuration", adminOnly: true },
            ].filter(n => !n.adminOnly || isAdmin).map(n => (
              <button key={n.key} onClick={() => setVue(n.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${vue === n.key || (vue === "dossier_detail" && n.key === "dossiers")
                  ? "bg-amber-400 text-slate-900 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}>
                <span className="text-base">{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isAdmin ? "bg-amber-400 text-slate-900" : "bg-slate-700 text-slate-300"}`}>{authUser.avatar}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-white text-xs font-medium truncate">{authUser.prenom}</p>
                    {isAdmin && <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 shrink-0">ADM</span>}
                  </div>
                  <p className="text-slate-500 text-xs truncate">{authUser.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setDarkMode(d => !d)}
                  className="text-slate-500 hover:text-amber-400 transition-colors text-sm shrink-0"
                  title={darkMode ? "Mode clair" : "Mode sombre"}>
                  {darkMode ? "☀️" : "🌙"}
                </button>
                <button
                  onClick={() => { if (window.confirm("Se déconnecter ?")) setAuthUser(null); }}
                  className="text-slate-500 hover:text-amber-400 transition-colors text-xs shrink-0"
                  title="Déconnexion">⏻</button>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main (offset for fixed sidebar) ── */}
        <div className={`flex-1 min-w-0 p-4 md:p-6 space-y-5 md:ml-56 min-h-screen transition-colors duration-300 ${darkMode ? "bg-slate-950" : ""}`}>

          {/* Mobile nav */}
          <div className="flex md:hidden gap-2 mb-2">
            {[{ key: "dashboard", label: "Dashboard", admin: false }, { key: "dossiers", label: "Dossiers", admin: false }, { key: "clients", label: "Clients", admin: false }, { key: "charges", label: "Charges", admin: false }, { key: "salaires", label: "Salaires", admin: true }, { key: "configuration", label: "Config", admin: true }].filter(n => !n.admin || isAdmin).map(n => (
              <button key={n.key} onClick={() => setVue(n.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${vue === n.key ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}>
                {n.label}
              </button>
            ))}
          </div>

          {/* ══════════ DASHBOARD ══════════ */}
          {vue === "dashboard" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Tableau de bord</h1>
                  <p className="text-slate-400 text-sm">Activité transitaire — Avril 2026</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Show/Hide solde button — admin only */}
                  {isAdmin && <button onClick={() => setShowSolde(s => !s)}
                    className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${showSolde ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"} ${darkMode ? "!bg-slate-800 !text-slate-200 !border-slate-700" : ""}`}
                    title={showSolde ? "Masquer les soldes" : "Afficher les soldes"}>
                    {showSolde ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                    {showSolde ? "Masquer soldes" : "Afficher soldes"}
                  </button>}
                  {/* Dark/Light mode toggle */}
                  <button onClick={() => setDarkMode(d => !d)}
                    className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${darkMode ? "bg-amber-400 text-slate-900 border-amber-400" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                    title={darkMode ? "Mode clair" : "Mode sombre"}>
                    {darkMode ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1M4.22 4.22l.71.71m12.73 12.73.71.71M3 12h1m16 0h1M4.22 19.78l.71-.71M18.36 5.64l.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                    )}
                    {darkMode ? "Mode clair" : "Mode sombre"}
                  </button>
                  <button
                    onClick={() => printRapportAnnuel(dossiers, clients, config.entreprise, STATUTS_DOSSIER)}
                    className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Rapport annuel
                  </button>
                  <button onClick={() => setNouveauDossierModal(true)}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
                    + Nouveau dossier
                  </button>
                </div>
              </div>

              {/* KPI Row 1 — Financier */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { label: "Total facturé", value: fmtM(stats.total), color: "text-slate-900", bg: "bg-white", icon: "💰", sub: "Prestations TTC" },
                  { label: "Encaissements", value: fmtM(stats.paye), color: "text-emerald-600", bg: "bg-emerald-50", icon: "⬇", sub: "Reçus clients" },
                  { label: "Décaissements", value: fmtM(stats.totalDecaiss), color: "text-rose-600", bg: "bg-rose-50", icon: "⬆", sub: "Frais réglés" },
                  { label: "Solde net", value: fmtM(Math.abs(stats.soldeNet)), color: stats.soldeNet >= 0 ? "text-blue-700" : "text-orange-600", bg: stats.soldeNet >= 0 ? "bg-blue-50" : "bg-orange-50", icon: stats.soldeNet >= 0 ? "✓" : "!", sub: stats.soldeNet >= 0 ? "Bénéfice" : "Déficit" },
                  { label: "Reste à percevoir", value: fmtM(stats.reste), color: "text-amber-600", bg: "bg-amber-50", icon: "⏳", sub: "Non encaissé" },
                ].map(k => (
                  <Card key={k.label} className={`rounded-2xl border-0 shadow-sm ${k.bg}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-xs font-semibold text-slate-500 leading-tight">{k.label}</p>
                        <span className={`text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center ${k.color} bg-white/60`}>{k.icon}</span>
                      </div>
                      <p className={`text-xl font-black ${k.color} leading-tight tabular-nums`}>{(isAdmin && showSolde) ? k.value : "••••••"}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{k.sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* KPI Row 2 — Dossiers */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Dossiers actifs", value: stats.enCours, color: "text-blue-600", bg: "bg-blue-50/60", icon: "📁" },
                  { label: "À traiter", value: stats.aTraiter, color: "text-amber-600", bg: "bg-amber-50/60", icon: "⚠" },
                  { label: "Urgents", value: stats.urgents, color: "text-rose-600", bg: "bg-rose-50/60", icon: "🔴" },
                ].map(k => (
                  <Card key={k.label} className={`rounded-2xl border-0 shadow-sm ${k.bg} cursor-pointer hover:shadow-md transition-shadow`} onClick={() => setVue("dossiers")}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">{k.label}</p>
                        <p className={`text-3xl font-black ${k.color} leading-tight`}>{k.value}</p>
                      </div>
                      <span className="text-2xl">{k.icon}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2 rounded-2xl border-slate-100 shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-slate-700">Facturé vs Encaissé par client</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={barEncaissement} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : (v / 1000).toFixed(0) + "k"} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="Facturé" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={18} />
                        <Bar dataKey="Encaissé" fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-slate-700">Statuts dossiers</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2}>
                          {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v, n) => [v + " dossier(s)", n]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {pieData.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          {d.name} ({d.value})
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dossiers urgents / à traiter */}
              <Card className="rounded-2xl border-slate-100 shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-700">Dossiers prioritaires à traiter</CardTitle>
                  <button onClick={() => setVue("dossiers")} className="text-xs text-slate-400 hover:text-slate-700 font-medium">Voir tous →</button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                    {dossiers.filter(d => !["cloture", "annule"].includes(d.statut)).sort((a, b) => a.priorite === "urgente" ? -1 : 1).slice(0, 5).map((d, i) => {
                      const client = clients.find(c => c.id === d.clientId);
                      const reste = resteApayer(d);
                      const taux = tauxPaiement(d);
                      return (
                        <div key={d.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 cursor-pointer transition-colors" onClick={() => ouvrirDossier(d)}>
                          <AvatarCircle name={client?.nom || "?"} idx={i} size="w-9 h-9" text="text-xs" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-slate-800">{d.id}</span>
                              <PriorityBadge priorite={d.priorite} />
                              <StatutBadge statut={d.statut} />
                            </div>
                            <p className="text-xs text-slate-500 truncate">{client?.nom} · {d.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-slate-400">Reste</p>
                            <p className={`text-sm font-bold ${reste > 0 ? "text-rose-500" : "text-emerald-600"}`}>{reste > 0 ? fmt(reste) : "Soldé"}</p>
                          </div>
                          <div className="w-16 shrink-0">
                            <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Paiement</span><span>{taux}%</span></div>
                            <div className="h-1.5 bg-slate-100 rounded-full"><div className="h-1.5 bg-emerald-400 rounded-full" style={{ width: `${taux}%` }} /></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ══════════ DOSSIERS ══════════ */}
          {vue === "dossiers" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Dossiers</h1>
                  <p className="text-slate-400 text-sm">{dossiers.length} dossiers au total</p>
                </div>
                <button
                  onClick={() => printTableDossiers(dossiersFiltres, clients, config.entreprise, STATUTS_DOSSIER)}
                  className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" /></svg>
                  Imprimer dossiers
                </button>
                {hasPermission("dossier.write") && (
                  <button onClick={() => setNouveauDossierModal(true)}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                    + Nouveau dossier
                  </button>
                )}
              </div>

              {/* ── Toolbar filtres + view toggle ── */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap gap-2 items-center">
                <Input placeholder="Rechercher…" className="w-40 h-8 text-xs rounded-xl" value={recherche} onChange={e => setRecherche(e.target.value)} />
                <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                  <SelectTrigger className="w-36 h-8 text-xs rounded-xl"><SelectValue placeholder="Statut" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    {Object.entries(STATUTS_DOSSIER).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filtreClient} onValueChange={setFiltreClient}>
                  <SelectTrigger className="w-40 h-8 text-xs rounded-xl"><SelectValue placeholder="Client" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous clients</SelectItem>
                    {clients.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.nom}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filtrePrio} onValueChange={setFiltrePrio}>
                  <SelectTrigger className="w-28 h-8 text-xs rounded-xl"><SelectValue placeholder="Priorité" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {["urgente", "haute", "normale"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <span className="text-xs text-slate-400">{dossiersFiltres.length} résultats</span>
                <div className="ml-auto flex items-center">
                  <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
                    <button onClick={() => setDossierView("grid")} title="Vue grille"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dossierView === "grid" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <rect x="1" y="1" width="6" height="6" rx="1.5" />
                        <rect x="9" y="1" width="6" height="6" rx="1.5" />
                        <rect x="1" y="9" width="6" height="6" rx="1.5" />
                        <rect x="9" y="9" width="6" height="6" rx="1.5" />
                      </svg>
                    </button>
                    <button onClick={() => setDossierView("list")} title="Vue liste"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${dossierView === "list" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                        <line x1="3" y1="4" x2="13" y2="4" /><line x1="3" y1="8" x2="13" y2="8" /><line x1="3" y1="12" x2="13" y2="12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* ═══ VUE GRILLE ═══ */}
              {dossierView === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {dossiersFiltres.length === 0 && (
                    <div className="col-span-3 py-16 text-center text-slate-400">
                      <p className="text-3xl mb-2">📁</p>
                      <p className="font-medium">Aucun dossier trouvé</p>
                    </div>
                  )}
                  {dossiersFiltres.map((d, i) => {
                    const client = clients.find(c => c.id === d.clientId);
                    const paye = totalPaye(d);
                    const reste = resteApayer(d);
                    const taux = tauxPaiement(d);
                    const decaiss = totalDecaisse(d);
                    const solde = soldeDecaisse(d);
                    const cidx = clients.findIndex(c => c.id === d.clientId);
                    return (
                      <Card key={d.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => ouvrirDossier(d)}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors">{d.id}</span>
                                <PriorityBadge priorite={d.priorite} />
                              </div>
                              <StatutBadge statut={d.statut} />
                            </div>
                            <AvatarCircle name={client?.nom || "?"} idx={cidx} size="w-9 h-9" text="text-xs" />
                          </div>
                          <p className="text-xs text-slate-500 mb-0.5 font-medium">{client?.nom}</p>
                          <p className="text-sm text-slate-700 font-medium mb-1 leading-snug line-clamp-2">{d.description}</p>
                          <p className="text-xs text-slate-400 mb-3">{d.type} · {d.port}</p>
                          {/* Financier 3 cols */}
                          <div className="grid grid-cols-3 gap-1.5 mb-3">
                            <div className="bg-slate-50 rounded-xl p-2">
                              <p className="text-xs text-slate-400 mb-0.5 leading-tight">Facturé</p>
                              <p className="text-xs font-bold text-slate-700 tabular-nums">{(d.montantTotal / 1000).toFixed(0)}k</p>
                            </div>
                            <div className="bg-rose-50 rounded-xl p-2">
                              <p className="text-xs text-rose-400 mb-0.5 leading-tight">Décaissé</p>
                              <p className="text-xs font-bold text-rose-600 tabular-nums">{(decaiss / 1000).toFixed(0)}k</p>
                            </div>
                            <div className={`rounded-xl p-2 ${solde >= 0 ? "bg-emerald-50" : "bg-orange-50"}`}>
                              <p className={`text-xs mb-0.5 leading-tight ${solde >= 0 ? "text-emerald-500" : "text-orange-500"}`}>Solde</p>
                              <p className={`text-xs font-bold tabular-nums ${solde >= 0 ? "text-emerald-600" : "text-orange-600"}`}>{solde >= 0 ? "+" : ""}{(solde / 1000).toFixed(0)}k</p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Encaissement</span><span className="font-semibold text-slate-600">{taux}%</span></div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-1.5 rounded-full transition-all ${taux >= 100 ? "bg-emerald-400" : taux > 50 ? "bg-amber-400" : "bg-rose-400"}`} style={{ width: `${taux}%` }} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="text-xs text-slate-400">📅 {d.dateEcheance}</div>
                            <div className="flex items-center gap-1.5">
                              {hasPermission("dossier.delete") && <button onClick={e => { e.stopPropagation(); if (window.confirm("Supprimer le dossier " + d.id + " ?")) supprimerDossier(d.id); }}
                                className="text-xs p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors">🗑</button>}
                              <button onClick={e => { e.stopPropagation(); setPaiementDossierId(d.id); setPaiementModal(true); }}
                                disabled={reste <= 0}
                                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${reste > 0 ? "bg-amber-400 hover:bg-amber-500 text-slate-900" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                                {reste > 0 ? "+ Paiement" : "Soldé"}
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* ═══ VUE LISTE ═══ */}
              {dossierView === "list" && (
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 border-slate-100">
                          {["Dossier", "Client", "Type", "Statut", "Facturé", "Encaissé", "Décaissé", "Solde net", "Éch.", ""].map(h => (
                            <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-4 py-3 whitespace-nowrap">{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dossiersFiltres.length === 0 && (
                          <TableRow><TableCell colSpan={10} className="text-center py-10 text-slate-400">Aucun dossier</TableCell></TableRow>
                        )}
                        {dossiersFiltres.map((d, i) => {
                          const client = clients.find(c => c.id === d.clientId);
                          const paye = totalPaye(d);
                          const reste = resteApayer(d);
                          const decaiss = totalDecaisse(d);
                          const solde = soldeDecaisse(d);
                          const cidx = clients.findIndex(c => c.id === d.clientId);
                          return (
                            <TableRow key={d.id} className="border-slate-50 hover:bg-slate-50/60 cursor-pointer group" onClick={() => ouvrirDossier(d)}>
                              <TableCell className="pl-5 py-3">
                                <div>
                                  <div className="flex items-center gap-1.5 mb-0.5">
                                    <span className="text-xs font-bold text-slate-800">{d.id}</span>
                                    <PriorityBadge priorite={d.priorite} />
                                  </div>
                                  <p className="text-xs text-slate-400 truncate max-w-[140px]">{d.description}</p>
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-1.5">
                                  <AvatarCircle name={client?.nom || "?"} idx={cidx} size="w-6 h-6" text="text-xs" />
                                  <span className="text-xs text-slate-600 truncate max-w-[100px]">{client?.nom}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs text-slate-500 py-3 max-w-[100px] truncate">{d.type}</TableCell>
                              <TableCell className="py-3"><StatutBadge statut={d.statut} /></TableCell>
                              <TableCell className="text-sm font-semibold text-slate-800 tabular-nums py-3 text-right">{(d.montantTotal / 1000).toFixed(0)}k</TableCell>
                              <TableCell className="text-sm font-semibold text-emerald-600 tabular-nums py-3 text-right">{(paye / 1000).toFixed(0)}k</TableCell>
                              <TableCell className="text-sm font-semibold text-rose-500 tabular-nums py-3 text-right">{(decaiss / 1000).toFixed(0)}k</TableCell>
                              <TableCell className={`text-sm font-bold tabular-nums py-3 text-right ${solde >= 0 ? "text-blue-600" : "text-orange-600"}`}>
                                {solde >= 0 ? "+" : ""}{(solde / 1000).toFixed(0)}k
                              </TableCell>
                              <TableCell className="text-xs text-slate-400 py-3 whitespace-nowrap">{d.dateEcheance}</TableCell>
                              <TableCell className="pr-4 py-3">
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={e => { e.stopPropagation(); setPaiementDossierId(d.id); setPaiementModal(true); }} disabled={reste <= 0}
                                    className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${reste > 0 ? "bg-amber-50 hover:bg-amber-100 text-amber-700" : "bg-slate-50 text-slate-300 cursor-not-allowed"}`}>
                                    {reste > 0 ? "Paiement" : "Soldé"}
                                  </button>
                                  {hasPermission("dossier.delete") && <button onClick={e => { e.stopPropagation(); if (window.confirm("Supprimer ?")) supprimerDossier(d.id); }}
                                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-500 text-slate-400 flex items-center justify-center text-xs transition-colors">🗑</button>}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    {dossiersFiltres.length > 0 && (
                      <div className="flex justify-between items-center px-5 py-3 border-t border-slate-50 bg-slate-50/50 text-xs text-slate-400 flex-wrap gap-2">
                        <span>{dossiersFiltres.length} dossier{dossiersFiltres.length > 1 ? "s" : ""}</span>
                        <div className="flex gap-4 flex-wrap">
                          <span>Facturé : <span className="font-semibold text-slate-700">{fmt(dossiersFiltres.reduce((s, d) => s + d.montantTotal, 0))}</span></span>
                          <span>Encaissé : <span className="font-semibold text-emerald-600">{fmt(dossiersFiltres.reduce((s, d) => s + totalPaye(d), 0))}</span></span>
                          <span>Décaissé : <span className="font-semibold text-rose-500">{fmt(dossiersFiltres.reduce((s, d) => s + totalDecaisse(d), 0))}</span></span>
                          <span>Solde : <span className={`font-semibold ${dossiersFiltres.reduce((s, d) => s + soldeDecaisse(d), 0) >= 0 ? "text-blue-600" : "text-orange-600"}`}>{fmt(dossiersFiltres.reduce((s, d) => s + soldeDecaisse(d), 0))}</span></span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* ══════════ DETAIL DOSSIER ══════════ */}
          {vue === "dossier_detail" && dossierActif && (() => {
            const d = dossiers.find(x => x.id === dossierActif.id) || dossierActif;
            const client = clients.find(c => c.id === d.clientId);
            const paye = totalPaye(d);
            const reste = resteApayer(d);
            const taux = tauxPaiement(d);
            const cidx = clients.findIndex(c => c.id === d.clientId);
            return (
              <div className="space-y-5">
                {/* Breadcrumb */}
                <div>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <button onClick={() => setVue("dossiers")} className="text-slate-400 hover:text-slate-700">← Dossiers</button>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-600 font-medium">{d.id}</span>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl font-bold text-slate-900">{d.id}</h1>
                      <StatutBadge statut={d.statut} />
                      <PriorityBadge priorite={d.priorite} />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Select value={d.statut} onValueChange={v => changerStatut(d.id, v)}>
                        <SelectTrigger className="h-8 text-xs rounded-xl w-40 border-slate-200"><SelectValue /></SelectTrigger>
                        <SelectContent>{Object.entries(STATUTS_DOSSIER).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
                      </Select>
                      <button
                        onClick={() => printFactureProformat(d, client, config.entreprise)}
                        className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors">
                        🖨 Proforma
                      </button>
                      <button
                        onClick={() => printFactureEncaissement(d, client, null, config.entreprise)}
                        className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                        🧾 Encaissement
                      </button>
                      <button
                        onClick={() => { setDecaissementDossierId(d.id); setDecaissementModal(true); }}
                        className="text-sm font-bold px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors">
                        − Décaissement
                      </button>
                      <button
                        onClick={() => { setPaiementDossierId(d.id); setPaiementModal(true); }}
                        disabled={reste <= 0}
                        className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${reste > 0 ? "bg-amber-400 hover:bg-amber-500 text-slate-900" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                        + Encaissement
                      </button>
                      {hasPermission("dossier.delete") && (
                        <button
                          onClick={() => { if (window.confirm("Supprimer définitivement le dossier " + d.id + " ? Cette action est irréversible.")) supprimerDossier(d.id); }}
                          className="text-sm font-bold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-500 transition-colors">
                          🗑 Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Colonne gauche */}
                  <div className="lg:col-span-2 space-y-4">

                    {/* Info dossier */}
                    <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                      <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AvatarCircle name={client?.nom || "?"} idx={cidx} />
                          <div>
                            <p className="text-white font-semibold">{client?.nom}</p>
                            <p className="text-slate-400 text-xs">{client?.contact} · {client?.ville}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-xs">B/L · LTA · AWB</p>
                          <p className="text-white text-sm font-mono font-semibold">{d.bl}</p>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <p className="font-semibold text-slate-800 mb-1">{d.description}</p>
                        <p className="text-sm text-slate-500 mb-4">{d.type}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          {[
                            { label: "Port / Aéroport", value: d.port },
                            { label: "Responsable", value: d.responsable },
                            { label: "Date ouverture", value: d.dateOuverture },
                            { label: "Date échéance", value: d.dateEcheance },
                          ].map(f => (
                            <div key={f.label}>
                              <p className="text-slate-400 mb-0.5">{f.label}</p>
                              <p className="font-semibold text-slate-700">{f.value || "—"}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Prestations */}
                    <Card className="rounded-2xl border-slate-100 shadow-sm">
                      <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold text-slate-700">Détail des prestations</CardTitle></CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-50 border-slate-100">
                              {["Prestation", "Montant HT", "% du total"].map(h => (
                                <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-5">{h}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {d.prestations.map((p, i) => (
                              <TableRow key={i} className="border-slate-50">
                                <TableCell className="pl-5 text-sm text-slate-700">{p.label}</TableCell>
                                <TableCell className="font-semibold text-slate-800 tabular-nums text-sm">{fmt(p.montant)}</TableCell>
                                <TableCell className="pr-5">
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 bg-slate-100 rounded-full w-16 overflow-hidden">
                                      <div className="h-1.5 bg-blue-400 rounded-full" style={{ width: `${Math.round(p.montant / d.montantTotal * 100)}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-400">{Math.round(p.montant / d.montantTotal * 100)}%</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div className="flex justify-between items-center px-5 py-3 border-t border-slate-100 bg-slate-50/60">
                          <span className="text-sm font-bold text-slate-700">Total</span>
                          <span className="text-base font-black text-slate-900 tabular-nums">{fmt(d.montantTotal)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* ── Encaissements reçus ── */}
                    <Card className="rounded-2xl border-slate-100 shadow-sm">
                      <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-semibold text-slate-700">Encaissements reçus du client</CardTitle>
                        <button onClick={() => { setPaiementDossierId(d.id); setPaiementModal(true); }} disabled={reste <= 0}
                          className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${reste > 0 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                          + Ajouter
                        </button>
                      </CardHeader>
                      <CardContent className="p-0">
                        {d.paiements.length === 0 ? (
                          <div className="py-6 text-center text-slate-400 text-sm">Aucun encaissement enregistré</div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-emerald-50/60 border-slate-100">
                                {["Date", "Référence", "Mode", "Montant", ""].map(h => (
                                  <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-5 w-8">{h}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {d.paiements.map((p, i) => (
                                <TableRow key={i} className="border-slate-50 hover:bg-emerald-50/30 group">
                                  <TableCell className="pl-5 text-sm text-slate-600 font-mono">{p.date}</TableCell>
                                  <TableCell className="text-sm text-slate-600 font-mono">{p.ref}</TableCell>
                                  <TableCell><Badge variant="outline" className="text-xs rounded-lg">{p.mode}</Badge></TableCell>
                                  <TableCell className="font-bold text-emerald-600 tabular-nums text-sm">+{fmt(p.montant)}</TableCell>
                                  <TableCell className="pr-3 text-right">
                                    <button
                                      onClick={() => { if (window.confirm("Supprimer cet encaissement de " + fmt(p.montant) + " ?")) supprimerPaiement(d.id, p.id); }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-400 hover:text-rose-600 flex items-center justify-center text-xs"
                                      title="Supprimer cet encaissement">✕</button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                        <div className="flex justify-between items-center px-5 py-2.5 border-t border-slate-100 bg-emerald-50/40">
                          <span className="text-xs text-slate-500">Total encaissé</span>
                          <span className="text-sm font-bold text-emerald-600 tabular-nums">{fmt(paye)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* ── Décaissements ── */}
                    <Card className="rounded-2xl border-slate-100 shadow-sm">
                      <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-sm font-semibold text-slate-700">Décaissements effectués</CardTitle>
                          <p className="text-xs text-slate-400 mt-0.5">Frais réglés pour le traitement du dossier</p>
                        </div>
                        <button onClick={() => { setDecaissementDossierId(d.id); setDecaissementModal(true); }}
                          className="text-xs font-semibold px-3 py-1 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors">
                          − Ajouter
                        </button>
                      </CardHeader>
                      <CardContent className="p-0">
                        {(d.decaissements || []).length === 0 ? (
                          <div className="py-6 text-center text-slate-400 text-sm">Aucun décaissement enregistré</div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-rose-50/50 border-slate-100">
                                {["Catégorie", "Date", "Référence", "Mode", "Montant", "Note", ""].map(h => (
                                  <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-5 w-8">{h}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(d.decaissements || []).map((dec, i) => {
                                const cat = getCatDecaiss(dec.categorie);
                                return (
                                  <TableRow key={i} className="border-slate-50 hover:bg-rose-50/20 group">
                                    <TableCell className="pl-5">
                                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                                        {cat.icon} {cat.label}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500 font-mono">{dec.date}</TableCell>
                                    <TableCell className="text-xs text-slate-500 font-mono">{dec.ref}</TableCell>
                                    <TableCell><Badge variant="outline" className="text-xs rounded-lg">{dec.mode}</Badge></TableCell>
                                    <TableCell className="font-bold text-rose-600 tabular-nums text-sm">−{fmt(dec.montant)}</TableCell>
                                    <TableCell className="text-xs text-slate-400 max-w-[100px] truncate">{dec.note || "—"}</TableCell>
                                    <TableCell className="pr-3 text-right">
                                      <button
                                        onClick={() => { if (window.confirm("Supprimer ce décaissement de " + fmt(dec.montant) + " ?")) supprimerDecaissement(d.id, dec.id); }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-400 hover:text-rose-600 flex items-center justify-center text-xs"
                                        title="Supprimer ce décaissement">✕</button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        )}
                        <div className="flex justify-between items-center px-5 py-2.5 border-t border-slate-100 bg-rose-50/40">
                          <span className="text-xs text-slate-500">Total décaissé</span>
                          <span className="text-sm font-bold text-rose-600 tabular-nums">−{fmt(totalDecaisse(d))}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* ── Solde net (encaissements - décaissements) ── */}
                    {(() => {
                      const solde = soldeDecaisse(d);
                      return (
                        <Card className={`rounded-2xl shadow-sm border ${solde >= 0 ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Solde net du dossier</p>
                                <p className="text-xs text-slate-400">Encaissements − Décaissements</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-2xl font-black tabular-nums ${solde >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                                  {solde >= 0 ? "+" : ""}{fmt(solde)}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">{solde >= 0 ? "Bénéfice sur opérations" : "Déficit sur opérations"}</p>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-slate-200/60 text-xs">
                              {[
                                { label: "Encaissé", value: fmt(paye), color: "text-emerald-600" },
                                { label: "Décaissé", value: fmt(totalDecaisse(d)), color: "text-rose-600" },
                                { label: "Solde net", value: fmt(Math.abs(solde)), color: solde >= 0 ? "text-emerald-700" : "text-rose-700" },
                              ].map(r => (
                                <div key={r.label} className="text-center">
                                  <p className="text-slate-400 mb-0.5">{r.label}</p>
                                  <p className={`font-bold tabular-nums ${r.color}`}>{r.value}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </div>

                  {/* Colonne droite — solde */}
                  <div className="space-y-4">
                    <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                      <div className={`px-5 py-4 ${reste <= 0 ? "bg-emerald-600" : "bg-slate-900"}`}>
                        <p className={`text-xs uppercase tracking-widest mb-1 ${reste <= 0 ? "text-emerald-100" : "text-slate-400"}`}>Situation financière</p>
                        <p className={`text-2xl font-black ${reste <= 0 ? "text-white" : "text-white"}`}>{reste <= 0 ? "Soldé" : fmt(reste)}</p>
                        <p className={`text-xs mt-0.5 ${reste <= 0 ? "text-emerald-200" : "text-slate-400"}`}>{reste <= 0 ? "Paiement complet reçu" : "Reste à percevoir"}</p>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        {[
                          { label: "Montant total", value: fmt(d.montantTotal), color: "text-slate-800" },
                          { label: "Encaissé", value: fmt(paye), color: "text-emerald-600" },
                          { label: "Reste", value: fmt(reste), color: reste > 0 ? "text-rose-500" : "text-emerald-600" },
                        ].map(r => (
                          <div key={r.label} className="flex justify-between text-sm">
                            <span className="text-slate-400">{r.label}</span>
                            <span className={`font-bold tabular-nums ${r.color}`}>{r.value}</span>
                          </div>
                        ))}
                        <div className="pt-2">
                          <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Taux d'encaissement</span><span className="font-semibold text-slate-600">{taux}%</span></div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-3 rounded-full transition-all ${taux >= 100 ? "bg-emerald-400" : taux > 50 ? "bg-amber-400" : "bg-rose-400"}`} style={{ width: `${taux}%` }} />
                          </div>
                        </div>
                        {reste > 0 && (
                          <button
                            onClick={() => { setPaiementDossierId(d.id); setPaiementModal(true); }}
                            className="w-full mt-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm py-2.5 rounded-xl transition-colors">
                            + Enregistrer un paiement
                          </button>
                        )}
                      </CardContent>
                    </Card>

                    {/* Mini résumé décaissements */}
                    <Card className="rounded-2xl border-slate-100 shadow-sm">
                      <div className="bg-rose-600 px-4 py-3 rounded-t-2xl flex justify-between items-center">
                        <p className="text-rose-100 text-xs font-semibold uppercase tracking-widest">Décaissements</p>
                        <p className="text-white text-lg font-black tabular-nums">{fmt(totalDecaisse(d))}</p>
                      </div>
                      <CardContent className="p-4 space-y-1.5">
                        {CATEGORIES_DECAISSEMENT.map(cat => {
                          const montantCat = (d.decaissements || []).filter(x => x.categorie === cat.key).reduce((s, x) => s + x.montant, 0);
                          if (!montantCat) return null;
                          const pctCat = totalDecaisse(d) ? Math.round(montantCat / totalDecaisse(d) * 100) : 0;
                          return (
                            <div key={cat.key} className="flex items-center gap-2">
                              <span className="text-sm shrink-0">{cat.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between text-xs mb-0.5">
                                  <span className="text-slate-600 truncate font-medium">{cat.label}</span>
                                  <span className="text-rose-600 font-semibold tabular-nums shrink-0 ml-2">{(montantCat / 1000).toFixed(0)}k</span>
                                </div>
                                <div className="h-1 bg-slate-100 rounded-full">
                                  <div className="h-1 bg-rose-300 rounded-full" style={{ width: `${pctCat}%` }} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {(d.decaissements || []).length === 0 && (
                          <p className="text-xs text-slate-400 text-center py-2">Aucun décaissement</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Changer statut */}
                    <Card className="rounded-2xl border-slate-100 shadow-sm">
                      <CardHeader className="pb-2"><CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Changer le statut</CardTitle></CardHeader>
                      <CardContent className="p-4 pt-0 grid grid-cols-2 gap-2">
                        {Object.entries(STATUTS_DOSSIER).map(([k, v]) => (
                          <button key={k} onClick={() => changerStatut(d.id, k)}
                            className={`text-xs font-medium px-2 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 ${d.statut === k ? `${v.bg} ${v.border} ${v.color}` : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
                            {v.label}
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ══════════ CLIENTS ══════════ */}
          {vue === "clients" && (() => {
            const CLIENT_TYPES = ["Entreprise", "PME", "Particulier", "ONG", "Administration"];
            const filteredClients = clients.filter(c => {
              const q = clientSearch.toLowerCase();
              const matchQ = !q || `${c.nom} ${c.contact} ${c.ville} ${c.ninea}`.toLowerCase().includes(q);
              const matchT = clientTypeFilter === "all" || c.type === clientTypeFilter;
              return matchQ && matchT;
            });
            const typeCount = CLIENT_TYPES.reduce((acc, t) => { acc[t] = clients.filter(c => c.type === t).length; return acc; }, {});

            return (
              <div className="space-y-4">

                {/* ── Header ── */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">Clients</h1>
                    <p className="text-slate-400 text-sm">{filteredClients.length} affiché(s) sur {clients.length}</p>
                  </div>
                  {hasPermission("client.write") && (<button
                    onClick={() => printTableClients(filteredClients, dossiers, config.entreprise)}
                    className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" /></svg>
                    Imprimer liste
                  </button>
                {hasPermission("client.write") && (
                    <button onClick={ouvrirNouveauClient}
                      className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
                      + Nouveau client
                    </button>
                  )})}
                </div>

                {/* ── Toolbar : search + type + view toggle ── */}
                <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 rounded-2xl p-3">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[180px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                    <input
                      value={clientSearch}
                      onChange={e => setClientSearch(e.target.value)}
                      placeholder="Rechercher client, contact, NINEA…"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 bg-slate-50"
                    />
                  </div>

                  <div className="w-px h-6 bg-slate-200 hidden sm:block" />

                  {/* Type filter pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">Type :</span>
                    <button onClick={() => setClientTypeFilter("all")}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${clientTypeFilter === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>
                      Tous ({clients.length})
                    </button>
                    {CLIENT_TYPES.filter(t => typeCount[t] > 0).map(t => (
                      <button key={t} onClick={() => setClientTypeFilter(clientTypeFilter === t ? "all" : t)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${clientTypeFilter === t ? "bg-amber-400 text-slate-900 border-amber-400 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-700"}`}>
                        {t} <span className={`ml-0.5 ${clientTypeFilter === t ? "text-slate-700" : "text-slate-400"}`}>({typeCount[t]})</span>
                      </button>
                    ))}
                  </div>

                  <div className="w-px h-6 bg-slate-200 hidden sm:block" />

                  {/* Reset */}
                  {(clientSearch || clientTypeFilter !== "all") && (
                    <button onClick={() => { setClientSearch(""); setClientTypeFilter("all"); }}
                      className="text-xs text-slate-400 hover:text-rose-500 font-medium transition-colors flex items-center gap-1">
                      ✕ Réinitialiser
                    </button>
                  )}

                  <div className="ml-auto flex items-center">
                    <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
                      {/* Grid button */}
                      <button onClick={() => setClientView("grid")} title="Vue grille"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${clientView === "grid" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                          <rect x="1" y="1" width="6" height="6" rx="1.5" />
                          <rect x="9" y="1" width="6" height="6" rx="1.5" />
                          <rect x="1" y="9" width="6" height="6" rx="1.5" />
                          <rect x="9" y="9" width="6" height="6" rx="1.5" />
                        </svg>
                      </button>
                      {/* List button */}
                      <button onClick={() => setClientView("list")} title="Vue liste"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${clientView === "list" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                          <line x1="3" y1="4" x2="13" y2="4" />
                          <line x1="3" y1="8" x2="13" y2="8" />
                          <line x1="3" y1="12" x2="13" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ═══ VUE GRILLE ═══ */}
                {clientView === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredClients.length === 0 && (
                      <div className="col-span-3 py-16 text-center">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="text-slate-500 font-medium mb-1">Aucun client trouvé</p>
                        <button onClick={() => { setClientSearch(""); setClientTypeFilter("all"); }} className="text-xs text-amber-600 hover:underline mt-1">Réinitialiser les filtres</button>
                      </div>
                    )}
                    {filteredClients.map((c, i) => {
                      const cidx = clients.findIndex(x => x.id === c.id);
                      const dossiersClient = dossiers.filter(d => d.clientId === c.id);
                      const totalClient = dossiersClient.reduce((s, d) => s + d.montantTotal, 0);
                      const payeClient = dossiersClient.reduce((s, d) => s + totalPaye(d), 0);
                      const resteClient = totalClient - payeClient;
                      const actifs = dossiersClient.filter(d => !["cloture", "annule"].includes(d.statut)).length;
                      return (
                        <Card key={c.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all group">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-3 mb-4">
                              <AvatarCircle name={c.nom} idx={cidx} size="w-11 h-11" text="text-sm" />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 text-sm leading-tight">{c.nom}</p>
                                <p className="text-xs text-slate-500">{c.contact}</p>
                                <Badge variant="outline" className="text-xs mt-1 rounded-lg">{c.type}</Badge>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => ouvrirEditerClient(c)}
                                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-400 flex items-center justify-center text-xs transition-colors" title="Modifier">✏️</button>
                                {hasPermission("client.delete") && <button onClick={() => supprimerClient(c.id)}
                                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-400 flex items-center justify-center text-xs transition-colors" title="Supprimer">🗑</button>}
                              </div>
                            </div>
                            <div className="space-y-1.5 text-xs mb-4">
                              {[
                                { icon: "📍", v: [c.ville, c.adresse].filter(Boolean).join(" — ") || "—" },
                                { icon: "📞", v: c.tel || "—" },
                                { icon: "✉", v: c.email || "—" },
                                { icon: "🏛", v: `NINEA: ${c.ninea || "—"}` },
                                ...(c.rc ? [{ icon: "📋", v: `RC: ${c.rc}` }] : []),
                              ].map(r => (
                                <div key={r.v} className="flex items-center gap-2 text-slate-500"><span>{r.icon}</span><span className="truncate">{r.v}</span></div>
                              ))}
                            </div>
                            {c.note && <p className="text-xs text-slate-400 italic mb-3 border-l-2 border-slate-200 pl-2">{c.note}</p>}
                            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                              {[
                                { label: "Dossiers", value: dossiersClient.length, color: "text-slate-800" },
                                { label: "Actifs", value: actifs, color: "text-blue-600" },
                                { label: "Reste", value: resteClient > 0 ? `${(resteClient / 1000).toFixed(0)}k` : "Soldé", color: resteClient > 0 ? "text-rose-500" : "text-emerald-600" },
                              ].map(s => (
                                <div key={s.label} className="text-center">
                                  <p className="text-xs text-slate-400 mb-0.5">{s.label}</p>
                                  <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => { setFiltreClient(String(c.id)); setVue("dossiers"); }}
                              className="mt-3 w-full text-xs text-slate-400 hover:text-amber-600 font-medium text-center pt-3 border-t border-slate-50 transition-colors">
                              Voir les dossiers →
                            </button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* ═══ VUE LISTE ═══ */}
                {clientView === "list" && (
                  <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50 border-slate-100">
                            {["Client", "Type", "Ville", "Téléphone", "NINEA", "Dossiers", "Reste", ""].map(h => (
                              <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-4 py-3">{h}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredClients.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-10 text-slate-400">Aucun client trouvé</TableCell>
                            </TableRow>
                          )}
                          {filteredClients.map((c, i) => {
                            const cidx = clients.findIndex(x => x.id === c.id);
                            const dossiersClient = dossiers.filter(d => d.clientId === c.id);
                            const totalClient = dossiersClient.reduce((s, d) => s + d.montantTotal, 0);
                            const payeClient = dossiersClient.reduce((s, d) => s + totalPaye(d), 0);
                            const resteClient = totalClient - payeClient;
                            const actifs = dossiersClient.filter(d => !["cloture", "annule"].includes(d.statut)).length;
                            return (
                              <TableRow key={c.id} className="border-slate-50 hover:bg-slate-50/60 group">
                                <TableCell className="pl-5 py-3">
                                  <div className="flex items-center gap-2.5">
                                    <AvatarCircle name={c.nom} idx={cidx} size="w-8 h-8" text="text-xs" />
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-slate-800 truncate">{c.nom}</p>
                                      <p className="text-xs text-slate-400 truncate">{c.contact}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3">
                                  <Badge variant="outline" className="text-xs rounded-lg whitespace-nowrap">{c.type}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-slate-600 py-3">{c.ville || "—"}</TableCell>
                                <TableCell className="text-sm text-slate-600 font-mono py-3 whitespace-nowrap">{c.tel || "—"}</TableCell>
                                <TableCell className="text-xs text-slate-500 font-mono py-3">{c.ninea || "—"}</TableCell>
                                <TableCell className="py-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-bold text-slate-800">{dossiersClient.length}</span>
                                    {actifs > 0 && <span className="text-xs text-blue-600 font-medium">({actifs} actifs)</span>}
                                  </div>
                                </TableCell>
                                <TableCell className="py-3">
                                  <span className={`text-sm font-bold tabular-nums ${resteClient > 0 ? "text-rose-500" : "text-emerald-600"}`}>
                                    {resteClient > 0 ? `${(resteClient / 1000).toFixed(0)}k FCFA` : "Soldé"}
                                  </span>
                                </TableCell>
                                <TableCell className="pr-4 py-3">
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setFiltreClient(String(c.id)); setVue("dossiers"); }}
                                      className="text-xs font-medium px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors whitespace-nowrap">
                                      Dossiers
                                    </button>
                                    <button onClick={() => ouvrirEditerClient(c)}
                                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-400 flex items-center justify-center text-xs transition-colors">✏️</button>
                                    {hasPermission("client.delete") && <button onClick={() => supprimerClient(c.id)}
                                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-400 flex items-center justify-center text-xs transition-colors">🗑</button>}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                      {filteredClients.length > 0 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-50 bg-slate-50/50 text-xs text-slate-400">
                          <span>{filteredClients.length} client{filteredClients.length > 1 ? "s" : ""}</span>
                          <span>
                            Total reste : <span className="font-semibold text-rose-500">
                              {fmt(filteredClients.reduce((s, c) => s + (dossiers.filter(d => d.clientId === c.id).reduce((ss, d) => ss + resteApayer(d), 0)), 0))}
                            </span>
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })()}

          {/* ══════════ ACCESS DENIED (non-admin trying to reach config) ══════════ */}
          {vue === "configuration" && !isAdmin && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
              <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center text-4xl mb-5 shadow-sm">🔒</div>
              <h2 className={`text-2xl font-black mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>Accès refusé</h2>
              <p className="text-slate-400 text-sm mb-1">Cette section est réservée aux <span className="font-semibold text-amber-500">Administrateurs</span>.</p>
              <p className="text-slate-400 text-sm mb-6">Votre rôle actuel : <span className={`font-semibold ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{authUser?.role}</span></p>
              <div className={`rounded-2xl border p-5 max-w-sm w-full mb-6 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Vos permissions actuelles</p>
                <div className="space-y-2">
                  {[
                    { label: "Tableau de bord", ok: true },
                    { label: "Gestion dossiers", ok: true },
                    { label: "Gestion clients", ok: true },
                    { label: "Décaissements", ok: true },
                    { label: "Voir les soldes", ok: false },
                    { label: "Configuration app", ok: false },
                    { label: "Gestion personnel", ok: false },
                  ].map(p => (
                    <div key={p.label} className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{p.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>
                        {p.ok ? "✓ Autorisé" : "✕ Refusé"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setVue("dashboard")}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
                ← Retour au tableau de bord
              </button>
            </div>
          )}

          {/* ══════════ CONFIGURATION (admin only) ══════════ */}
          {vue === "configuration" && isAdmin && (
            <div className="space-y-5">

              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Configuration</h1>
                  <p className="text-slate-400 text-sm">Paramètres de l'application TransitPro</p>
                </div>
                <button onClick={saveConfig}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-5 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-2">
                  {configSaved ? "✓ Sauvegardé !" : "💾 Sauvegarder"}
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 flex-wrap">
                {[
                  { key: "entreprise", icon: "🏢", label: "Entreprise" },
                  { key: "utilisateur", icon: "👤", label: "Mon profil" },
                  { key: "preferences", icon: "🎛️", label: "Préférences" },
                  { key: "equipe", icon: "👥", label: "Équipe" },
                  { key: "listes", icon: "📋", label: "Listes & codes" },
                  { key: "permissions", icon: "🔑", label: "Permissions" },
                ].map(t => (
                  <button key={t.key} onClick={() => setConfigTab(t.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${configTab === t.key ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}>
                    <span>{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>

              {/* ── Tab: Entreprise ── */}
              {configTab === "entreprise" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 space-y-4">
                    <Card className="rounded-2xl border-slate-100 shadow-sm">
                      <CardHeader className="pb-3 border-b border-slate-50">
                        <CardTitle className="text-sm font-semibold text-slate-700">Identité de la société</CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Raison sociale</label>
                            <Input value={config.entreprise.nom} onChange={e => setConf("entreprise", "nom", e.target.value)} className="rounded-xl font-semibold text-slate-800" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Slogan</label>
                            <Input value={config.entreprise.slogan} onChange={e => setConf("entreprise", "slogan", e.target.value)} className="rounded-xl" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Adresse</label>
                            <Input value={config.entreprise.adresse} onChange={e => setConf("entreprise", "adresse", e.target.value)} className="rounded-xl" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ville</label>
                            <Input value={config.entreprise.ville} onChange={e => setConf("entreprise", "ville", e.target.value)} className="rounded-xl" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Téléphone</label>
                            <Input value={config.entreprise.tel} onChange={e => setConf("entreprise", "tel", e.target.value)} className="rounded-xl" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                            <Input type="email" value={config.entreprise.email} onChange={e => setConf("entreprise", "email", e.target.value)} className="rounded-xl" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Site web</label>
                            <Input value={config.entreprise.site} onChange={e => setConf("entreprise", "site", e.target.value)} className="rounded-xl" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-slate-100 shadow-sm">
                      <CardHeader className="pb-3 border-b border-slate-50">
                        <CardTitle className="text-sm font-semibold text-slate-700">Identifiants légaux</CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "NINEA", key: "ninea" },
                            { label: "RCCM", key: "rc" },
                            { label: "Agrément DGD", key: "agrement" },
                          ].map(f => (
                            <div key={f.key}>
                              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                              <Input value={config.entreprise[f.key] || ""} onChange={e => setConf("entreprise", f.key, e.target.value)} className="rounded-xl font-mono text-sm" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Aperçu */}
                  <div>
                    <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden sticky top-6">
                      <div className="bg-slate-900 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
                            <span className="text-slate-900 font-black text-lg">T</span>
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{config.entreprise.nom}</p>
                            <p className="text-slate-400 text-xs">{config.entreprise.slogan}</p>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-2 text-xs text-slate-500">
                        <p>📍 {config.entreprise.adresse}</p>
                        <p>🏙 {config.entreprise.ville}</p>
                        <p>📞 {config.entreprise.tel}</p>
                        <p>✉ {config.entreprise.email}</p>
                        <p>🌐 {config.entreprise.site}</p>
                        <div className="border-t border-slate-100 pt-3 mt-3 space-y-1 font-mono">
                          <p className="text-slate-400">NINEA : <span className="text-slate-700">{config.entreprise.ninea}</span></p>
                          <p className="text-slate-400">RCCM : <span className="text-slate-700">{config.entreprise.rc}</span></p>
                          <p className="text-slate-400">Agr. : <span className="text-slate-700">{config.entreprise.agrement}</span></p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* ── Tab: Informations personnelles (personnel) ── */}
              {configTab === "utilisateur" && (() => {
                const ROLES_LIST = ["Administrateur", "Transitaire", "Agent douanier", "Comptable", "Commercial", "Directeur", "Stagiaire"];
                const POSTES_LIST = ["Transitaire senior", "Transitaire", "Agent douanier", "Comptable", "Commercial", "DG", "DGA", "Secrétaire", "Chauffeur", "Coursier", "Stagiaire"];
                const DEPT_LIST = ["Direction", "Transit", "Douane", "Finance", "Commercial", "Logistique", "RH", "Informatique"];

                const filteredP = personnel.filter(p => {
                  const matchSearch = !searchP || `${p.prenom} ${p.nom} ${p.poste} ${p.role} ${p.dept}`.toLowerCase().includes(searchP.toLowerCase());
                  const matchRole = filterRole === "all" || p.role === filterRole;
                  const matchDept = filterDept === "all" || p.dept === filterDept;
                  const matchActif = filterActif === "all" || (filterActif === "actif" ? p.actif : !p.actif);
                  return matchSearch && matchRole && matchDept && matchActif;
                });

                // Stats per role for the access list
                const roleStats = ROLES_LIST.reduce((acc, r) => {
                  acc[r] = personnel.filter(p => p.role === r).length;
                  return acc;
                }, {});
                const deptStats = DEPT_LIST.reduce((acc, d) => {
                  acc[d] = personnel.filter(p => p.dept === d).length;
                  return acc;
                }, {});

                const computeAvatar = (prenom, nom) =>
                  ((prenom[0] || "") + (nom[0] || "")).toUpperCase();

                const openAdd = () => {
                  setForm({ ...EMPTY_PERS });
                  setEditId(null); setErrors({});
                  setShowForm(true);
                  setTimeout(() => document.getElementById("pers-form-top")?.scrollIntoView({ behavior: "smooth" }), 100);
                };
                const openEdit = (p) => {
                  setForm({ ...p });
                  setEditId(p.id); setErrors({});
                  setShowForm(true);
                  setTimeout(() => document.getElementById("pers-form-top")?.scrollIntoView({ behavior: "smooth" }), 100);
                };
                const cancelForm = () => { setShowForm(false); setForm(EMPTY_PERS); setEditId(null); setErrors({}); };

                const setF = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })); };

                const validate = () => {
                  const e = {};
                  if (!form.prenom.trim()) e.prenom = "Requis";
                  if (!form.nom.trim()) e.nom = "Requis";
                  if (!form.poste.trim()) e.poste = "Requis";
                  if (!form.tel.trim()) e.tel = "Requis";
                  if (form.email && !/S+@S+.S+/.test(form.email)) e.email = "Email invalide";
                  const dupEmail = personnel.some(p => p.email === form.email.trim() && p.id !== editId && form.email.trim());
                  if (dupEmail) e.email = "Email déjà utilisé";
                  return e;
                };

                const submitForm = () => {
                  const e = validate();
                  if (Object.keys(e).length) { setErrors(e); return; }
                  const avatar = form.avatar || computeAvatar(form.prenom, form.nom);
                  const saved = { ...form, avatar, prenom: form.prenom.trim(), nom: form.nom.trim() };
                  if (editId !== null) {
                    setPersonnel(prev => prev.map(p => p.id === editId ? { ...saved, id: editId } : p));
                  } else {
                    const newId = Math.max(0, ...personnel.map(p => p.id || 0)) + 1;
                    setPersonnel(prev => [...prev, { ...saved, id: newId }]);
                  }
                  cancelForm();
                };

                const toggleActif = (id) =>
                  setPersonnel(prev => prev.map(p => p.id === id ? { ...p, actif: !p.actif } : p));
                const deletePers = (id) => {
                  if (window.confirm("Supprimer ce personnel ?"))
                    setPersonnel(prev => prev.filter(p => p.id !== id));
                };

                const AVATAR_PALETTE = [
                  "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700",
                  "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700",
                  "bg-violet-100 text-violet-700", "bg-teal-100 text-teal-700",
                  "bg-orange-100 text-orange-700", "bg-indigo-100 text-indigo-700",
                ];

                return (
                  <div className="space-y-5">

                    {/* ══ Header ══ */}
                    <div className="space-y-3">
                      {/* Title + Add button */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <h2 className="text-base font-bold text-slate-800">Informations personnelles</h2>
                          <p className="text-slate-400 text-xs mt-0.5">
                            {filteredP.length} affiché(s) sur {personnel.length} · {personnel.filter(p => p.actif).length} actifs
                          </p>
                        </div>
                        <button onClick={openAdd}
                          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
                          <span className="text-base leading-none">＋</span>
                          Nouveau personnel
                        </button>
                      </div>

                      {/* ── Filtres barre ── */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center gap-2">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[160px]">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                          <input value={searchP} onChange={e => setSearchP(e.target.value)}
                            placeholder="Rechercher nom, poste…"
                            className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 w-full bg-slate-50" />
                        </div>

                        {/* Séparateur */}
                        <div className="w-px h-6 bg-slate-200 hidden sm:block" />

                        {/* Filtre Rôle */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">Rôle :</span>
                          <button onClick={() => setFilterRole("all")}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${filterRole === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>
                            Tous ({personnel.length})
                          </button>
                          {ROLES_LIST.filter(r => roleStats[r] > 0).map(r => (
                            <button key={r} onClick={() => setFilterRole(filterRole === r ? "all" : r)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${filterRole === r ? "bg-amber-400 text-slate-900 border-amber-400 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-700"}`}>
                              {r} <span className={`ml-0.5 ${filterRole === r ? "text-slate-700" : "text-slate-400"}`}>({roleStats[r]})</span>
                            </button>
                          ))}
                        </div>

                        {/* Séparateur */}
                        <div className="w-px h-6 bg-slate-200 hidden sm:block" />

                        {/* Filtre Département */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">Dept :</span>
                          <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
                            className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400 bg-white text-slate-600 font-medium">
                            <option value="all">Tous les depts</option>
                            {DEPT_LIST.filter(d => deptStats[d] > 0).map(d => (
                              <option key={d} value={d}>{d} ({deptStats[d]})</option>
                            ))}
                          </select>
                        </div>

                        {/* Filtre Statut */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">Statut :</span>
                          {[
                            { v: "all", label: "Tous", cls: "bg-white text-slate-500 border-slate-200" },
                            { v: "actif", label: "Actifs", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                            { v: "inactif", label: "Inactifs", cls: "bg-rose-50 text-rose-600 border-rose-200" },
                          ].map(opt => (
                            <button key={opt.v} onClick={() => setFilterActif(opt.v)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${filterActif === opt.v ? opt.cls + " shadow-sm ring-1 ring-offset-0 ring-current" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"}`}>
                              {opt.label}
                            </button>
                          ))}
                        </div>

                        {/* Reset filters */}
                        {(filterRole !== "all" || filterDept !== "all" || filterActif !== "all" || searchP) && (
                          <button onClick={() => { setFilterRole("all"); setFilterDept("all"); setFilterActif("all"); setSearchP(""); }}
                            className="ml-auto text-xs text-slate-400 hover:text-rose-500 font-medium transition-colors flex items-center gap-1">
                            ✕ Réinitialiser
                          </button>
                        )}
                      </div>

                      {/* ── Access list par rôle (résumé visuel) ── */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                        {ROLES_LIST.map(r => {
                          const count = personnel.filter(p => p.role === r).length;
                          const actifs = personnel.filter(p => p.role === r && p.actif).length;
                          const isActive = filterRole === r;
                          return (
                            <button key={r} onClick={() => setFilterRole(isActive ? "all" : r)}
                              className={`p-3 rounded-xl border text-left transition-all ${isActive ? "border-amber-400 bg-amber-50 shadow-sm" : "border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/40"}`}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`text-lg font-black leading-none ${isActive ? "text-amber-600" : "text-slate-700"}`}>{count}</span>
                                {actifs > 0 && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title={`${actifs} actif(s)`} />
                                )}
                              </div>
                              <p className={`text-xs font-semibold leading-tight truncate ${isActive ? "text-amber-700" : "text-slate-600"}`}>{r}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{actifs} actif{actifs > 1 ? "s" : ""}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ══ Grille des personnel ══ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredP.map((p, i) => (
                        <Card key={p.id} className={`rounded-2xl shadow-sm transition-all group hover:shadow-md ${!p.actif ? "opacity-60" : ""} border-slate-100`}>
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 ${AVATAR_PALETTE[i % AVATAR_PALETTE.length]}`}>
                                  {p.avatar || computeAvatar(p.prenom, p.nom)}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-800 text-sm leading-tight">{p.prenom} {p.nom}</p>
                                  <p className="text-xs text-slate-500 mt-0.5">{p.poste}</p>
                                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{p.role}</span>
                                    {p.dept && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">{p.dept}</span>}
                                  </div>
                                </div>
                              </div>
                              {/* Actif toggle */}
                              <button onClick={() => toggleActif(p.id)}
                                className={`shrink-0 w-10 h-5 rounded-full transition-all relative mt-1 ${p.actif ? "bg-emerald-500" : "bg-slate-300"}`}>
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.actif ? "left-5" : "left-0.5"}`} />
                              </button>
                            </div>

                            {/* Infos contact */}
                            <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                              {p.tel && <div className="flex items-center gap-2"><span>📞</span><span>{p.tel}</span></div>}
                              {p.email && <div className="flex items-center gap-2"><span>✉</span><span className="truncate">{p.email}</span></div>}
                              {p.adresse && <div className="flex items-center gap-2"><span>📍</span><span className="truncate">{p.adresse}</span></div>}
                              {p.dateEmbauche && <div className="flex items-center gap-2"><span>📅</span><span>Embauché le {p.dateEmbauche}</span></div>}
                            </div>

                            {p.note && (
                              <p className="text-xs text-slate-400 italic border-l-2 border-slate-200 pl-2 mb-3 line-clamp-2">{p.note}</p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-slate-100">
                              <button onClick={() => openEdit(p)}
                                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors">
                                ✏️ Modifier
                              </button>
                              <button onClick={() => deletePers(p.id)}
                                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-400 flex items-center justify-center text-sm transition-colors"
                                title="Supprimer">🗑</button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {filteredP.length === 0 && (
                        <div className="col-span-3 py-16 text-center">
                          <p className="text-4xl mb-3">👤</p>
                          <p className="text-slate-500 font-medium mb-1">Aucun personnel trouvé</p>
                          <p className="text-slate-400 text-sm mb-4">Ajoutez votre premier membre du personnel</p>
                          <button onClick={openAdd} className="text-sm font-bold px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 transition-colors">
                            + Ajouter un personnel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ══ Formulaire d'ajout / édition ══ */}
                    {showForm && (
                      <Card id="pers-form-top" className={`rounded-2xl shadow-md border-2 transition-all ${editId !== null ? "border-blue-300 bg-blue-50/20" : "border-amber-300 bg-amber-50/20"}`}>
                        <CardHeader className="pb-4 border-b border-slate-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${AVATAR_PALETTE[(personnel.length) % AVATAR_PALETTE.length]}`}>
                                {form.prenom && form.nom ? computeAvatar(form.prenom, form.nom) : "??"}
                              </div>
                              <div>
                                <CardTitle className="text-base font-bold text-slate-800">
                                  {editId !== null
                                    ? `Modifier : ${form.prenom} ${form.nom}`
                                    : "Nouveau personnel"}
                                </CardTitle>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {editId !== null ? "Mettre à jour les informations" : "Remplissez le formulaire d'inscription"}
                                </p>
                              </div>
                            </div>
                            <button onClick={cancelForm}
                              className="text-slate-400 hover:text-slate-700 text-xl transition-colors leading-none" title="Fermer">✕</button>
                          </div>
                        </CardHeader>

                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* ── Colonne 1 : Identité ── */}
                            <div className="space-y-4">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-5 h-5 bg-amber-400 rounded-lg flex items-center justify-center text-slate-900 font-black text-xs">1</span>
                                Identité
                              </p>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Prénom *</label>
                                  <Input value={form.prenom} onChange={e => setF("prenom", e.target.value)}
                                    placeholder="ex: Aminata"
                                    className={`rounded-xl ${errors.prenom ? "border-rose-400" : ""}`} />
                                  {errors.prenom && <p className="text-xs text-rose-500 mt-1">⚠ {errors.prenom}</p>}
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nom *</label>
                                  <Input value={form.nom} onChange={e => setF("nom", e.target.value)}
                                    placeholder="ex: Diallo"
                                    className={`rounded-xl ${errors.nom ? "border-rose-400" : ""}`} />
                                  {errors.nom && <p className="text-xs text-rose-500 mt-1">⚠ {errors.nom}</p>}
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Poste *</label>
                                <Select value={form.poste} onValueChange={v => setF("poste", v)}>
                                  <SelectTrigger className={`rounded-xl ${errors.poste ? "border-rose-400" : ""}`}><SelectValue placeholder="Sélectionner un poste…" /></SelectTrigger>
                                  <SelectContent>
                                    {POSTES_LIST.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    <SelectItem value="__custom__">Autre (saisir manuellement)</SelectItem>
                                  </SelectContent>
                                </Select>
                                {form.poste === "__custom__" && (
                                  <Input className="rounded-xl mt-2" placeholder="Saisir le poste…"
                                    onChange={e => setF("poste", e.target.value)} />
                                )}
                                {errors.poste && <p className="text-xs text-rose-500 mt-1">⚠ {errors.poste}</p>}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Rôle / Accès</label>
                                  <Select value={form.role} onValueChange={v => setF("role", v)}>
                                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>{ROLES_LIST.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Département</label>
                                  <Select value={form.dept} onValueChange={v => setF("dept", v)}>
                                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>{DEPT_LIST.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Date d'embauche</label>
                                  <Input type="date" value={form.dateEmbauche} onChange={e => setF("dateEmbauche", e.target.value)} className="rounded-xl text-sm" />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Initiales avatar
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${AVATAR_PALETTE[(personnel.length) % AVATAR_PALETTE.length]}`}>
                                      {form.avatar || (form.prenom && form.nom ? computeAvatar(form.prenom, form.nom) : "??")}
                                    </div>
                                    <Input maxLength={2}
                                      value={form.avatar}
                                      onChange={e => setF("avatar", e.target.value.toUpperCase())}
                                      placeholder={form.prenom && form.nom ? computeAvatar(form.prenom, form.nom) : "??"}
                                      className="rounded-xl font-mono font-bold text-center text-base w-16" />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Adresse</label>
                                <Input value={form.adresse} onChange={e => setF("adresse", e.target.value)}
                                  placeholder="ex: 12 Rue de Thiong, Dakar" className="rounded-xl" />
                              </div>

                              {/* Statut actif */}
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <div>
                                  <p className="text-sm font-semibold text-slate-700">Compte actif</p>
                                  <p className="text-xs text-slate-400">Peut se connecter à l'application</p>
                                </div>
                                <button onClick={() => setF("actif", !form.actif)}
                                  className={`w-12 h-6 rounded-full transition-all relative ${form.actif ? "bg-emerald-500" : "bg-slate-300"}`}>
                                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.actif ? "left-6" : "left-0.5"}`} />
                                </button>
                              </div>
                            </div>

                            {/* ── Colonne 2 : Contact & Accès ── */}
                            <div className="space-y-4">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-5 h-5 bg-amber-400 rounded-lg flex items-center justify-center text-slate-900 font-black text-xs">2</span>
                                Contact & accès
                              </p>

                              <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Téléphone *</label>
                                <Input value={form.tel} onChange={e => setF("tel", e.target.value)}
                                  placeholder="+221 77 000 0000"
                                  className={`rounded-xl ${errors.tel ? "border-rose-400" : ""}`} />
                                {errors.tel && <p className="text-xs text-rose-500 mt-1">⚠ {errors.tel}</p>}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                                <Input type="email" value={form.email} onChange={e => setF("email", e.target.value)}
                                  placeholder="prenom.nom@transitpro.sn"
                                  className={`rounded-xl ${errors.email ? "border-rose-400" : ""}`} />
                                {errors.email && <p className="text-xs text-rose-500 mt-1">⚠ {errors.email}</p>}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                  Mot de passe {editId === null ? "*" : "(laisser vide pour ne pas changer)"}
                                </label>
                                <Input type="password" value={form.password} onChange={e => setF("password", e.target.value)}
                                  placeholder="••••••••" className="rounded-xl" />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Note interne</label>
                                <textarea
                                  value={form.note}
                                  onChange={e => setF("note", e.target.value)}
                                  rows={3}
                                  placeholder="Compétences, observations, remarques…"
                                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 resize-none text-slate-700 placeholder-slate-400"
                                />
                              </div>

                              {/* Aperçu carte */}
                              <div className="bg-white border border-slate-200 rounded-2xl p-4">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Aperçu de la fiche</p>
                                <div className="flex items-center gap-3">
                                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${AVATAR_PALETTE[(personnel.length) % AVATAR_PALETTE.length]}`}>
                                    {form.avatar || (form.prenom && form.nom ? computeAvatar(form.prenom, form.nom) : "??")}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 text-sm">{form.prenom || "Prénom"} {form.nom || "Nom"}</p>
                                    <p className="text-xs text-slate-500">{form.poste || "Poste"} · {form.dept}</p>
                                    <div className="flex gap-1.5 mt-1 flex-wrap">
                                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{form.role}</span>
                                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${form.actif ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                                        {form.actif ? "Actif" : "Inactif"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {(form.tel || form.email) && (
                                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                                    {form.tel && <p>📞 {form.tel}</p>}
                                    {form.email && <p>✉ {form.email}</p>}
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex gap-3">
                                <button onClick={submitForm}
                                  className={`flex-1 font-bold text-sm py-3 rounded-xl transition-colors shadow-sm ${editId !== null ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-amber-400 hover:bg-amber-500 text-slate-900"}`}>
                                  {editId !== null ? "✏️ Mettre à jour" : "＋ Enregistrer le personnel"}
                                </button>
                                <button onClick={cancelForm}
                                  className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 transition-colors font-medium">
                                  Annuler
                                </button>
                              </div>
                            </div>

                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                );
              })()}

              {/* ── Tab: Préférences ── */}
              {configTab === "preferences" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="pb-3 border-b border-slate-50">
                      <CardTitle className="text-sm font-semibold text-slate-700">Paramètres financiers</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                      {[
                        { label: "Devise", key: "devise", type: "select", opts: ["FCFA", "EUR", "USD", "GBP"] },
                        { label: "Taux TVA (%)", key: "tauxTVA", type: "number" },
                        { label: "Délai de paiement (jours)", key: "delaiPaiement", type: "number" },
                        { label: "Alerte échéance (jours avant)", key: "alerteEcheance", type: "number" },
                      ].map(f => (
                        <div key={f.key}>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{f.label}</label>
                          {f.type === "select" ? (
                            <Select value={String(config.preferences[f.key])} onValueChange={v => setConf("preferences", f.key, v)}>
                              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                              <SelectContent>{f.opts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                            </Select>
                          ) : (
                            <Input type="number" value={config.preferences[f.key]} onChange={e => setConf("preferences", f.key, parseInt(e.target.value))} className="rounded-xl" />
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="pb-3 border-b border-slate-50">
                      <CardTitle className="text-sm font-semibold text-slate-700">Interface & notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Format date</label>
                        <Select value={config.preferences.dateFormat} onValueChange={v => setConf("preferences", "dateFormat", v)}>
                          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Notifications</label>
                        <div className="space-y-3">
                          {[
                            { key: "notifEmail", label: "Alertes par email", desc: "Recevoir les alertes d'échéance par email" },
                            { key: "notifSMS", label: "Alertes SMS", desc: "Recevoir les alertes par SMS (surcoût opérateur)" },
                            { key: "signatureAuto", label: "Signature automatique", desc: "Ajouter la signature sur les documents générés" },
                          ].map(n => (
                            <div key={n.key} className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl">
                              <div>
                                <p className="text-sm font-medium text-slate-700">{n.label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                              </div>
                              <button
                                onClick={() => setConf("preferences", n.key, !config.preferences[n.key])}
                                className={`w-11 h-6 rounded-full transition-all shrink-0 relative ${config.preferences[n.key] ? "bg-emerald-500" : "bg-slate-300"}`}>
                                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${config.preferences[n.key] ? "left-5" : "left-0.5"}`} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ── Apparence ── */}
                  <Card className="rounded-2xl border-slate-100 shadow-sm lg:col-span-2">
                    <CardHeader className="pb-3 border-b border-slate-50">
                      <CardTitle className="text-sm font-semibold text-slate-700">Apparence & confidentialité</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Dark / Light mode */}
                        <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${darkMode ? "bg-slate-800 text-amber-400" : "bg-slate-100 text-slate-600"}`}>
                              {darkMode ? "🌙" : "☀️"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">Thème de l'interface</p>
                              <p className="text-xs text-slate-400">Mode actuel : {darkMode ? "sombre" : "clair"}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setDarkMode(false)}
                              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${!darkMode ? "bg-amber-400 text-slate-900 border-amber-400 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>
                              <span>☀️</span> Mode clair
                            </button>
                            <button onClick={() => setDarkMode(true)}
                              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${darkMode ? "bg-slate-900 text-white border-slate-900 shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>
                              <span>🌙</span> Mode sombre
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 text-center">Vous pouvez aussi basculer depuis le dashboard</p>
                        </div>

                        {/* Show / Hide solde */}
                        <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${showSolde ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                              {showSolde ? "👁" : "🙈"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">Visibilité des soldes</p>
                              <p className="text-xs text-slate-400">Masque les montants financiers</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div>
                              <p className="text-sm font-medium text-slate-700">{showSolde ? "Soldes visibles" : "Soldes masqués"}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {showSolde ? "Les montants sont affichés en clair" : "Les montants apparaissent comme ••••••"}
                              </p>
                            </div>
                            <button onClick={() => setShowSolde(s => !s)}
                              className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${showSolde ? "bg-emerald-500" : "bg-slate-300"}`}>
                              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${showSolde ? "left-6" : "left-0.5"}`} />
                            </button>
                          </div>
                          {/* Aperçu */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {["Total facturé", "Encaissements", "Décaissements", "Solde net"].map(lbl => (
                              <div key={lbl} className="bg-white border border-slate-100 rounded-xl px-3 py-2">
                                <p className="text-xs text-slate-400">{lbl}</p>
                                <p className="text-sm font-bold text-slate-700 tabular-nums">{showSolde ? "1 250 000 FCFA" : "••••••"}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ── Tab: Équipe ── */}
              {configTab === "equipe" && (
                <div className="space-y-4">
                  <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-slate-700">Responsables de dossiers</CardTitle>
                      <button
                        onClick={() => setConfig(c => ({ ...c, responsables: [...c.responsables, { id: Date.now(), nom: "", poste: "", tel: "", actif: true }] }))}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 transition-colors">
                        + Ajouter
                      </button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50 border-slate-100">
                            {["Nom", "Poste", "Téléphone", "Statut", ""].map(h => (
                              <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-5">{h}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {config.responsables.map((r, i) => (
                            <TableRow key={r.id} className="border-slate-50">
                              <TableCell className="pl-5">
                                <Input value={r.nom} onChange={e => setConfig(c => ({ ...c, responsables: c.responsables.map((x, j) => j === i ? { ...x, nom: e.target.value } : x) }))}
                                  className="h-8 rounded-lg text-sm border-slate-200 w-40" placeholder="Nom complet" />
                              </TableCell>
                              <TableCell>
                                <Input value={r.poste} onChange={e => setConfig(c => ({ ...c, responsables: c.responsables.map((x, j) => j === i ? { ...x, poste: e.target.value } : x) }))}
                                  className="h-8 rounded-lg text-sm border-slate-200 w-36" placeholder="Poste" />
                              </TableCell>
                              <TableCell>
                                <Input value={r.tel} onChange={e => setConfig(c => ({ ...c, responsables: c.responsables.map((x, j) => j === i ? { ...x, tel: e.target.value } : x) }))}
                                  className="h-8 rounded-lg text-sm border-slate-200 w-36 font-mono" placeholder="+221 77..." />
                              </TableCell>
                              <TableCell>
                                <button
                                  onClick={() => setConfig(c => ({ ...c, responsables: c.responsables.map((x, j) => j === i ? { ...x, actif: !x.actif } : x) }))}
                                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${r.actif ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                                  {r.actif ? "Actif" : "Inactif"}
                                </button>
                              </TableCell>
                              <TableCell className="pr-5">
                                <button onClick={() => setConfig(c => ({ ...c, responsables: c.responsables.filter((_, j) => j !== i) }))}
                                  className="text-slate-300 hover:text-rose-500 transition-colors text-xs">✕</button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ── Tab: Listes & codes ── */}
              {configTab === "listes" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                  {/* Types de prestation */}
                  <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Types de prestation</CardTitle>
                      <button onClick={() => setConfig(c => ({ ...c, typesPrestation: [...c.typesPrestation, "Nouveau type"] }))}
                        className="text-xs text-amber-600 hover:text-amber-800 font-semibold">+ Ajouter</button>
                    </CardHeader>
                    <CardContent className="p-3 space-y-1.5 max-h-72 overflow-y-auto">
                      {config.typesPrestation.map((t, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input value={t} onChange={e => setConfig(c => ({ ...c, typesPrestation: c.typesPrestation.map((x, j) => j === i ? e.target.value : x) }))}
                            className="h-7 rounded-lg text-xs flex-1 border-slate-200" />
                          <button onClick={() => setConfig(c => ({ ...c, typesPrestation: c.typesPrestation.filter((_, j) => j !== i) }))}
                            className="text-slate-300 hover:text-rose-400 text-xs shrink-0">✕</button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Modes de paiement */}
                  <Card className="rounded-2xl border-slate-100 shadow-sm">
                    <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Modes de paiement</CardTitle>
                      <button onClick={() => setConfig(c => ({ ...c, modesPaiement: [...c.modesPaiement, "Nouveau mode"] }))}
                        className="text-xs text-amber-600 hover:text-amber-800 font-semibold">+ Ajouter</button>
                    </CardHeader>
                    <CardContent className="p-3 space-y-1.5">
                      {config.modesPaiement.map((m, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input value={m} onChange={e => setConfig(c => ({ ...c, modesPaiement: c.modesPaiement.map((x, j) => j === i ? e.target.value : x) }))}
                            className="h-7 rounded-lg text-xs flex-1 border-slate-200" />
                          <button onClick={() => setConfig(c => ({ ...c, modesPaiement: c.modesPaiement.filter((_, j) => j !== i) }))}
                            className="text-slate-300 hover:text-rose-400 text-xs shrink-0">✕</button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Catégories décaissement — full JSON form */}
                  {(() => {
                    const ICONS_OPTIONS = ["⚓", "🏛", "📄", "🚛", "🏭", "⏱", "⚠️", "📊", "🏢", "🚢", "✈️", "📦", "💸", "🔧", "📋", "🔑", "🎯", "📌", "🌊", "🔩", "📉", "🧾", "🛃", "🛂", "🏷", "💰", "🗂", "📑"];
                    const COLOR_OPTIONS = [
                      { label: "Bleu", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
                      { label: "Violet", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
                      { label: "Ambre", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
                      { label: "Teal", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
                      { label: "Orange", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
                      { label: "Rose", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
                      { label: "Rouge", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
                      { label: "Indigo", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
                      { label: "Émeraude", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
                      { label: "Cyan", color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
                      { label: "Vert", color: "text-lime-600", bg: "bg-lime-50", border: "border-lime-200" },
                      { label: "Ardoise", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" },
                    ];


                    const openAdd = () => { setCatForm(EMPTY_CAT_FORM); setEditIdx(null); setCatFormErr({}); };
                    const openEdit = (cat, i) => { setCatForm({ ...cat }); setEditIdx(i); setCatFormErr({}); };

                    const applyColorToForm = (opt) =>
                      setCatForm(f => ({ ...f, color: opt.color, bg: opt.bg, border: opt.border }));

                    const validateCatForm = () => {
                      const e = {};
                      if (!catForm.key.trim()) e.key = "Requis";
                      if (!catForm.label.trim()) e.label = "Requis";
                      const duplicate = config.categoriesDecaiss.some((c, i) => c.key === catForm.key.trim() && i !== editIdx);
                      if (duplicate) e.key = "Ce code existe déjà";
                      return e;
                    };

                    const submitCatForm = () => {
                      const e = validateCatForm();
                      if (Object.keys(e).length) { setCatFormErr(e); return; }
                      const cat = { ...catForm, key: catForm.key.trim(), label: catForm.label.trim() };
                      if (editIdx !== null) {
                        setConfig(c => ({ ...c, categoriesDecaiss: c.categoriesDecaiss.map((x, j) => j === editIdx ? cat : x) }));
                      } else {
                        setConfig(c => ({ ...c, categoriesDecaiss: [...c.categoriesDecaiss, cat] }));
                      }
                      setCatForm(EMPTY_CAT_FORM); setEditIdx(null); setCatFormErr({});
                    };

                    const deleteCat = (i) => {
                      if (window.confirm('Supprimer "' + config.categoriesDecaiss[i].label + '" ?'))
                        setConfig(c => ({ ...c, categoriesDecaiss: c.categoriesDecaiss.filter((_, j) => j !== i) }));
                    };

                    const jsonPreview = JSON.stringify({ key: catForm.key || "…", label: catForm.label || "…", icon: catForm.icon, color: catForm.color, bg: catForm.bg, border: catForm.border }, null, 2);

                    return (
                      <div className="lg:col-span-3 space-y-4">

                        {/* ── Table des catégories existantes ── */}
                        <Card className="rounded-2xl border-slate-100 shadow-sm">
                          <CardHeader className="pb-3 border-b border-slate-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-sm font-semibold text-slate-700">Catégories de décaissement</CardTitle>
                                <p className="text-xs text-slate-400 mt-0.5">{config.categoriesDecaiss.length} catégorie(s) configurée(s)</p>
                              </div>
                              <button onClick={openAdd}
                                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 transition-colors shadow-sm">
                                + Nouvelle catégorie
                              </button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50 border-slate-100">
                                  {["Aperçu", "Icône", "Clé (key)", "Libellé (label)", "Couleur", "Bg", "Bordure", ""].map(h => (
                                    <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-4 py-2.5">{h}</TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {config.categoriesDecaiss.length === 0 && (
                                  <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-slate-400 text-sm">
                                      Aucune catégorie — cliquez sur "+ Nouvelle catégorie"
                                    </TableCell>
                                  </TableRow>
                                )}
                                {config.categoriesDecaiss.map((cat, i) => (
                                  <TableRow key={cat.key + i} className="border-slate-50 hover:bg-slate-50/60 group">
                                    {/* Aperçu badge */}
                                    <TableCell className="pl-5 py-2.5">
                                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                                        {cat.icon} {cat.label}
                                      </span>
                                    </TableCell>
                                    {/* Icon */}
                                    <TableCell className="text-xl py-2.5">{cat.icon}</TableCell>
                                    {/* key */}
                                    <TableCell className="py-2.5">
                                      <code className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-mono">{cat.key}</code>
                                    </TableCell>
                                    {/* label */}
                                    <TableCell className="text-sm font-medium text-slate-700 py-2.5">{cat.label}</TableCell>
                                    {/* color */}
                                    <TableCell className="py-2.5">
                                      <code className="text-xs font-mono text-slate-500">{cat.color}</code>
                                    </TableCell>
                                    {/* bg */}
                                    <TableCell className="py-2.5">
                                      <code className="text-xs font-mono text-slate-500">{cat.bg}</code>
                                    </TableCell>
                                    {/* border */}
                                    <TableCell className="py-2.5">
                                      <code className="text-xs font-mono text-slate-500">{cat.border}</code>
                                    </TableCell>
                                    {/* Actions */}
                                    <TableCell className="pr-4 py-2.5">
                                      <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(cat, i)}
                                          className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 flex items-center justify-center text-xs transition-colors"
                                          title="Modifier">✏️</button>
                                        <button onClick={() => deleteCat(i)}
                                          className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center text-xs transition-colors"
                                          title="Supprimer">🗑</button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>

                        {/* ── Formulaire d'ajout / édition ── */}
                        <Card className={`rounded-2xl shadow-sm border-2 transition-all ${editIdx !== null ? "border-blue-300 bg-blue-50/30" : "border-amber-200 bg-amber-50/20"}`}>
                          <CardHeader className="pb-3 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-base shrink-0 ${catForm.bg} ${catForm.border} border`}>
                                  {catForm.icon}
                                </div>
                                <div>
                                  <CardTitle className="text-sm font-semibold text-slate-700">
                                    {editIdx !== null ? `Modifier : ${config.categoriesDecaiss[editIdx]?.label}` : "Nouvelle catégorie"}
                                  </CardTitle>
                                  <p className="text-xs text-slate-400">Tous les champs du schéma JSON</p>
                                </div>
                              </div>
                              {editIdx !== null && (
                                <button onClick={openAdd} className="text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors">
                                  ✕ Annuler édition
                                </button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                              {/* Colonne gauche — champs */}
                              <div className="space-y-4">

                                {/* key */}
                                <div>
                                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    <code className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-xs normal-case font-mono">"key"</code>
                                    Code identifiant *
                                  </label>
                                  <Input
                                    value={catForm.key}
                                    onChange={e => { setCatForm(f => ({ ...f, key: e.target.value.replace(/s/g, "") })); setCatFormErr(er => ({ ...er, key: undefined })); }}
                                    placeholder='ex: "Debarquement"'
                                    className={`rounded-xl font-mono text-sm ${catFormErr.key ? "border-rose-400 focus-visible:ring-rose-300" : ""}`}
                                  />
                                  {catFormErr.key && <p className="text-xs text-rose-500 mt-1">⚠ {catFormErr.key}</p>}
                                  <p className="text-xs text-slate-400 mt-1">Sans espaces. Utilisé en interne comme identifiant unique.</p>
                                </div>

                                {/* label */}
                                <div>
                                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    <code className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-xs normal-case font-mono">"label"</code>
                                    Libellé affiché *
                                  </label>
                                  <Input
                                    value={catForm.label}
                                    onChange={e => { setCatForm(f => ({ ...f, label: e.target.value })); setCatFormErr(er => ({ ...er, label: undefined })); }}
                                    placeholder='ex: "Débarquement"'
                                    className={`rounded-xl ${catFormErr.label ? "border-rose-400" : ""}`}
                                  />
                                  {catFormErr.label && <p className="text-xs text-rose-500 mt-1">⚠ {catFormErr.label}</p>}
                                </div>

                                {/* icon */}
                                <div>
                                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    <code className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-xs normal-case font-mono">"icon"</code>
                                    Icône emoji
                                  </label>
                                  <div className="flex flex-wrap gap-1.5 p-3 bg-white border border-slate-200 rounded-xl">
                                    {ICONS_OPTIONS.map(ic => (
                                      <button key={ic} onClick={() => setCatForm(f => ({ ...f, icon: ic }))}
                                        className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${catForm.icon === ic ? "bg-amber-400 shadow-md scale-110" : "hover:bg-slate-100"}`}>
                                        {ic}
                                      </button>
                                    ))}
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1">Sélectionné : <span className="font-mono text-slate-600">"{catForm.icon}"</span></p>
                                </div>

                                {/* Couleur */}
                                <div>
                                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    <code className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-xs normal-case font-mono">"color" / "bg" / "border"</code>
                                  </label>
                                  <div className="grid grid-cols-4 gap-2">
                                    {COLOR_OPTIONS.map(opt => (
                                      <button key={opt.label} onClick={() => applyColorToForm(opt)}
                                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${catForm.color === opt.color ? "border-slate-700 shadow-sm" : "border-transparent hover:border-slate-300"} ${opt.bg}`}>
                                        <span className={`w-5 h-5 rounded-full border-2 ${opt.bg} ${opt.border}`} style={{ boxShadow: `inset 0 0 0 2px currentColor` }} />
                                        <span className={`text-xs font-semibold ${opt.color}`}>{opt.label}</span>
                                      </button>
                                    ))}
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 mt-3">
                                    {[
                                      { f: "color", label: '"color"', val: catForm.color },
                                      { f: "bg", label: '"bg"', val: catForm.bg },
                                      { f: "border", label: '"border"', val: catForm.border },
                                    ].map(r => (
                                      <div key={r.f}>
                                        <label className="block text-xs text-slate-400 mb-1 font-mono">{r.label}</label>
                                        <Input
                                          value={r.val}
                                          onChange={e => setCatForm(f => ({ ...f, [r.f]: e.target.value }))}
                                          className="h-7 rounded-lg text-xs font-mono border-slate-200"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Colonne droite — aperçu + JSON */}
                              <div className="space-y-4">

                                {/* Aperçu badge */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center">
                                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-4 font-semibold">Aperçu du badge</p>
                                  <div className="flex justify-center mb-4">
                                    <span className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border ${catForm.bg} ${catForm.color} ${catForm.border}`}>
                                      <span className="text-base">{catForm.icon}</span>
                                      {catForm.label || "Libellé…"}
                                    </span>
                                  </div>
                                  <div className="flex justify-center gap-2 flex-wrap text-xs text-slate-400">
                                    <span className={`px-2 py-0.5 rounded-full ${catForm.bg} ${catForm.color} font-mono text-xs border ${catForm.border}`}>badge</span>
                                    <span className={`px-2 py-0.5 rounded-full ${catForm.bg} ${catForm.color} font-mono text-xs border ${catForm.border}`}>tableau</span>
                                    <span className={`px-2 py-0.5 rounded-full ${catForm.bg} ${catForm.color} font-mono text-xs border ${catForm.border}`}>modal</span>
                                  </div>
                                </div>

                                {/* JSON preview */}
                                <div className="bg-slate-900 rounded-2xl overflow-hidden">
                                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700">
                                    <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">JSON Schema</span>
                                    <span className="text-xs text-emerald-400 font-mono">● live</span>
                                  </div>
                                  <pre className="px-4 py-3 text-xs font-mono overflow-x-auto leading-relaxed">
                                    <span className="text-slate-500">{"{"}</span>{`n`}
                                    {[
                                      ["key", catForm.key || ""],
                                      ["label", catForm.label || ""],
                                      ["icon", catForm.icon],
                                      ["color", catForm.color],
                                      ["bg", catForm.bg],
                                      ["border", catForm.border],
                                    ].map(([k, v], idx, arr) => (
                                      <span key={k}>
                                        {"  "}<span className="text-amber-300">"{k}"</span>
                                        <span className="text-slate-400">: </span>
                                        <span className="text-emerald-300">"{v}"</span>
                                        {idx < arr.length - 1 && <span className="text-slate-500">,</span>}
                                        {`n`}
                                      </span>
                                    ))}
                                    <span className="text-slate-500">{"}"}</span>
                                  </pre>
                                </div>

                                {/* Submit */}
                                <button onClick={submitCatForm}
                                  className={`w-full font-bold text-sm py-3 rounded-xl transition-colors shadow-sm ${editIdx !== null ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-amber-400 hover:bg-amber-500 text-slate-900"}`}>
                                  {editIdx !== null ? "✏️ Mettre à jour la catégorie" : "＋ Ajouter la catégorie"}
                                </button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ── Tab: Permissions & Rôles ── */}
              {configTab === "permissions" && (() => {
                const ALL_PERMISSIONS = [
                  { key: "dossier.read", label: "Lire les dossiers", cat: "Dossiers", icon: "📋" },
                  { key: "dossier.write", label: "Créer / modifier dossiers", cat: "Dossiers", icon: "✏️" },
                  { key: "dossier.delete", label: "Supprimer des dossiers", cat: "Dossiers", icon: "🗑" },
                  { key: "client.read", label: "Lire les clients", cat: "Clients", icon: "📋" },
                  { key: "client.write", label: "Créer / modifier clients", cat: "Clients", icon: "✏️" },
                  { key: "client.delete", label: "Supprimer des clients", cat: "Clients", icon: "🗑" },
                  { key: "paiement.read", label: "Voir les encaissements", cat: "Paiements", icon: "👁" },
                  { key: "paiement.write", label: "Saisir des encaissements", cat: "Paiements", icon: "✏️" },
                  { key: "paiement.delete", label: "Supprimer encaissements", cat: "Paiements", icon: "🗑" },
                  { key: "decaissement.read", label: "Voir les décaissements", cat: "Décaissements", icon: "👁" },
                  { key: "decaissement.write", label: "Saisir des décaissements", cat: "Décaissements", icon: "✏️" },
                  { key: "decaissement.delete", label: "Supprimer décaissements", cat: "Décaissements", icon: "🗑" },
                  { key: "charges.read", label: "Voir charges bureau", cat: "Charges", icon: "👁" },
                  { key: "charges.write", label: "Saisir charges bureau", cat: "Charges", icon: "✏️" },
                  { key: "charges.delete", label: "Supprimer charges bureau", cat: "Charges", icon: "🗑" },
                  { key: "salaire.read", label: "Voir les salaires", cat: "Salaires", icon: "👁" },
                  { key: "salaire.write", label: "Gérer les salaires", cat: "Salaires", icon: "✏️" },
                  { key: "solde.view", label: "Voir les soldes financiers", cat: "Finance", icon: "💰" },
                  { key: "config.read", label: "Accès configuration", cat: "Administration", icon: "⚙️" },
                  { key: "config.write", label: "Modifier la configuration", cat: "Administration", icon: "✏️" },
                  { key: "personnel.manage", label: "Gérer le personnel", cat: "Administration", icon: "👥" },
                  { key: "role.manage", label: "Gérer les rôles", cat: "Administration", icon: "🔑" },
                ];
                const CATEGORIES = [...new Set(ALL_PERMISSIONS.map(p => p.cat))];

                // Roles stored in config.rolePermissions
                const allRoles = Object.keys(config.rolePermissions);
                const PROTECTED_ROLES = ["Administrateur"]; // cannot be deleted



                const togglePerm = (role, perm) => {
                  if (PROTECTED_ROLES.includes(role)) return;
                  const current = config.rolePermissions[role] || [];
                  const updated = current.includes(perm) ? current.filter(p => p !== perm) : [...current, perm];
                  setConfig(c => ({ ...c, rolePermissions: { ...c.rolePermissions, [role]: updated } }));
                };
                const hasPerm = (role, perm) => {
                  if (role === "Administrateur") return true;
                  return (config.rolePermissions[role] || []).includes(perm);
                };
                const countPerms = (role) => {
                  if (role === "Administrateur") return ALL_PERMISSIONS.length;
                  return (config.rolePermissions[role] || []).length;
                };
                const grantAll = (role) => {
                  if (PROTECTED_ROLES.includes(role)) return;
                  setConfig(c => ({ ...c, rolePermissions: { ...c.rolePermissions, [role]: ALL_PERMISSIONS.map(p => p.key) } }));
                };
                const revokeAll = (role) => {
                  if (PROTECTED_ROLES.includes(role)) return;
                  setConfig(c => ({ ...c, rolePermissions: { ...c.rolePermissions, [role]: [] } }));
                };

                const createRole = () => {
                  const name = newRoleForm.nom.trim();
                  if (!name) { setNewRoleError("Le nom du rôle est requis."); return; }
                  if (config.rolePermissions[name]) { setNewRoleError("Ce rôle existe déjà."); return; }
                  const basePerms = newRoleForm.baseRole ? (config.rolePermissions[newRoleForm.baseRole] || []) : [];
                  setConfig(c => ({ ...c, rolePermissions: { ...c.rolePermissions, [name]: [...basePerms] } }));
                  setRoleDescriptions(d => ({ ...d, [name]: newRoleForm.description || "" }));
                  setNewRoleForm({ nom: "", description: "", baseRole: "" });
                  setNewRoleError("");
                  setShowNewRoleForm(false);
                  setSelectedRole(name);
                };

                const deleteRole = (role) => {
                  if (PROTECTED_ROLES.includes(role)) return;
                  if (!window.confirm(`Supprimer le rôle "${role}" ? Cette action est irréversible.`)) return;
                  setConfig(c => {
                    const rp = { ...c.rolePermissions };
                    delete rp[role];
                    return { ...c, rolePermissions: rp };
                  });
                  setRoleDescriptions(d => { const nd = { ...d }; delete nd[role]; return nd; });
                  if (selectedRole === role) setSelectedRole("Transitaire");
                };

                const startRename = (role) => { setEditRoleName(role); setEditRoleInput(role); };
                const confirmRename = () => {
                  const newName = editRoleInput.trim();
                  if (!newName || newName === editRoleName) { setEditRoleName(null); return; }
                  if (config.rolePermissions[newName]) { return; }
                  setConfig(c => {
                    const rp = { ...c.rolePermissions };
                    rp[newName] = rp[editRoleName];
                    delete rp[editRoleName];
                    return { ...c, rolePermissions: rp };
                  });
                  setRoleDescriptions(d => { const nd = { ...d }; nd[newName] = nd[editRoleName]; delete nd[editRoleName]; return nd; });
                  if (selectedRole === editRoleName) setSelectedRole(newName);
                  setEditRoleName(null);
                };

                return (
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 flex-1">
                        <span className="text-xl shrink-0">🔑</span>
                        <div>
                          <p className="text-sm font-semibold text-amber-800">Gestion des rôles & permissions</p>
                          <p className="text-xs text-amber-700 mt-0.5">Créez des rôles personnalisés et attribuez précisément les permissions. <strong>Administrateur</strong> dispose toujours de tous les droits.</p>
                        </div>
                      </div>
                      <button onClick={() => setShowNewRoleForm(s => !s)}
                        className={`flex items-center gap-2 font-bold text-sm px-4 py-3 rounded-2xl transition-all shadow-sm ${showNewRoleForm ? "bg-slate-200 text-slate-700" : "bg-amber-400 hover:bg-amber-500 text-slate-900"}`}>
                        {showNewRoleForm ? "✕ Annuler" : "+ Nouveau rôle"}
                      </button>
                    </div>

                    {/* ── Formulaire nouveau rôle ── */}
                    {showNewRoleForm && (
                      <Card className="rounded-2xl border-2 border-amber-300 bg-amber-50/30 shadow-sm">
                        <CardHeader className="pb-3 border-b border-amber-200">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-amber-400 rounded-lg flex items-center justify-center text-slate-900 text-xs font-black">+</span>
                            <CardTitle className="text-sm font-bold text-slate-800">Créer un nouveau rôle</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="p-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nom du rôle *</label>
                              <Input value={newRoleForm.nom} onChange={e => { setNewRoleForm(f => ({ ...f, nom: e.target.value })); setNewRoleError(""); }}
                                placeholder="ex: Superviseur" className={`rounded-xl ${newRoleError ? "border-rose-400" : ""}`} />
                              {newRoleError && <p className="text-xs text-rose-500 mt-1">⚠ {newRoleError}</p>}
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                              <Input value={newRoleForm.description} onChange={e => setNewRoleForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="ex: Gestion supervision équipe" className="rounded-xl" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Copier permissions de…</label>
                              <Select value={newRoleForm.baseRole} onValueChange={v => setNewRoleForm(f => ({ ...f, baseRole: v }))}>
                                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Partir de zéro" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="">Partir de zéro (aucune permission)</SelectItem>
                                  {allRoles.map(r => <SelectItem key={r} value={r}>{r} ({countPerms(r)} perms)</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {newRoleForm.baseRole && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
                              <strong>Héritage :</strong> Ce rôle démarrera avec les {countPerms(newRoleForm.baseRole)} permissions de <strong>{newRoleForm.baseRole}</strong>. Vous pourrez les modifier ensuite.
                            </div>
                          )}
                          <div className="flex gap-3 mt-4">
                            <button onClick={createRole}
                              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors">
                              ✓ Créer le rôle
                            </button>
                            <button onClick={() => { setShowNewRoleForm(false); setNewRoleForm({ nom: "", description: "", baseRole: "" }); setNewRoleError(""); }}
                              className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50">Annuler</button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

                      {/* ── Colonne rôles ── */}
                      <div className="lg:col-span-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{allRoles.length} Rôles configurés</p>
                        <div className="space-y-1.5">
                          {allRoles.map(role => {
                            const count = countPerms(role);
                            const isSelected = selectedRole === role;
                            const isProtected = PROTECTED_ROLES.includes(role);
                            const isEditing = editRoleName === role;
                            return (
                              <div key={role}
                                className={`rounded-xl border transition-all ${isSelected ? "bg-slate-900 border-slate-900 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                                <div className="flex items-center gap-2 px-3 py-2.5">
                                  {/* Role icon */}
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${isProtected ? "bg-amber-400/20 text-amber-400" : "bg-slate-700 text-slate-300"}`}>
                                    {isProtected ? "👑" : "🔑"}
                                  </div>
                                  {/* Name (editable) */}
                                  <div className="flex-1 min-w-0" onClick={() => !isEditing && setSelectedRole(role)}>
                                    {isEditing ? (
                                      <input autoFocus value={editRoleInput}
                                        onChange={e => setEditRoleInput(e.target.value)}
                                        onBlur={confirmRename}
                                        onKeyDown={e => { if (e.key === "Enter") confirmRename(); if (e.key === "Escape") setEditRoleName(null); }}
                                        className="w-full text-sm font-medium bg-white border border-amber-400 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-400 text-slate-900"
                                        onClick={e => e.stopPropagation()}
                                      />
                                    ) : (
                                      <span className={`text-sm font-medium truncate block cursor-pointer ${isSelected ? "text-white" : "text-slate-700"}`}>{role}</span>
                                    )}
                                  </div>
                                  {/* Count badge */}
                                  <span className={`text-xs font-bold shrink-0 ${isSelected ? "text-amber-400" : "text-slate-400"}`}>{count}/{ALL_PERMISSIONS.length}</span>
                                  {/* Actions */}
                                  {!isProtected && !isEditing && (
                                    <div className="flex items-center gap-0.5 shrink-0">
                                      <button onClick={e => { e.stopPropagation(); startRename(role); }}
                                        className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${isSelected ? "text-slate-400 hover:text-white" : "text-slate-300 hover:text-slate-600"}`}
                                        title="Renommer">✏</button>
                                      <button onClick={e => { e.stopPropagation(); deleteRole(role); }}
                                        className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${isSelected ? "text-slate-400 hover:text-rose-400" : "text-slate-300 hover:text-rose-500"}`}
                                        title="Supprimer">✕</button>
                                    </div>
                                  )}
                                  {isProtected && <span className="text-xs font-bold text-amber-400 shrink-0">ADM</span>}
                                </div>
                                {/* Description */}
                                {roleDescriptions[role] && (
                                  <p className={`text-xs px-3 pb-2 leading-tight ${isSelected ? "text-slate-400" : "text-slate-400"}`}>{roleDescriptions[role]}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* ── Matrice permissions ── */}
                      <div className="lg:col-span-3 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div>
                            <h3 className="text-sm font-bold text-slate-800">
                              Permissions — <span className="text-amber-600">{selectedRole}</span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {countPerms(selectedRole)}/{ALL_PERMISSIONS.length} permissions actives
                            </p>
                          </div>
                          {selectedRole !== "Administrateur" && (
                            <div className="flex gap-2">
                              <button onClick={() => grantAll(selectedRole)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors">
                                ✓ Tout autoriser
                              </button>
                              <button onClick={() => revokeAll(selectedRole)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors">
                                ✕ Tout révoquer
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Permission matrix */}
                        {CATEGORIES.map(cat => {
                          const catPerms = ALL_PERMISSIONS.filter(p => p.cat === cat);
                          const allGranted = catPerms.every(p => hasPerm(selectedRole, p.key));
                          return (
                            <Card key={cat} className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                              <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">{cat}</p>
                                {selectedRole !== "Administrateur" && (
                                  <button
                                    onClick={() => catPerms.forEach(p => { if (allGranted) { if (hasPerm(selectedRole, p.key)) togglePerm(selectedRole, p.key); } else { if (!hasPerm(selectedRole, p.key)) togglePerm(selectedRole, p.key); } })}
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${allGranted ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"}`}>
                                    {allGranted ? "✓ Tous accordés" : "Tout accorder"}
                                  </button>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {catPerms.map(perm => {
                                    const granted = hasPerm(selectedRole, perm.key);
                                    const isAdm = selectedRole === "Administrateur";
                                    return (
                                      <div key={perm.key}
                                        className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${granted ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"} ${isAdm ? "opacity-80" : "cursor-pointer hover:shadow-sm"}`}
                                        onClick={() => !isAdm && togglePerm(selectedRole, perm.key)}>
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <span className="text-base shrink-0">{perm.icon}</span>
                                          <div className="min-w-0">
                                            <p className={`text-xs font-semibold truncate ${granted ? "text-emerald-800" : "text-slate-600"}`}>{perm.label}</p>
                                            <code className={`text-xs font-mono ${granted ? "text-emerald-500" : "text-slate-400"}`}>{perm.key}</code>
                                          </div>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full shrink-0 relative transition-all ${granted ? "bg-emerald-500" : "bg-slate-300"}`}>
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
              })()}
            </div>
          )}

          {/* ══════════ CHARGES DE BUREAU ══════════ */}
          {vue === "charges" && (() => {
            const catCharge = (key) => CATS_CHARGES.find(c => c.key === key) || { label: key, icon: "💸", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };
            const filtered = charges.filter(c => {
              const matchMois = c.mois === moisCharges && c.annee === anneeCharges;
              const matchCat = filtreChargesCat === "all" || c.categorie === filtreChargesCat;
              return matchMois && matchCat;
            });
            const totalMois = filtered.reduce((s, c) => s + c.montant, 0);
            const totAllTime = charges.reduce((s, c) => s + c.montant, 0);
            const statsCat = CATS_CHARGES.map(cat => ({
              ...cat, montant: filtered.filter(c => c.categorie === cat.key).reduce((s, c) => s + c.montant, 0),
              count: filtered.filter(c => c.categorie === cat.key).length,
            }));
            const openAdd = () => { setChargeForm({ ...EMPTY_CHARGE, mois: moisCharges, annee: anneeCharges, date: today }); setEditChargeId(null); setChargeModal(true); };
            const openEdit = (c) => { setChargeForm({ ...c }); setEditChargeId(c.id); setChargeModal(true); };
            const saveCharge = () => {
              if (!chargeForm.montant || !chargeForm.description) return;
              const data = { ...chargeForm, montant: parseInt(chargeForm.montant), mois: parseInt(chargeForm.mois || moisCharges), annee: parseInt(chargeForm.annee || anneeCharges) };
              if (editChargeId) {
                setCharges(prev => prev.map(c => c.id === editChargeId ? { ...data, id: editChargeId } : c));
              } else {
                const newId = Math.max(0, ...charges.map(c => c.id)) + 1;
                setCharges(prev => [...prev, { ...data, id: newId }]);
              }
              setChargeModal(false);
            };
            const deleteCharge = (id) => { if (window.confirm("Supprimer cette charge ?")) setCharges(prev => prev.filter(c => c.id !== id)); };
            return (
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Charges de Bureau</h1>
                    <p className="text-slate-400 text-sm">{MOIS_CHARGES[moisCharges]} {anneeCharges} · {filtered.length} opération(s)</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => printRecapChargesBureau(charges, moisCharges, anneeCharges, MOIS_CHARGES, config.entreprise)}
                      className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" /></svg>
                      Imprimer récap
                    </button>
                    <Select value={String(moisCharges)} onValueChange={v => setMoisCharges(parseInt(v))}>
                      <SelectTrigger className="w-32 h-9 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{MOIS_CHARGES.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={String(anneeCharges)} onValueChange={v => setAnneeCharges(parseInt(v))}>
                      <SelectTrigger className="w-24 h-9 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{[2024, 2025, 2026, 2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                    <button onClick={openAdd} className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">+ Décaissement</button>
                  </div>
                </div>

                {/* KPI */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total décaissé (mois)", value: fmt(totalMois), color: "text-rose-600", bg: "bg-rose-50" },
                    { label: "Nb. opérations", value: filtered.length, color: "text-slate-800", bg: "bg-white" },
                    { label: "Total annuel", value: fmt(charges.filter(c => c.annee === anneeCharges).reduce((s, c) => s + c.montant, 0)), color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Moyenne mensuelle", value: fmt(Math.round(totAllTime / 12)), color: "text-violet-600", bg: "bg-violet-50" },
                  ].map(k => (
                    <Card key={k.label} className={`rounded-2xl border-0 shadow-sm ${k.bg}`}>
                      <CardContent className="p-4">
                        <p className="text-xs font-semibold text-slate-500 mb-1 leading-tight">{k.label}</p>
                        <p className={`text-lg font-black ${k.color} tabular-nums`}>{k.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Catégorie progress bars */}
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                  <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-700">Répartition par catégorie</CardTitle>
                    <div className="flex gap-1.5">
                      <button onClick={() => setFiltreChargesCat("all")}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${filtreChargesCat === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}>
                        Toutes
                      </button>
                      {CATS_CHARGES.map(cat => (
                        <button key={cat.key} onClick={() => setFiltreChargesCat(filtreChargesCat === cat.key ? "all" : cat.key)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${filtreChargesCat === cat.key ? `${cat.bg} ${cat.border} ${cat.color}` : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}>
                          {cat.icon}
                        </button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {statsCat.filter(c => c.montant > 0).map(cat => {
                        const pct = totalMois ? Math.round(cat.montant / totalMois * 100) : 0;
                        return (
                          <div key={cat.key} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                                {cat.icon} {cat.label}
                              </span>
                              <span className="text-xs font-bold text-slate-600 tabular-nums">{fmt(cat.montant)}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: cat.color.replace("text-", "").replace("-600", "").includes("blue") ? "#2563eb" : cat.color.includes("amber") ? "#d97706" : cat.color.includes("rose") ? "#e11d48" : cat.color.includes("violet") ? "#7c3aed" : cat.color.includes("cyan") ? "#0891b2" : cat.color.includes("orange") ? "#ea580c" : "#4f46e5" }} />
                            </div>
                            <p className="text-xs text-slate-400">{pct}% du total · {cat.count} opération(s)</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Table des charges */}
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                  <CardHeader className="pb-3 border-b border-slate-50">
                    <CardTitle className="text-sm font-semibold text-slate-700">Journal des décaissements — {MOIS_CHARGES[moisCharges]} {anneeCharges}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 border-slate-100">
                          {["Réf", "Catégorie", "Description", "Bénéficiaire", "Mode", "Date", "Montant", ""].map(h => (
                            <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-4 py-3 whitespace-nowrap">{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-10 text-slate-400">Aucune charge ce mois</TableCell></TableRow>}
                        {filtered.map(c => {
                          const cat = catCharge(c.categorie);
                          return (
                            <TableRow key={c.id} className="border-slate-50 hover:bg-slate-50/60 group">
                              <TableCell className="pl-5 font-mono text-xs text-slate-500 py-3">{c.ref}</TableCell>
                              <TableCell className="py-3">
                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                                  {cat.icon} {cat.label}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm text-slate-700 py-3 max-w-[160px] truncate">{c.description}</TableCell>
                              <TableCell className="text-sm text-slate-500 py-3">{c.beneficiaire || "—"}</TableCell>
                              <TableCell className="py-3"><Badge variant="outline" className="text-xs rounded-lg">{c.mode}</Badge></TableCell>
                              <TableCell className="font-mono text-xs text-slate-500 py-3 whitespace-nowrap">{c.date}</TableCell>
                              <TableCell className="font-bold text-rose-600 tabular-nums text-sm py-3 whitespace-nowrap">−{fmt(c.montant)}</TableCell>
                              <TableCell className="pr-4 py-3">
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => printRecuDecaissement(c, config.entreprise)}
                                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors whitespace-nowrap">
                                    🖨 Reçu
                                  </button>
                                  <button onClick={() => openEdit(c)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-400 flex items-center justify-center text-xs transition-colors">✏️</button>
                                  <button onClick={() => deleteCharge(c.id)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-500 text-slate-400 flex items-center justify-center text-xs transition-colors">🗑</button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    {filtered.length > 0 && (
                      <div className="flex justify-between items-center px-5 py-3 border-t border-slate-100 bg-rose-50/40">
                        <span className="text-xs text-slate-400">{filtered.length} opération(s)</span>
                        <span className="text-sm font-bold text-rose-600">Total : {fmt(totalMois)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Modal charge */}
                {chargeModal && (
                  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 max-h-[92vh] overflow-y-auto">
                      <div className="bg-rose-600 px-6 py-4 rounded-t-2xl flex justify-between items-center sticky top-0">
                        <p className="text-white font-bold">{editChargeId ? "Modifier le décaissement" : "Nouveau décaissement"}</p>
                        <button onClick={() => setChargeModal(false)} className="text-rose-200 hover:text-white text-xl">✕</button>
                      </div>
                      <div className="p-6 space-y-4">
                        {/* Catégorie */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Catégorie</label>
                          <div className="grid grid-cols-4 gap-2">
                            {CATS_CHARGES.map(cat => (
                              <button key={cat.key} onClick={() => setChargeForm(f => ({ ...f, categorie: cat.key }))}
                                className={`p-2.5 rounded-xl border text-center transition-all ${chargeForm.categorie === cat.key ? `${cat.bg} ${cat.border} border-2` : "border-slate-200 hover:border-slate-300"}`}>
                                <div className="text-lg mb-0.5">{cat.icon}</div>
                                <div className={`text-xs font-semibold leading-tight ${chargeForm.categorie === cat.key ? cat.color : "text-slate-700"}`}>{cat.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* Montant */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Montant (FCFA) *</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 font-bold">−</span>
                            <Input type="number" value={chargeForm.montant || ""} onChange={e => setChargeForm(f => ({ ...f, montant: e.target.value }))} placeholder="ex: 45000" className="pl-7 rounded-xl text-base font-semibold" />
                          </div>
                          {chargeForm.montant && <p className="text-xs text-rose-500 mt-1 font-medium">= {parseInt(chargeForm.montant).toLocaleString("fr-FR")} FCFA</p>}
                        </div>
                        {/* Description */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description *</label>
                          <Input value={chargeForm.description || ""} onChange={e => setChargeForm(f => ({ ...f, description: e.target.value }))} placeholder="ex: Carburant véhicule bureau" className="rounded-xl" />
                        </div>
                        {/* Bénéficiaire + Réf */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bénéficiaire</label>
                            <Input value={chargeForm.beneficiaire || ""} onChange={e => setChargeForm(f => ({ ...f, beneficiaire: e.target.value }))} placeholder="ex: Shell Dakar" className="rounded-xl" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Référence</label>
                            <Input value={chargeForm.ref || ""} onChange={e => setChargeForm(f => ({ ...f, ref: e.target.value }))} placeholder="ex: TRS-001" className="rounded-xl font-mono text-sm" />
                          </div>
                        </div>
                        {/* Date + Mode */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                            <Input type="date" value={chargeForm.date || today} onChange={e => setChargeForm(f => ({ ...f, date: e.target.value }))} className="rounded-xl" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mode de paiement</label>
                            <Select value={chargeForm.mode || "Virement"} onValueChange={v => setChargeForm(f => ({ ...f, mode: v }))}>
                              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["Virement", "Espèces", "Chèque", "Mobile Money", "Carte bancaire"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={saveCharge} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-3 rounded-xl transition-colors">
                            {editChargeId ? "Mettre à jour" : "Enregistrer"}
                          </button>
                          <button onClick={() => setChargeModal(false)} className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 font-medium">Annuler</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ══════════ SALAIRES ══════════ */}
          {vue === "salaires" && (() => {
            const AVATAR_PAL = ["bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700", "bg-violet-100 text-violet-700", "bg-teal-100 text-teal-700"];
            const DEPT_LIST_S = ["Direction", "Transit", "Douane", "Finance", "Commercial", "Opérations", "RH", "IT", "Informatique"];
            const masseBrute = employes.filter(e => e.actif).reduce((s, e) => s + calcSalaire(e, moisSalaire, anneeSalaire).brut, 0);
            const masseNette = employes.filter(e => e.actif).reduce((s, e) => s + calcSalaire(e, moisSalaire, anneeSalaire).net, 0);
            const totalPatron = employes.filter(e => e.actif).reduce((s, e) => s + calcSalaire(e, moisSalaire, anneeSalaire).patron, 0);
            const openAddEmp = () => { setEmpSalaireForm({ prenom: "", nom: "", poste: "", dept: "Transit", salaire: "", dateEmbauche: "", matricule: "", cnss: "", rib: "", actif: true }); setEditEmpSalaireId(null); setEmpSalaireModal(true); };
            const openEditEmp = (e) => { setEmpSalaireForm({ ...e }); setEditEmpSalaireId(e.id); setEmpSalaireModal(true); };
            const saveEmp = () => {
              if (!empSalaireForm.prenom || !empSalaireForm.salaire) return;
              if (editEmpSalaireId) {
                setEmployes(prev => prev.map(e => e.id === editEmpSalaireId ? { ...empSalaireForm, id: editEmpSalaireId, salaire: parseInt(empSalaireForm.salaire) } : e));
              } else {
                const newId = Math.max(0, ...employes.map(e => e.id)) + 1;
                setEmployes(prev => [...prev, { ...empSalaireForm, id: newId, salaire: parseInt(empSalaireForm.salaire) }]);
              }
              setEmpSalaireModal(false);
            };
            const deleteEmp = (id) => { if (window.confirm("Supprimer cet employé ?")) setEmployes(prev => prev.filter(e => e.id !== id)); };
            return (
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Gestion des salaires</h1>
                    <p className="text-slate-400 text-sm">{employes.filter(e => e.actif).length} employés actifs · {MOIS_LABELS[moisSalaire]} {anneeSalaire}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select value={String(moisSalaire)} onValueChange={v => setMoisSalaire(parseInt(v))}>
                      <SelectTrigger className="w-36 h-9 text-xs rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                      <SelectContent>{MOIS_LABELS.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={String(anneeSalaire)} onValueChange={v => setAnneeSalaire(parseInt(v))}>
                      <SelectTrigger className="w-24 h-9 text-xs rounded-xl border-slate-200"><SelectValue /></SelectTrigger>
                      <SelectContent>{[2024, 2025, 2026, 2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                    <button onClick={openAddEmp} className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">+ Ajouter employé</button>
                  </div>
                </div>

                {/* KPI */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Masse salariale brute", value: fmt(masseBrute), color: "text-slate-900", bg: "bg-white" },
                    { label: "Masse nette à payer", value: fmt(masseNette), color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Charges patronales", value: fmt(totalPatron), color: "text-rose-600", bg: "bg-rose-50" },
                    { label: "Nbre employés actifs", value: employes.filter(e => e.actif).length, color: "text-blue-600", bg: "bg-blue-50" },
                  ].map(k => (
                    <Card key={k.label} className={`rounded-2xl border-0 shadow-sm ${k.bg}`}>
                      <CardContent className="p-4">
                        <p className="text-xs font-semibold text-slate-500 mb-1 leading-tight">{k.label}</p>
                        <p className={`text-lg font-black ${k.color} tabular-nums`}>{k.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Tableau fiches de paie */}
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                  <CardHeader className="pb-3 border-b border-slate-50">
                    <CardTitle className="text-sm font-semibold text-slate-700">Bulletins de salaire — {MOIS_LABELS[moisSalaire]} {anneeSalaire}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 border-slate-100">
                          {["Employé", "Dept", "Salaire base", "Primes", "Déductions", "Brut", "IPRES", "IR", "Net à payer", "Patron", ""].map(h => (
                            <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-4 py-3 whitespace-nowrap">{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employes.filter(e => e.actif).map((e, i) => {
                          const s = calcSalaire(e, moisSalaire, anneeSalaire);
                          return (
                            <TableRow key={e.id} className="border-slate-50 hover:bg-slate-50/60 group">
                              <TableCell className="pl-5 py-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_PAL[i % AVATAR_PAL.length]}`}>
                                    {(e.prenom[0] || "") + (e.nom[0] || "")}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">{e.prenom} {e.nom}</p>
                                    <p className="text-xs text-slate-400">{e.poste}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-3"><Badge variant="outline" className="text-xs rounded-lg">{e.dept}</Badge></TableCell>
                              <TableCell className="py-3 tabular-nums text-slate-700 text-sm">{e.salaire.toLocaleString("fr-FR")}</TableCell>
                              <TableCell className={`py-3 tabular-nums text-sm font-medium ${s.primes > 0 ? "text-blue-600" : "text-slate-300"}`}>{s.primes > 0 ? "+" + s.primes.toLocaleString("fr-FR") : "—"}</TableCell>
                              <TableCell className={`py-3 tabular-nums text-sm font-medium ${s.deductions > 0 ? "text-amber-600" : "text-slate-300"}`}>{s.deductions > 0 ? "−" + s.deductions.toLocaleString("fr-FR") : "—"}</TableCell>
                              <TableCell className="py-3 tabular-nums font-semibold text-slate-800 text-sm">{s.brut.toLocaleString("fr-FR")}</TableCell>
                              <TableCell className="py-3 tabular-nums text-rose-500 text-sm">−{s.ipres.toLocaleString("fr-FR")}</TableCell>
                              <TableCell className="py-3 tabular-nums text-rose-500 text-sm">−{s.ir.toLocaleString("fr-FR")}</TableCell>
                              <TableCell className="py-3 tabular-nums font-bold text-emerald-600 text-base">{s.net.toLocaleString("fr-FR")}</TableCell>
                              <TableCell className="py-3 tabular-nums text-slate-400 text-sm">{s.patron.toLocaleString("fr-FR")}</TableCell>
                              <TableCell className="pr-4 py-3">
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => printBulletinSalaire(e, moisSalaire, anneeSalaire, s, config.entreprise)}
                                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors whitespace-nowrap">
                                    🖨 Bulletin
                                  </button>
                                  <button onClick={() => openEditEmp(e)}
                                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs transition-colors">✏️</button>
                                  <button onClick={() => deleteEmp(e.id)}
                                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-500 text-slate-400 flex items-center justify-center text-xs transition-colors">🗑</button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    {/* Totaux */}
                    <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/60">
                      {[{ label: "Masse brute", val: fmt(masseBrute), color: "text-slate-800" }, { label: "Total IPRES+IR", val: fmt(employes.filter(e => e.actif).reduce((s, e) => { const c = calcSalaire(e, moisSalaire, anneeSalaire); return s + c.ipres + c.ir; }, 0)), color: "text-rose-500" }, { label: "Masse nette", val: fmt(masseNette), color: "text-emerald-600" }].map(t => (
                        <div key={t.label} className="p-3 text-center">
                          <p className="text-xs text-slate-400 mb-0.5">{t.label}</p>
                          <p className={`font-bold text-sm ${t.color}`}>{t.val}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Liste employés */}
                <Card className="rounded-2xl border-slate-100 shadow-sm">
                  <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-700">Employés ({employes.length})</CardTitle>
                    <button onClick={openAddEmp} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 transition-colors">+ Ajouter</button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 border-slate-100">
                          {["Matricule", "Employé", "Département", "Salaire base", "CNSS", "Date emb.", "Actif", ""].map(h => (
                            <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-4 py-2.5">{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employes.map((e, i) => (
                          <TableRow key={e.id} className="border-slate-50 hover:bg-slate-50/60 group">
                            <TableCell className="pl-5 py-2.5 font-mono text-xs text-slate-500">{e.matricule || "—"}</TableCell>
                            <TableCell className="py-2.5">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_PAL[i % AVATAR_PAL.length]}`}>
                                  {(e.prenom[0] || "") + (e.nom[0] || "")}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-800">{e.prenom} {e.nom}</p>
                                  <p className="text-xs text-slate-400">{e.poste}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-2.5"><Badge variant="outline" className="text-xs rounded-lg">{e.dept}</Badge></TableCell>
                            <TableCell className="py-2.5 font-semibold tabular-nums text-sm text-slate-800">{fmt(e.salaire)}</TableCell>
                            <TableCell className="py-2.5 font-mono text-xs text-slate-500">{e.cnss || "—"}</TableCell>
                            <TableCell className="py-2.5 text-xs text-slate-500">{e.dateEmbauche || "—"}</TableCell>
                            <TableCell className="py-2.5">
                              <button onClick={() => setEmployes(prev => prev.map(x => x.id === e.id ? { ...x, actif: !x.actif } : x))}
                                className={`w-10 h-5 rounded-full transition-all relative ${e.actif ? "bg-emerald-500" : "bg-slate-300"}`}>
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${e.actif ? "left-5" : "left-0.5"}`} />
                              </button>
                            </TableCell>
                            <TableCell className="pr-4 py-2.5">
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditEmp(e)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-400 flex items-center justify-center text-xs transition-colors">✏️</button>
                                <button onClick={() => deleteEmp(e.id)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-500 text-slate-400 flex items-center justify-center text-xs transition-colors">🗑</button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Modal Ajouter / Modifier employé */}
                {empSalaireModal && (
                  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 max-h-[92vh] overflow-y-auto">
                      <div className="bg-slate-900 px-6 py-4 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
                        <p className="text-white font-bold">{editEmpSalaireId ? "Modifier l'employé" : "Nouvel employé"}</p>
                        <button onClick={() => setEmpSalaireModal(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {[["Prénom *", "prenom", "ex: Aminata"], ["Nom *", "nom", "ex: Diallo"], ["Poste", "poste", "ex: Comptable"], ["Département", "dept", "ex: Finance"]].map(([l, k, p]) => (
                            <div key={k}>
                              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{l}</label>
                              {k === "dept" ? (
                                <Select value={empSalaireForm.dept} onValueChange={v => setEmpSalaireForm(f => ({ ...f, dept: v }))}>
                                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                  <SelectContent>{DEPT_LIST_S.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                </Select>
                              ) : (
                                <Input value={empSalaireForm[k] || ""} onChange={e => setEmpSalaireForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p} className="rounded-xl" />
                              )}
                            </div>
                          ))}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Salaire de base (FCFA) *</label>
                          <Input type="number" value={empSalaireForm.salaire || ""} onChange={e => setEmpSalaireForm(f => ({ ...f, salaire: e.target.value }))} placeholder="ex: 450000" className="rounded-xl text-base font-semibold" />
                          {empSalaireForm.salaire && parseInt(empSalaireForm.salaire) > 0 && (
                            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                              {(() => { const b = parseInt(empSalaireForm.salaire); const ip = Math.round(b * .06); const ir = Math.round(b * .08); return [["Brut", b, "text-slate-700"], ["IPRES+IR", ip + ir, "text-rose-500"], ["Net estimé", b - ip - ir, "text-emerald-600"]]; })().map(([l, v, c]) => (
                                <div key={l} className="bg-slate-50 rounded-lg p-2 text-center">
                                  <p className="text-slate-400">{l}</p>
                                  <p className={`font-bold ${c}`}>{v.toLocaleString("fr-FR")}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[["Matricule", "matricule", "EMP-001"], ["N° CNSS", "cnss", "SN-1234567"], ["RIB", "rib", "SN28 0001..."], ["Date d'embauche", "dateEmbauche", ""]].map(([l, k, p]) => (
                            <div key={k}>
                              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{l}</label>
                              <Input type={k === "dateEmbauche" ? "date" : "text"} value={empSalaireForm[k] || ""} onChange={e => setEmpSalaireForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p} className="rounded-xl font-mono text-sm" />
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div>
                            <p className="text-sm font-semibold text-slate-700">Compte actif</p>
                            <p className="text-xs text-slate-400">Inclus dans la masse salariale mensuelle</p>
                          </div>
                          <button onClick={() => setEmpSalaireForm(f => ({ ...f, actif: !f.actif }))}
                            className={`w-12 h-6 rounded-full transition-all relative ${empSalaireForm.actif ? "bg-emerald-500" : "bg-slate-300"}`}>
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${empSalaireForm.actif ? "left-6" : "left-0.5"}`} />
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={saveEmp} className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm py-3 rounded-xl transition-colors">
                            {editEmpSalaireId ? "Mettre à jour" : "Enregistrer l'employé"}
                          </button>
                          <button onClick={() => setEmpSalaireModal(false)} className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 font-medium">Annuler</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>



      {/* ══ MODAL PAIEMENT ══ */}
      {paiementModal && (() => {
        const d = dossiers.find(x => x.id === paiementDossierId);
        const client = clients.find(c => c.id === d?.clientId);
        const reste = d ? resteApayer(d) : 0;
        return (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
              <div className="bg-slate-900 px-6 py-4 rounded-t-2xl flex justify-between items-start">
                <div>
                  <p className="text-white font-bold">Enregistrer un paiement</p>
                  <p className="text-slate-400 text-xs mt-0.5">{d?.id} · {client?.nom}</p>
                </div>
                <button onClick={() => setPaiementModal(false)} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex justify-between">
                  <span className="text-rose-600 text-sm font-medium">Reste à percevoir</span>
                  <span className="text-rose-700 font-bold tabular-nums">{fmt(reste)}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Montant reçu (FCFA) *</label>
                  <Input type="number" max={reste} placeholder={`Max: ${reste.toLocaleString("fr-FR")}`}
                    value={formPaiement.montant} onChange={e => setFormPaiement(f => ({ ...f, montant: e.target.value }))}
                    className="rounded-xl text-lg font-semibold" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Mode de paiement</label>
                    <Select value={formPaiement.mode} onValueChange={v => setFormPaiement(f => ({ ...f, mode: v }))}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{MODES_PAIEMENT.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Date</label>
                    <Input type="date" value={formPaiement.date} onChange={e => setFormPaiement(f => ({ ...f, date: e.target.value }))} className="rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Référence</label>
                  <Input placeholder="ex: VIR-2026-042" value={formPaiement.ref}
                    onChange={e => setFormPaiement(f => ({ ...f, ref: e.target.value }))} className="rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Note</label>
                  <Input placeholder="Commentaire optionnel" value={formPaiement.note}
                    onChange={e => setFormPaiement(f => ({ ...f, note: e.target.value }))} className="rounded-xl" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={enregistrerPaiement}
                    className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm py-2.5 rounded-xl transition-colors">
                    Confirmer le paiement
                  </button>
                  <button onClick={() => setPaiementModal(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50">Annuler</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ MODAL NOUVEAU DOSSIER ══ */}
      {nouveauDossierModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900 px-6 py-4 rounded-t-2xl flex justify-between items-center sticky top-0">
              <p className="text-white font-bold">Nouveau dossier</p>
              <button onClick={() => setNouveauDossierModal(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Client *</label>
                  <Select value={formDossier.clientId} onValueChange={v => setFormDossier(f => ({ ...f, clientId: v }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                    <SelectContent>{clients.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.nom}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Type de prestation</label>
                  <Select value={formDossier.type} onValueChange={v => setFormDossier(f => ({ ...f, type: v }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{TYPES_PRESTATION.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description *</label>
                <Input placeholder="ex: Conteneur 40HC électroniques — Chine" value={formDossier.description}
                  onChange={e => setFormDossier(f => ({ ...f, description: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Priorité</label>
                  <Select value={formDossier.priorite} onValueChange={v => setFormDossier(f => ({ ...f, priorite: v }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{["urgente", "haute", "normale"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Date échéance</label>
                  <Input type="date" value={formDossier.dateEcheance} onChange={e => setFormDossier(f => ({ ...f, dateEcheance: e.target.value }))} className="rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Responsable</label>
                  <Input placeholder="ex: Moussa Diaw" value={formDossier.responsable}
                    onChange={e => setFormDossier(f => ({ ...f, responsable: e.target.value }))} className="rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Port / Aéroport</label>
                  <Input placeholder="ex: Port Dakar" value={formDossier.port}
                    onChange={e => setFormDossier(f => ({ ...f, port: e.target.value }))} className="rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">B/L · LTA · AWB</label>
                <Input placeholder="ex: BL-SH-2026-4521" value={formDossier.bl}
                  onChange={e => setFormDossier(f => ({ ...f, bl: e.target.value }))} className="rounded-xl" />
              </div>

              {/* Prestations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lignes de prestation</label>
                  <button onClick={() => setFormDossier(f => ({ ...f, prestations: [...f.prestations, { label: "", montant: "" }] }))}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Ajouter ligne</button>
                </div>
                <div className="space-y-2">
                  {formDossier.prestations.map((p, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input placeholder="Libellé prestation" value={p.label}
                        onChange={e => setFormDossier(f => ({ ...f, prestations: f.prestations.map((x, j) => j === i ? { ...x, label: e.target.value } : x) }))}
                        className="rounded-xl flex-1 text-sm" />
                      <Input type="number" placeholder="Montant" value={p.montant}
                        onChange={e => setFormDossier(f => ({ ...f, prestations: f.prestations.map((x, j) => j === i ? { ...x, montant: e.target.value } : x) }))}
                        className="rounded-xl w-32 text-sm" />
                      {formDossier.prestations.length > 1 && (
                        <button onClick={() => setFormDossier(f => ({ ...f, prestations: f.prestations.filter((_, j) => j !== i) }))}
                          className="text-slate-300 hover:text-rose-400 shrink-0">✕</button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-right text-xs text-slate-400">
                  Total : <span className="font-bold text-slate-700">{fmt(formDossier.prestations.reduce((s, p) => s + (parseInt(p.montant) || 0), 0))}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={ajouterDossier}
                  className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm py-2.5 rounded-xl transition-colors">
                  Créer le dossier
                </button>
                <button onClick={() => setNouveauDossierModal(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ══ MODAL DÉCAISSEMENT ══ */}
      {decaissementModal && (() => {
        const d = dossiers.find(x => x.id === decaissementDossierId);
        const client = clients.find(c => c.id === d?.clientId);
        const catSel = getCatDecaiss(formDecaiss.categorie);
        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 max-h-[92vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-rose-600 px-6 py-4 rounded-t-2xl flex justify-between items-start">
                <div>
                  <p className="text-white font-bold text-base">Nouveau décaissement</p>
                  <p className="text-rose-200 text-xs mt-0.5">{d?.id} · {client?.nom}</p>
                </div>
                <button onClick={() => setDecaissementModal(false)} className="text-rose-200 hover:text-white text-xl leading-none transition-colors">✕</button>
              </div>

              <div className="p-6 space-y-5">

                {/* ── Catégorie ── */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Catégorie de décaissement</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORIES_DECAISSEMENT.map(cat => {
                      const selected = formDecaiss.categorie === cat.key;
                      return (
                        <button key={cat.key}
                          onClick={() => setFormDecaiss(f => ({ ...f, categorie: cat.key }))}
                          className={`p-2.5 rounded-xl border text-left transition-all ${selected ? `${cat.bg} ${cat.border} border-2 shadow-sm` : "border-slate-200 hover:border-slate-300 bg-white"}`}>
                          <span className="text-base block mb-1">{cat.icon}</span>
                          <span className={`text-xs font-semibold leading-tight block ${selected ? cat.color : "text-slate-700"}`}>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Montant ── */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Montant décaissé (FCFA) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 font-bold text-sm">−</span>
                    <Input
                      type="number" min="0"
                      placeholder="ex: 320000"
                      value={formDecaiss.montant}
                      onChange={e => setFormDecaiss(f => ({ ...f, montant: e.target.value }))}
                      className="pl-8 rounded-xl text-base font-semibold"
                    />
                    {parseInt(formDecaiss.montant) > 0 && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{fmt(parseInt(formDecaiss.montant))}</span>
                    )}
                  </div>
                </div>

                {/* ── Date + Mode ── */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date du paiement</label>
                    <Input type="date" value={formDecaiss.date}
                      onChange={e => setFormDecaiss(f => ({ ...f, date: e.target.value }))}
                      className="rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mode de paiement</label>
                    <Select value={formDecaiss.mode} onValueChange={v => setFormDecaiss(f => ({ ...f, mode: v }))}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MODES_PAIEMENT.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* ── Référence + Note ── */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Référence / Quittance</label>
                    <Input placeholder="ex: DD-2026-441"
                      value={formDecaiss.ref}
                      onChange={e => setFormDecaiss(f => ({ ...f, ref: e.target.value }))}
                      className="rounded-xl font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Note</label>
                    <Input placeholder="Commentaire…"
                      value={formDecaiss.note}
                      onChange={e => setFormDecaiss(f => ({ ...f, note: e.target.value }))}
                      className="rounded-xl text-sm" />
                  </div>
                </div>

                {/* ── Aperçu ── */}
                {parseInt(formDecaiss.montant) > 0 && (
                  <div className={`rounded-xl p-4 border ${catSel.bg} ${catSel.border}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{catSel.icon}</span>
                        <div>
                          <p className={`text-sm font-bold ${catSel.color}`}>{catSel.label}</p>
                          <p className="text-xs text-slate-500">{formDecaiss.date} · {formDecaiss.mode}</p>
                        </div>
                      </div>
                      <p className="text-lg font-black text-rose-600 tabular-nums">−{fmt(parseInt(formDecaiss.montant))}</p>
                    </div>
                  </div>
                )}

                {/* ── Actions ── */}
                <div className="flex gap-3 pt-1">
                  <button onClick={enregistrerDecaissement}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm py-3 rounded-xl transition-colors">
                    Enregistrer le décaissement
                  </button>
                  <button onClick={() => setDecaissementModal(false)}
                    className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 transition-colors font-medium">
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ MODAL NOUVEAU CLIENT ══ */}
      {nouveauClientModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-slate-900 px-6 py-4 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                  <span className="text-slate-900 font-black text-sm">👥</span>
                </div>
                <div>
                  <p className="text-white font-bold">{clientEditId ? "Modifier le client" : "Nouveau client"}</p>
                  <p className="text-slate-400 text-xs">{clientEditId ? "Mettre à jour les informations" : "Enregistrer un nouveau client"}</p>
                </div>
              </div>
              <button onClick={() => setNouveauClientModal(false)} className="text-slate-400 hover:text-white text-xl leading-none transition-colors">✕</button>
            </div>

            <div className="p-6 space-y-5">

              {/* ── Identité ── */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 bg-amber-400 rounded flex items-center justify-center text-slate-900 text-xs font-black">1</span>
                  Identité
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Raison sociale / Nom *</label>
                    <Input
                      placeholder="ex: Groupe Teranga SARL"
                      value={formClient.nom}
                      onChange={e => setFormClient(f => ({ ...f, nom: e.target.value }))}
                      className={`rounded-xl ${clientErrors.nom ? "border-rose-400 focus-visible:ring-rose-400" : ""}`}
                    />
                    {clientErrors.nom && <p className="text-xs text-rose-500 mt-1">{clientErrors.nom}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Type de client</label>
                      <Select value={formClient.type} onValueChange={v => setFormClient(f => ({ ...f, type: v }))}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Entreprise", "PME", "Particulier", "ONG", "Administration"].map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Ville</label>
                      <Select value={formClient.ville || ""} onValueChange={v => setFormClient(f => ({ ...f, ville: v }))}>
                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Sélectionner…" /></SelectTrigger>
                        <SelectContent>
                          {["Dakar", "Thiès", "Saint-Louis", "Touba", "Kaolack", "Ziguinchor", "Tambacounda", "Diourbel", "Louga", "Kolda", "Fatick", "Kaffrine", "Sédhiou", "Kédougou", "Matam"].map(v => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Adresse complète</label>
                    <Input
                      placeholder="ex: 45 Rue de Thiong, Plateau"
                      value={formClient.adresse || ""}
                      onChange={e => setFormClient(f => ({ ...f, adresse: e.target.value }))}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* ── Contact ── */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 bg-amber-400 rounded flex items-center justify-center text-slate-900 text-xs font-black">2</span>
                  Contact
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Nom du contact principal *</label>
                    <Input
                      placeholder="ex: M. Ousmane Diop"
                      value={formClient.contact}
                      onChange={e => setFormClient(f => ({ ...f, contact: e.target.value }))}
                      className={`rounded-xl ${clientErrors.contact ? "border-rose-400" : ""}`}
                    />
                    {clientErrors.contact && <p className="text-xs text-rose-500 mt-1">{clientErrors.contact}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Téléphone *</label>
                      <Input
                        placeholder="+221 77 000 0000"
                        value={formClient.tel}
                        onChange={e => setFormClient(f => ({ ...f, tel: e.target.value }))}
                        className={`rounded-xl ${clientErrors.tel ? "border-rose-400" : ""}`}
                      />
                      {clientErrors.tel && <p className="text-xs text-rose-500 mt-1">{clientErrors.tel}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Email</label>
                      <Input
                        type="email"
                        placeholder="contact@societe.sn"
                        value={formClient.email}
                        onChange={e => setFormClient(f => ({ ...f, email: e.target.value }))}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Informations légales ── */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 bg-amber-400 rounded flex items-center justify-center text-slate-900 text-xs font-black">3</span>
                  Informations légales
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">NINEA</label>
                    <Input
                      placeholder="ex: 00123456-2T1"
                      value={formClient.ninea}
                      onChange={e => setFormClient(f => ({ ...f, ninea: e.target.value }))}
                      className="rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Registre du commerce</label>
                    <Input
                      placeholder="ex: SN-DKR-2020-B-1234"
                      value={formClient.rc || ""}
                      onChange={e => setFormClient(f => ({ ...f, rc: e.target.value }))}
                      className="rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* ── Note ── */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-xs font-black">4</span>
                  Note interne
                </p>
                <Input
                  placeholder="Informations complémentaires sur ce client…"
                  value={formClient.note || ""}
                  onChange={e => setFormClient(f => ({ ...f, note: e.target.value }))}
                  className="rounded-xl"
                />
              </div>

              {/* ── Aperçu ── */}
              {formClient.nom && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Aperçu</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${AVATAR_BG[clients.length % AVATAR_BG.length]} rounded-xl flex items-center justify-center font-bold text-sm shrink-0`}>
                      {initials(formClient.nom)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{formClient.nom}</p>
                      <p className="text-xs text-slate-500">{formClient.contact || "Contact non renseigné"} · {formClient.ville || "Ville non renseignée"}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto text-xs rounded-lg">{formClient.type}</Badge>
                  </div>
                </div>
              )}

              {/* ── Actions ── */}
              <div className="flex gap-3 pt-1">
                <button onClick={sauvegarderClient}
                  className="flex-1 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm py-3 rounded-xl transition-colors shadow-sm">
                  {clientEditId ? "Mettre à jour" : "Enregistrer le client"}
                </button>
                <button onClick={() => setNouveauClientModal(false)}
                  className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 transition-colors font-medium">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}