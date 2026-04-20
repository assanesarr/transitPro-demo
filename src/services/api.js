// Service API pour les appels backend (simulation)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Dossiers
  async getDossiers() {
    return this.request('/dossiers');
  }

  async getDossier(id) {
    return this.request(`/dossiers/${id}`);
  }

  async createDossier(data) {
    return this.request('/dossiers', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateDossier(id, data) {
    return this.request(`/dossiers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteDossier(id) {
    return this.request(`/dossiers/${id}`, { method: 'DELETE' });
  }

  // Clients
  async getClients() {
    return this.request('/clients');
  }

  async createClient(data) {
    return this.request('/clients', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateClient(id, data) {
    return this.request(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteClient(id) {
    return this.request(`/clients/${id}`, { method: 'DELETE' });
  }

  // Paiements
  async addPaiement(dossierId, data) {
    return this.request(`/dossiers/${dossierId}/paiements`, { method: 'POST', body: JSON.stringify(data) });
  }

  async deletePaiement(dossierId, paiementId) {
    return this.request(`/dossiers/${dossierId}/paiements/${paiementId}`, { method: 'DELETE' });
  }

  // Décaissements
  async addDecaissement(dossierId, data) {
    return this.request(`/dossiers/${dossierId}/decaissements`, { method: 'POST', body: JSON.stringify(data) });
  }

  async deleteDecaissement(dossierId, decaissementId) {
    return this.request(`/dossiers/${dossierId}/decaissements/${decaissementId}`, { method: 'DELETE' });
  }

  // Statistiques
  async getStats() {
    return this.request('/stats');
  }

  async getRapportAnnuel(annee) {
    return this.request(`/rapports/annuel/${annee}`);
  }
}

export const api = new ApiService();