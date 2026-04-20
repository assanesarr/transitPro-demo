import { printHTML } from '../components/common/PrintService';
import { fmt, totalPaye, totalDecaisse, soldeDecaisse, resteApayer } from './formatters';
import { STATUTS_DOSSIER } from '../constants/statuts';

export const printTableClients = (clients, dossiers, entreprise) => {
  const rows = clients.map((c, i) => {
    const dos = dossiers.filter(d => d.clientId === c.id);
    const total = dos.reduce((s, d) => s + d.montantTotal, 0);
    const paye = dos.reduce((s, d) => s + totalPaye(d), 0);
    const reste = total - paye;
    const actifs = dos.filter(d => !["cloture", "annule"].includes(d.statut)).length;
    return `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${c.nom}</strong><br/><span style="color:#64748b;font-size:9px;">${c.contact}</span></td>
        <td>${c.type || "—"}</td>
        <td>${c.ville || "—"}</td>
        <td>${c.tel || "—"}</td>
        <td>${c.ninea || "—"}</td>
        <td class="text-center">${dos.length}</td>
        <td class="text-center">${actifs}</td>
        <td class="text-right">${total.toLocaleString("fr-FR")} FCFA</td>
        <td class="text-right ${reste > 0 ? "red" : "green"}">${reste > 0 ? reste.toLocaleString("fr-FR") + " FCFA" : "Soldé"}</td>
      </tr>
    `;
  }).join("");

  const totalGlobal = clients.reduce((s, c) => s + dossiers.filter(d => d.clientId === c.id).reduce((ss, d) => ss + d.montantTotal, 0), 0);
  const payeGlobal = clients.reduce((s, c) => s + dossiers.filter(d => d.clientId === c.id).reduce((ss, d) => d.paiements.reduce((sss, p) => sss + p.montant, 0) + ss, 0), 0);

  const html = `
    <div class="header">
      <div class="logo-box">
        <div class="logo">T</div>
        <div>
          <div class="company-name">${entreprise.nom}</div>
          <div class="company-sub">${entreprise.adresse} · ${entreprise.ville}</div>
        </div>
      </div>
      <div class="print-date"><strong>Liste des Clients</strong><br/>${clients.length} clients<br/>Imprimé le ${new Date().toLocaleDateString("fr-FR")}</div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Total clients</div><div class="kpi-value">${clients.length}</div></div>
      <div class="kpi"><div class="kpi-label">Dossiers total</div><div class="kpi-value">${dossiers.length}</div></div>
      <div class="kpi"><div class="kpi-label">Facturation totale</div><div class="kpi-value">${(totalGlobal / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Reste à percevoir</div><div class="kpi-value red">${((totalGlobal - payeGlobal) / 1000000).toFixed(2)} M FCFA</div></div>
    </div>
    <table>
      <thead><tr><th>#</th><th>Client</th><th>Type</th><th>Ville</th><th>Téléphone</th><th>NINEA</th><th>Dossiers</th><th>Actifs</th><th class="text-right">Facturé</th><th class="text-right">Reste</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="footer"><span>© ${entreprise.nom} — Document confidentiel</span><span>Page 1/1</span></div>
  `;
  printHTML(html, "Liste des Clients — " + entreprise.nom);
};

