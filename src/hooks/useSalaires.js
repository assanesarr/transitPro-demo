import { useState, useMemo } from 'react';

const TAUX_IPRES = 0.06;
const TAUX_IR = 0.08;
const TAUX_PATRON = 0.22;

export const useSalaires = () => {
  const [employes, setEmployes] = useState([
    { id:1, prenom:"Aminata", nom:"Diallo", poste:"Développeuse Senior", dept:"IT", salaire:850000, dateEmbauche:"2021-03-15", matricule:"EMP-001", cnss:"SN-1234567", rib:"SN28 0001 0000 1234", actif:true },
    { id:2, prenom:"Moussa", nom:"Traoré", poste:"Comptable", dept:"Finance", salaire:620000, dateEmbauche:"2019-07-01", matricule:"EMP-002", cnss:"SN-2345678", rib:"SN28 0001 0000 2345", actif:true },
    { id:3, prenom:"Fatou", nom:"Sow", poste:"Chargée RH", dept:"RH", salaire:480000, dateEmbauche:"2022-01-10", matricule:"EMP-003", cnss:"SN-3456789", rib:"SN28 0001 0000 3456", actif:true },
    { id:4, prenom:"Ibrahima", nom:"Ba", poste:"Responsable Ventes", dept:"Commercial", salaire:750000, dateEmbauche:"2020-05-20", matricule:"EMP-004", cnss:"SN-4567890", rib:"SN28 0001 0000 4567", actif:true },
    { id:5, prenom:"Mariama", nom:"Ndiaye", poste:"Analyste Données", dept:"IT", salaire:520000, dateEmbauche:"2026-02-01", matricule:"EMP-005", cnss:"SN-5678901", rib:"SN28 0001 0000 5678", actif:true },
    { id:6, prenom:"Ousmane", nom:"Fall", poste:"Chef de Projet", dept:"Opérations", salaire:690000, dateEmbauche:"2018-11-12", matricule:"EMP-006", cnss:"SN-6789012", rib:"SN28 0001 0000 6789", actif:true },
  ]);
  
  const [moisSalaire, setMoisSalaire] = useState(new Date().getMonth());
  const [anneeSalaire, setAnneeSalaire] = useState(new Date().getFullYear());
  const [mouvementsSalaire, setMouvementsSalaire] = useState([
    { id:1, employeId:1, type:"prime", montant:85000, mois:2, annee:2026, label:"Prime Q1" },
    { id:2, employeId:3, type:"absence", montant:24000, mois:1, annee:2026, label:"Absence 3j" },
    { id:3, employeId:4, type:"avance", montant:150000, mois:3, annee:2026, label:"Avance mai" },
  ]);

  const calcSalaire = (employe, mois, annee) => {
    const mvts = mouvementsSalaire.filter(m => m.employeId === employe.id && m.mois === mois && m.annee === annee);
    const primes = mvts.filter(m => m.type === "prime" || m.type === "bonus").reduce((s, m) => s + m.montant, 0);
    const deductions = mvts.filter(m => m.type === "absence" || m.type === "avance" || m.type === "penalite").reduce((s, m) => s + m.montant, 0);
    const brut = employe.salaire + primes - deductions;
    const ipres = Math.round(brut * TAUX_IPRES);
    const ir = Math.round(brut * TAUX_IR);
    const net = brut - ipres - ir;
    const patron = Math.round(brut * TAUX_PATRON);
    return { brut, ipres, ir, net, patron, primes, deductions };
  };

  const statsSalaires = useMemo(() => {
    const actifs = employes.filter(e => e.actif);
    const masseBrute = actifs.reduce((s, e) => s + calcSalaire(e, moisSalaire, anneeSalaire).brut, 0);
    const masseNette = actifs.reduce((s, e) => s + calcSalaire(e, moisSalaire, anneeSalaire).net, 0);
    const totalPatron = actifs.reduce((s, e) => s + calcSalaire(e, moisSalaire, anneeSalaire).patron, 0);
    return { masseBrute, masseNette, totalPatron, nbEmployes: actifs.length };
  }, [employes, moisSalaire, anneeSalaire]);

  const ajouterEmploye = (employe) => {
    const newId = Math.max(...employes.map(e => e.id)) + 1;
    setEmployes(prev => [...prev, { ...employe, id: newId, salaire: parseInt(employe.salaire) }]);
  };

  const modifierEmploye = (id, updates) => {
    setEmployes(prev => prev.map(e => e.id === id ? { ...e, ...updates, salaire: parseInt(updates.salaire || e.salaire) } : e));
  };

  const supprimerEmploye = (id) => {
    setEmployes(prev => prev.filter(e => e.id !== id));
  };

  return {
    employes,
    moisSalaire, setMoisSalaire,
    anneeSalaire, setAnneeSalaire,
    mouvementsSalaire,
    calcSalaire,
    statsSalaires,
    ajouterEmploye,
    modifierEmploye,
    supprimerEmploye,
  };
};