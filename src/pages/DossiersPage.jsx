import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DossierCard } from '../components/dossiers/DossierCard';
import { DossierFilters } from '../components/dossiers/DossierFilters';
import { NouveauDossierModal } from '../components/dossiers/NouveauDossierModal';
import { PaiementModal } from '../components/dossiers/PaiementModal';
import { DecaissementModal } from '../components/dossiers/DecaissementModal';
import { useDossiers } from '../hooks/useDossiers';
import { useClients } from '../hooks/useClients';
import { usePermissions } from '../hooks/usePermissions';
import { printTableDossiers } from '../utils/printUtils';
import {DossierDetail} from '../components/dossiers/DossierDetail'

export const DossiersPage = () => {
  const { clients } = useClients();
  const { hasPermission } = usePermissions();
  const {
    dossiers,
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
  } = useDossiers(clients);

  const [dossierView, setDossierView] = useState("grid");
  const [dossierActif, setDossierActif] = useState(null);
  const [vue, setVue] = useState("list");
  const [paiementModal, setPaiementModal] = useState(false);
  const [paiementDossierId, setPaiementDossierId] = useState(null);
  const [decaissementModal, setDecaissementModal] = useState(false);
  const [decaissementDossierId, setDecaissementDossierId] = useState(null);
  const [nouveauDossierModal, setNouveauDossierModal] = useState(false);

  if (vue === "detail" && dossierActif) {
    return (
      <DossierDetail
        dossier={dossierActif}
        clients={clients}
        onBack={() => setVue("list")}
        onUpdate={mettreAJourDossier}
        onDelete={supprimerDossier}
        onPaiement={(id) => { setPaiementDossierId(id); setPaiementModal(true); }}
        onDecaissement={(id) => { setDecaissementDossierId(id); setDecaissementModal(true); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dossiers</h1>
          <p className="text-slate-400 text-sm">{dossiers.length} dossiers au total</p>
        </div>
        
        <button
          onClick={() => printTableDossiers(dossiersFiltres, clients)}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
        >
          🖨 Imprimer dossiers
        </button>
        
        {hasPermission("dossier.write") && (
          <button onClick={() => setNouveauDossierModal(true)} className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl">
            + Nouveau dossier
          </button>
        )}
      </div>

      <DossierFilters
        filtreStatut={filtreStatut}
        setFiltreStatut={setFiltreStatut}
        filtreClient={filtreClient}
        setFiltreClient={setFiltreClient}
        filtrePrio={filtrePrio}
        setFiltrePrio={setFiltrePrio}
        recherche={recherche}
        setRecherche={setRecherche}
        clients={clients}
        dossierView={dossierView}
        setDossierView={setDossierView}
        resultCount={dossiersFiltres.length}
      />

      {dossierView === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {dossiersFiltres.map((d, i) => (
            <DossierCard
              key={d.id}
              dossier={d}
              client={clients.find(c => c.id === d.clientId)}
              index={i}
              onClick={() => { setDossierActif(d); setVue("detail"); }}
              onPaiement={() => { setPaiementDossierId(d.id); setPaiementModal(true); }}
              onDelete={() => supprimerDossier(d.id)}
              hasDeletePermission={hasPermission("dossier.delete")}
            />
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  {["Dossier", "Client", "Type", "Statut", "Facturé", "Encaissé", "Décaissé", "Solde net", "Éch.", ""].map(h => (
                    <TableHead key={h} className="text-xs font-semibold text-slate-400 first:pl-5 last:pr-4">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dossiersFiltres.map((d, i) => {
                  const client = clients.find(c => c.id === d.clientId);
                  return (
                    <TableRow key={d.id} className="cursor-pointer hover:bg-slate-50" onClick={() => { setDossierActif(d); setVue("detail"); }}>
                      {/* Table cells content */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <NouveauDossierModal
        open={nouveauDossierModal}
        onClose={() => setNouveauDossierModal(false)}
        onSave={ajouterDossier}
        clients={clients}
      />

      <PaiementModal
        open={paiementModal}
        onClose={() => setPaiementModal(false)}
        onSave={ajouterPaiement}
        dossierId={paiementDossierId}
        dossiers={dossiers}
      />

      <DecaissementModal
        open={decaissementModal}
        onClose={() => setDecaissementModal(false)}
        onSave={ajouterDecaissement}
        dossierId={decaissementDossierId}
      />
    </div>
  );
};