export const printTableDossiers = (dossiers, clients, entreprise) => {
  const rows = dossiers.map((d, i) => {
    const client = clients.find(c => c.id === d.clientId);
    const paye = totalPaye(d);
    const decaiss = totalDecaisse(d);
    const solde = soldeDecaisse(d);
    return `
      <tr>
        <td style="font-family:monospace;">${d.id}</td>
        <td>${client?.nom || "—"}<br/><span style="color:#64748b;font-size:9px;">${d.type}</span></td>
        <td style="font-size:9px;">${d.description}</td>
        <td><span class="badge">${STATUTS_DOSSIER[d.statut]?.label || d.statut}</span></td>
        <td class="text-right">${d.montantTotal.toLocaleString("fr-FR")}</td>
        <td class="text-right green">${paye.toLocaleString("fr-FR")}</td>
        <td class="text-right red">${decaiss.toLocaleString("fr-FR")}</td>
        <td class="text-right ${solde >= 0 ? "green" : "red"}">${solde >= 0 ? "+" : ""}${solde.toLocaleString("fr-FR")}</td>
        <td>${d.dateEcheance || "—"}</td>
      </tr>
    `;
  }).join("");

  const totFact = dossiers.reduce((s, d) => s + d.montantTotal, 0);
  const totPaye = dossiers.reduce((s, d) => s + totalPaye(d), 0);
  const totDecaiss = dossiers.reduce((s, d) => s + totalDecaisse(d), 0);

  const html = `
    <div class="header">
      <div class="logo-box">
        <div class="logo">T</div>
        <div>
          <div class="company-name">${entreprise.nom}</div>
          <div class="company-sub">${entreprise.adresse} · ${entreprise.ville}</div>
        </div>
      </div>
      <div class="print-date"><strong>Liste des Dossiers</strong><br/>${dossiers.length} dossier(s)</div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Total facturé</div><div class="kpi-value">${(totFact / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Encaissé</div><div class="kpi-value green">${(totPaye / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Décaissé</div><div class="kpi-value red">${(totDecaiss / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Solde net</div><div class="kpi-value">${((totPaye - totDecaiss) / 1000000).toFixed(2)} M FCFA</div></div>
    </div>
    <table>
      <thead><tr><th>N° Dossier</th><th>Client / Type</th><th>Description</th><th>Statut</th><th class="text-right">Facturé</th><th class="text-right">Encaissé</th><th class="text-right">Décaissé</th><th class="text-right">Solde net</th><th>Échéance</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="footer"><span>© ${entreprise.nom}</span><span>Page 1/1</span></div>
  `;
  printHTML(html, "Liste des Dossiers — " + entreprise.nom);
};

export const printRapportAnnuel = (dossiers, clients, entreprise) => {
  const annee = new Date().getFullYear();
  const totFact = dossiers.reduce((s, d) => s + d.montantTotal, 0);
  const totPaye = dossiers.reduce((s, d) => s + totalPaye(d), 0);
  const totDecaiss = dossiers.reduce((s, d) => s + totalDecaisse(d), 0);
  const soldeNet = totPaye - totDecaiss;
  const reste = totFact - totPaye;

  const html = `
    <div class="header">
      <div class="logo-box">
        <div class="logo">T</div>
        <div>
          <div class="company-name">${entreprise.nom}</div>
          <div class="company-sub">${entreprise.adresse} · ${entreprise.ville}</div>
        </div>
      </div>
      <div class="print-date"><strong>Rapport Annuel ${annee}</strong><br/>Synthèse complète</div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Chiffre d'affaires</div><div class="kpi-value">${(totFact / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Encaissements</div><div class="kpi-value green">${(totPaye / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Décaissements</div><div class="kpi-value red">${(totDecaiss / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Solde net</div><div class="kpi-value">${soldeNet >= 0 ? "+" : ""}${(soldeNet / 1000000).toFixed(2)} M FCFA</div></div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Reste à percevoir</div><div class="kpi-value amber">${(reste / 1000000).toFixed(2)} M FCFA</div></div>
      <div class="kpi"><div class="kpi-label">Total dossiers</div><div class="kpi-value">${dossiers.length}</div></div>
      <div class="kpi"><div class="kpi-label">Dossiers actifs</div><div class="kpi-value blue">${dossiers.filter(d => !["cloture", "annule"].includes(d.statut)).length}</div></div>
      <div class="kpi"><div class="kpi-label">Dossiers clôturés</div><div class="kpi-value green">${dossiers.filter(d => d.statut === "cloture").length}</div></div>
    </div>
    <div class="footer">
      <span>© ${annee} ${entreprise.nom}</span>
      <span>Rapport généré le ${new Date().toLocaleDateString("fr-FR")}</span>
    </div>
  `;
  printHTML(html, "Rapport Annuel " + annee + " — " + entreprise.nom);
};

// Ajouter à la fin du fichier printUtils.js existant

