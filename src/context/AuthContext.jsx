import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const AUTH_KEY = 'garden_auth_ok'
const RECORDER_KEY = 'garden_recorder_name'

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false)
  const [recorder, setRecorder] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const ok = localStorage.getItem(AUTH_KEY) === 'true'
    const name = localStorage.getItem(RECORDER_KEY) || ''
    setIsAuthed(ok)
    setRecorder(name)
    setReady(true)
  }, [])

  function login(password) {
    const correctPassword = import.meta.env.VITE_APP_PASSWORD
    if (!correctPassword) {
      // 没有配置密码时，默认放行，方便本地开发调试
      localStorage.setItem(AUTH_KEY, 'true')
      setIsAuthed(true)
      return { success: true }
    }
    if (password === correctPassword) {
      localStorage.setItem(AUTH_KEY, 'true')
      setIsAuthed(true)
      return { success: true }
    }
    return { success: false, message: '密码不正确，请再试一次' }
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthed(false)
  }

  function updateRecorder(name) {
    setRecorder(name)
    localStorage.setItem(RECORDER_KEY, name)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthed, ready, login, logout, recorder, updateRecorder }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内部使用')
  return ctx
}
