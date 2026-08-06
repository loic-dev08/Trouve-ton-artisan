import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

export function useAuth() {
  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  const login = useCallback(async ({ email, motDePasse }) => {
    try {
      const { token: newToken, user: newUser } = await authService.login({ email, motDePasse })
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)
      navigate('/dashboard')
    } catch (err) {
      throw err
    }
  }, [navigate])

  const register = useCallback(async (formData) => {
    try {
      const { token: newToken, user: newUser } = await authService.register(formData)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)
      navigate('/dashboard')
    } catch (err) {
      throw err
    }
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/')
  }, [navigate])

  const updateUser = useCallback((updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }, [user])

  return {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateUser,
  }
}