export const printBulletinSalaire = (employe, moisIdx, annee, calcResult, entreprise) => {
  const moisLabels = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const moisLabel = moisLabels[moisIdx];
  const now = new Date().toLocaleDateString("fr-FR");
  const { brut, ipres, ir, net, patron, primes, deductions } = calcResult;
  const initials = (employe.prenom[0] || "") + (employe.nom[0] || "");

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Bulletin de salaire — ${employe.prenom} ${employe.nom} — ${moisLabel} ${annee}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Sora',sans-serif;font-size:11px;color:#1e293b;background:#fff;}
        .page{max-width:740px;margin:0 auto;padding:24px;}
        .header{background:#0f172a;color:white;padding:20px 24px;display:flex;justify-content:space-between;align-items:flex-start;}
        .logo{width:40px;height:40px;background:#f59e0b;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#0f172a;}
        .co-name{font-size:16px;font-weight:700;}
        .co-sub{font-size:9px;color:#94a3b8;margin-top:3px;}
        .doc-title{font-size:10px;color:#94a3b8;text-transform:uppercase;}
        .doc-month{font-size:18px;font-weight:700;color:white;margin-top:2px;}
        .emp-row{background:#f8fafc;padding:14px 24px;display:flex;align-items:center;gap:16px;}
        .avatar{width:44px;height:44px;background:#dbeafe;color:#1d4ed8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;}
        .emp-name{font-size:15px;font-weight:700;}
        .body{padding:16px 24px;}
        .section{background:#f8fafc;border-radius:10px;margin-bottom:10px;overflow:hidden;}
        table.items{width:100%;border-collapse:collapse;}
        table.items td{padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:11px;}
        .total-row{background:#0f172a;color:white;padding:14px 20px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
        .total-amount{font-size:26px;font-weight:800;}
        .footer{background:#0f172a;padding:10px 24px;display:flex;justify-content:space-between;font-size:9px;color:#64748b;}
        .text-right{text-align:right;}
        .green{color:#15803d;}
        .red{color:#be123c;}
        .pos{color:#15803d;}
        .neg{color:#be123c;}
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div>
            <div class="logo">T</div>
            <div class="co-name">${entreprise.nom}</div>
            <div class="co-sub">${entreprise.adresse} · ${entreprise.ville}</div>
          </div>
          <div class="text-right">
            <div class="doc-title">Bulletin de salaire</div>
            <div class="doc-month">${moisLabel} ${annee}</div>
            <div style="font-size:9px;color:#64748b;">Émis le ${now}</div>
          </div>
        </div>

        <div class="emp-row">
          <div class="avatar">${initials}</div>
          <div>
            <div class="emp-name">${employe.prenom} ${employe.nom}</div>
            <div style="font-size:10px;color:#64748b;">${employe.poste} · ${employe.dept}</div>
          </div>
          <div class="text-right" style="margin-left:auto;">
            <div style="font-size:9px;color:#94a3b8;">Salaire de base</div>
            <div style="font-size:16px;font-weight:700;">${employe.salaire.toLocaleString("fr-FR")} FCFA</div>
          </div>
        </div>

        <div class="body">
          <div class="section">
            <table class="items">
              <tr><td>Salaire de base</td><td class="text-right">${employe.salaire.toLocaleString("fr-FR")} FCFA</td></tr>
              ${primes > 0 ? `<tr><td>Primes & bonus</td><td class="text-right pos">+${primes.toLocaleString("fr-FR")} FCFA</td></tr>` : ""}
              ${deductions > 0 ? `<tr><td>Déductions</td><td class="text-right neg">−${deductions.toLocaleString("fr-FR")} FCFA</td></tr>` : ""}
              <tr style="background:#f1f5f9;"><td><strong>Salaire brut</strong></td><td class="text-right"><strong>${brut.toLocaleString("fr-FR")} FCFA</strong></td></tr>
            </table>
          </div>

          <div class="section">
            <table class="items">
              <tr><td>IPRES salarié (6%)</td><td class="text-right neg">−${ipres.toLocaleString("fr-FR")} FCFA</td></tr>
              <tr><td>Impôt sur le Revenu (8%)</td><td class="text-right neg">−${ir.toLocaleString("fr-FR")} FCFA</td></tr>
            </table>
          </div>

          <div class="total-row">
            <div>
              <div style="font-size:9px;color:#94a3b8;">Net à payer</div>
              <div class="total-amount">${net.toLocaleString("fr-FR")} FCFA</div>
            </div>
            <div class="text-right">
              <div style="font-size:9px;color:#94a3b8;">Date de paiement</div>
              <div style="font-size:14px;font-weight:700;">30 ${moisLabel} ${annee}</div>
            </div>
          </div>

          <div style="background:#fff3cd;padding:10px 16px;border-radius:8px;display:flex;justify-content:space-between;margin-bottom:16px;">
            <div>
              <div style="font-size:10px;font-weight:600;color:#92400e;">Charges patronales (22%)</div>
              <div style="font-size:9px;color:#78350f;">Cotisations employeur</div>
            </div>
            <div style="font-size:14px;font-weight:700;color:#92400e;">${patron.toLocaleString("fr-FR")} FCFA</div>
          </div>
        </div>

        <div class="footer">
          <div>${entreprise.nom} · ${entreprise.email || ""}</div>
          <div>${employe.matricule || "—"} · ${moisLabel.toUpperCase()}-${annee}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const win = window.open("", "_blank", "width=820,height=700");
  win.document.write(html);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); win.close(); }, 500);
};