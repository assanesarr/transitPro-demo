import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSalaires } from '../hooks/useSalaires';
import { useConfigContext } from '../contexts/ConfigContext';
import { printBulletinSalaire } from '../utils/printUtils';
import { fmt } from '../utils/formatters';

const MOIS_LABELS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const AVATAR_PAL = ["bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"];

export const SalairesPage = () => {
  const { employes, moisSalaire, setMoisSalaire, anneeSalaire, setAnneeSalaire, calcSalaire, statsSalaires } = useSalaires();
  const { config } = useConfigContext();
  const [empSalaireModal, setEmpSalaireModal] = useState(false);
  const [editEmpSalaireId, setEditEmpSalaireId] = useState(null);
  const [empSalaireForm, setEmpSalaireForm] = useState({ prenom: "", nom: "", poste: "", dept: "Transit", salaire: "", dateEmbauche: "", matricule: "", cnss: "", rib: "", actif: true });

  const openAddEmp = () => {
    setEmpSalaireForm({ prenom: "", nom: "", poste: "", dept: "Transit", salaire: "", dateEmbauche: "", matricule: "", cnss: "", rib: "", actif: true });
    setEditEmpSalaireId(null);
    setEmpSalaireModal(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Gestion des salaires</h1>
          <p className="text-slate-400 text-sm">{employes.filter(e => e.actif).length} employés actifs · {MOIS_LABELS[moisSalaire]} {anneeSalaire}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={String(moisSalaire)} onValueChange={v => setMoisSalaire(parseInt(v))}>
            <SelectTrigger className="w-36 h-9 text-xs rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{MOIS_LABELS.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={String(anneeSalaire)} onValueChange={v => setAnneeSalaire(parseInt(v))}>
            <SelectTrigger className="w-24 h-9 text-xs rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{[2024, 2025, 2026, 2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
          </Select>
          <button onClick={openAddEmp} className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl">
            + Ajouter employé
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Masse salariale brute", value: fmt(statsSalaires.masseBrute), bg: "bg-white" },
          { label: "Masse nette à payer", value: fmt(statsSalaires.masseNette), bg: "bg-emerald-50" },
          { label: "Charges patronales", value: fmt(statsSalaires.totalPatron), bg: "bg-rose-50" },
          { label: "Nbre employés actifs", value: statsSalaires.nbEmployes, bg: "bg-blue-50" },
        ].map(k => (
          <Card key={k.label} className={`rounded-2xl border-0 shadow-sm ${k.bg}`}>
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-slate-500 mb-1">{k.label}</p>
              <p className="text-lg font-black text-slate-900 tabular-nums">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tableau des bulletins */}
      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">Bulletins de salaire — {MOIS_LABELS[moisSalaire]} {anneeSalaire}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                {["Employé", "Dept", "Salaire base", "Brut", "IPRES", "IR", "Net à payer", ""].map(h => (
                  <TableHead key={h} className="text-xs font-semibold text-slate-400 first:pl-5 last:pr-4 py-3">{h}</TableHead>
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
                    <TableCell><Badge variant="outline" className="text-xs rounded-lg">{e.dept}</Badge></TableCell>
                    <TableCell className="tabular-nums text-slate-700 text-sm">{fmt(e.salaire)}</TableCell>
                    <TableCell className="tabular-nums font-semibold text-slate-800 text-sm">{fmt(s.brut)}</TableCell>
                    <TableCell className="tabular-nums text-rose-500 text-sm">−{fmt(s.ipres)}</TableCell>
                    <TableCell className="tabular-nums text-rose-500 text-sm">−{fmt(s.ir)}</TableCell>
                    <TableCell className="tabular-nums font-bold text-emerald-600 text-base">{fmt(s.net)}</TableCell>
                    <TableCell className="pr-4 py-3">
                      <button onClick={() => printBulletinSalaire(e, moisSalaire, anneeSalaire, s, config.entreprise)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700">
                        🖨 Bulletin
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};