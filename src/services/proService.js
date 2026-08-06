import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/connexion'
    }
    return Promise.reject(error)
  }
)

export const proService = {
  getProfessionnels: async (params = {}) => {
    const response = await api.get('/api/professionnels', { params })
    return response.data
  },
  getProfessionnelById: async (id) => {
    const response = await api.get(`/api/professionnels/${id}`)
    return response.data
  },
  updateProfilPro: async (data) => {
    const response = await api.put('/api/professionnels/me', data)
    return response.data
  },
  getDemandes: async () => {
    const response = await api.get('/api/demandes')
    return response.data
  },
  createDemande: async ({ professionnelId, objet, message }) => {
    const response = await api.post('/api/demandes', { professionnelId, objet, message })
    return response.data
  },
  updateStatutDemande: async (id, statut) => {
    const response = await api.put(`/api/demandes/${id}/statut`, { statut })
    return response.data
  },
  getDemandeById: async (id) => {
    const response = await api.get(`/api/demandes/${id}`)
    return response.data
  },
  getAvis: async (professionnelId) => {
    const response = await api.get(`/api/professionnels/${professionnelId}/avis`)
    return response.data
  },
  createAvis: async (professionnelId, { note, texte }) => {
    const response = await api.post(`/api/professionnels/${professionnelId}/avis`, { note, texte })
    return response.data
  },
}