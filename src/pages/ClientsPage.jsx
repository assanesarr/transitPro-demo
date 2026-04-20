import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClientCard } from '../components/clients/ClientCard';
import { ClientFilters } from '../components/clients/ClientFilters';
import { ClientModal } from '../components/clients/ClientModal';
import { useClients } from '../hooks/useClients';
import { useDossiers } from '../hooks/useDossiers';
import { usePermissions } from '../hooks/usePermissions';
import { printTableClients } from '../utils/printUtils';

export const ClientsPage = () => {
  const { clients, filteredClients, clientSearch, setClientSearch, clientTypeFilter, setClientTypeFilter, ajouterClient, modifierClient, supprimerClient } = useClients();
  const { dossiers } = useDossiers(clients);
  const { hasPermission } = usePermissions();
  const [clientView, setClientView] = useState("grid");
  const [clientModal, setClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const openEditClient = (client) => {
    setEditingClient(client);
    setClientModal(true);
  };

  const handleSaveClient = (clientData) => {
    if (editingClient) {
      modifierClient(editingClient.id, clientData);
    } else {
      ajouterClient(clientData);
    }
    setClientModal(false);
    setEditingClient(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-400 text-sm">{filteredClients.length} affiché(s) sur {clients.length}</p>
        </div>
        
        {hasPermission("client.write") && (
          <button onClick={() => printTableClients(filteredClients, dossiers)} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
            🖨 Imprimer liste
          </button>
        )}
        
        {hasPermission("client.write") && (
          <button onClick={() => { setEditingClient(null); setClientModal(true); }} className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl">
            + Nouveau client
          </button>
        )}
      </div>

      <ClientFilters
        clientSearch={clientSearch}
        setClientSearch={setClientSearch}
        clientTypeFilter={clientTypeFilter}
        setClientTypeFilter={setClientTypeFilter}
        clients={clients}
        clientView={clientView}
        setClientView={setClientView}
      />

      {clientView === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map((c, i) => (
            <ClientCard
              key={c.id}
              client={c}
              index={i}
              dossiers={dossiers.filter(d => d.clientId === c.id)}
              onEdit={() => openEditClient(c)}
              onDelete={() => supprimerClient(c.id)}
              hasDeletePermission={hasPermission("client.delete")}
            />
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  {["Client", "Type", "Ville", "Téléphone", "NINEA", "Dossiers", "Reste", ""].map(h => (
                    <TableHead key={h} className="text-xs font-semibold text-slate-400 first:pl-5 last:pr-4">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((c, i) => {
                  const dossiersClient = dossiers.filter(d => d.clientId === c.id);
                  const resteClient = dossiersClient.reduce((s, d) => s + (d.montantTotal - d.paiements.reduce((ss, p) => ss + p.montant, 0)), 0);
                  return (
                    <TableRow key={c.id} className="border-slate-50 hover:bg-slate-50/60">
                      <TableCell className="pl-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 bg-blue-100 text-blue-700`}>
                            {c.nom.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{c.nom}</p>
                            <p className="text-xs text-slate-400">{c.contact}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><span className="text-xs px-2 py-1 rounded-full bg-slate-100">{c.type}</span></TableCell>
                      <TableCell className="text-sm text-slate-600">{c.ville || "—"}</TableCell>
                      <TableCell className="text-sm font-mono">{c.tel || "—"}</TableCell>
                      <TableCell className="text-xs font-mono">{c.ninea || "—"}</TableCell>
                      <TableCell className="text-sm font-bold">{dossiersClient.length}</TableCell>
                      <TableCell className={`text-sm font-bold ${resteClient > 0 ? "text-rose-500" : "text-emerald-600"}`}>
                        {resteClient > 0 ? `${(resteClient / 1000).toFixed(0)}k` : "Soldé"}
                      </TableCell>
                      <TableCell className="pr-4">
                        <div className="flex gap-1">
                          <button onClick={() => openEditClient(c)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100">✏️</button>
                          {hasPermission("client.delete") && (
                            <button onClick={() => supprimerClient(c.id)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100">🗑</button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <ClientModal
        open={clientModal}
        onClose={() => { setClientModal(false); setEditingClient(null); }}
        onSave={handleSaveClient}
        initialData={editingClient}
      />
    </div>
  );
};