import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

// ── useFetch ──────────────────────────────────────────────────
// Hook générique pour les appels API GET avec Axios.
// Gère automatiquement les états loading, data, error.
//
// Utilisation :
//   const { data, loading, error, refetch } = useFetch('/api/professionnels')
//
// Avec options :
//   const { data } = useFetch('/api/professionnels', {
//     params: { specialite: 'réseau', ville: 'Melun' },
//     skip: !isAuthenticated,  // ne pas appeler si non connecté
//   })
// ─────────────────────────────────────────────────────────────

export function useFetch(url, options = {}) {
  const { params = {}, skip = false, dependencies = [] } = options

  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(!skip)
  const [error, setError]     = useState(null)

  const fetchData = useCallback(async () => {
    if (skip) return

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(url, {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      setData(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, skip, JSON.stringify(params), ...dependencies])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// ── useMutation ───────────────────────────────────────────────
// Hook pour les appels POST / PUT / DELETE (mutations).
// Ne s'exécute pas automatiquement — à déclencher manuellement.
//
// Utilisation :
//   const { mutate, loading, error, data } = useMutation('PUT', '/api/auth/me')
//   await mutate({ prenom: 'Loic', nom: 'Dupont' })
// ─────────────────────────────────────────────────────────────

export function useMutation(method = 'POST', url) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const mutate = useCallback(async (body = {}) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }

      const response = await axios({
        method: method.toLowerCase(),
        url,
        data: body,
        headers,
      })

      setData(response.data)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Une erreur est survenue.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [method, url])

  return { mutate, data, loading, error }
}
