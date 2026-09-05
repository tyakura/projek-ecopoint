import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken, clearToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    api
      .get('/users/me')
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  async function register(payload) {
    const data = await api.post('/auth/register', payload)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    api.post('/auth/logout').catch(() => {})
    clearToken()
    setUser(null)
  }

  async function refreshUser() {
    const u = await api.get('/users/me')
    setUser(u)
    return u
  }

  async function updateProfile(name, avatar) {
    const u = await api.put('/users/me', { name, avatar })
    setUser(u)
    return u
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}