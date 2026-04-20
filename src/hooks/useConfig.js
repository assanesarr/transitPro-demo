 import { useState } from 'react';
import { CATEGORIES_DECAISSEMENT, TYPES_PRESTATION, MODES_PAIEMENT } from '../constants/types';

export const useConfig = () => {
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
    preferences: {
      devise: "FCFA",
      langue: "fr",
      dateFormat: "DD/MM/YYYY",
      tauxTVA: 18,
      delaiPaiement: 30,
      alerteEcheance: 7,
      notifEmail: true,
      notifSMS: false,
      signatureAuto: true,
    },
    categoriesDecaiss: [...CATEGORIES_DECAISSEMENT],
    typesPrestation: [...TYPES_PRESTATION],
    modesPaiement: [...MODES_PAIEMENT],
    rolePermissions: {
      "Administrateur": ["dossier.read", "dossier.write", "dossier.delete", "client.read", "client.write", "client.delete", "paiement.read", "paiement.write", "paiement.delete", "decaissement.read", "decaissement.write", "decaissement.delete", "config.read", "config.write", "solde.view", "personnel.manage"],
      "Transitaire": ["dossier.read", "dossier.write", "client.read", "client.write", "paiement.read", "paiement.write", "decaissement.read", "decaissement.write"],
      "Agent douanier": ["dossier.read", "client.read", "decaissement.read", "decaissement.write"],
      "Comptable": ["dossier.read", "client.read", "paiement.read", "paiement.write", "decaissement.read", "solde.view"],
      "Commercial": ["dossier.read", "dossier.write", "client.read", "client.write"],
      "Directeur": ["dossier.read", "dossier.write", "dossier.delete", "client.read", "client.write", "client.delete", "paiement.read", "paiement.write", "decaissement.read", "solde.view"],
      "Stagiaire": ["dossier.read", "client.read"],
    },
  });

  const updateConfig = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  return { config, updateConfig };
};