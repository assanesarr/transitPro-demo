
export const printHTML = (html, title = "Impression") => {
  const win = window.open("", "_blank", "width=900,height=700");
  if (win) {
    win.document.body.innerHTML = `<!DOCTYPE html><html lang="fr"><head>
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
        .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;}
        .kpi{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;}
        .kpi-label{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px;}
        .kpi-value{font-size:15px;font-weight:700;}
        .badge{display:inline-block;padding:1px 7px;border-radius:9999px;font-size:9px;font-weight:600;}
        .badge-blue{background:#dbeafe;color:#1d4ed8;}
        .badge-green{background:#dcfce7;color:#15803d;}
        .badge-amber{background:#fef3c7;color:#b45309;}
        .badge-rose{background:#ffe4e6;color:#be123c;}
        .footer{margin-top:20px;padding-top:10px;border-top:1px solid #e2e8f0;font-size:9px;color:#94a3b8;display:flex;justify-content:space-between;}
        .text-right{text-align:right;}
        .green{color:#15803d;font-weight:600;}
        .red{color:#be123c;font-weight:600;}
        @media print{body{padding:0;} @page{margin:1.2cm;size:A4;}}
      </style>
    </head><body>${html}</body></html>`;
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 400);
  }
};