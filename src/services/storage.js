// Service de stockage local pour la persistance des données
class StorageService {
  constructor() {
    this.prefix = 'transitpro_';
  }

  getKey(key) {
    return `${this.prefix}${key}`;
  }

  // Sauvegarde des données
  save(key, data) {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  }

  // Chargement des données
  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(this.getKey(key));
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Storage load error:', error);
      return defaultValue;
    }
  }

  // Suppression
  remove(key) {
    localStorage.removeItem(this.getKey(key));
  }

  // Effacer toutes les données
  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }

  // Sauvegarde de la session utilisateur
  saveUser(user) {
    this.save('user', user);
  }

  loadUser() {
    return this.load('user');
  }

  // Sauvegarde de la configuration
  saveConfig(config) {
    this.save('config', config);
  }

  loadConfig(defaultConfig) {
    return this.load('config', defaultConfig);
  }

  // Sauvegarde des dossiers
  saveDossiers(dossiers) {
    this.save('dossiers', dossiers);
  }

  loadDossiers(defaultDossiers) {
    return this.load('dossiers', defaultDossiers);
  }

  // Sauvegarde des clients
  saveClients(clients) {
    this.save('clients', clients);
  }

  loadClients(defaultClients) {
    return this.load('clients', defaultClients);
  }

  // Sauvegarde des employés
  saveEmployes(employes) {
    this.save('employes', employes);
  }

  loadEmployes(defaultEmployes) {
    return this.load('employes', defaultEmployes);
  }

  // Export des données
  exportData() {
    return {
      dossiers: this.load('dossiers'),
      clients: this.load('clients'),
      employes: this.load('employes'),
      config: this.load('config'),
      exportedAt: new Date().toISOString(),
    };
  }

  // Import des données
  importData(data) {
    if (data.dossiers) this.save('dossiers', data.dossiers);
    if (data.clients) this.save('clients', data.clients);
    if (data.employes) this.save('employes', data.employes);
    if (data.config) this.save('config', data.config);
    return true;
  }
}

export const storage = new StorageService();