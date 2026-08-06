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

export const authService = {
  login: async ({ email, motDePasse }) => {
    const response = await api.post('/api/auth/connexion', { email, motDePasse })
    return response.data
  },
  register: async ({ prenom, nom, email, motDePasse, role }) => {
    const response = await api.post('/api/auth/inscription', { prenom, nom, email, motDePasse, role })
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },
  updateMe: async ({ prenom, nom, email, ville }) => {
    const response = await api.put('/api/auth/me', { prenom, nom, email, ville })
    return response.data
  },
  updatePassword: async ({ actuel, nouveau }) => {
    const response = await api.put('/api/auth/mot-de-passe', { actuel, nouveau })
    return response.data
  },
  deleteAccount: async () => {
    const response = await api.delete('/api/auth/me')
    return response.data
  },
}