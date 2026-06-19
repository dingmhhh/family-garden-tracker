import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import Login from './components/Login'
import Layout from './components/Layout'
import QuickEntry from './pages/QuickEntry'
import Vegetables from './pages/Vegetables'
import History from './pages/History'
import Stats from './pages/Stats'
import Charts from './pages/Charts'
import ExportPage from './pages/ExportPage'
import Settings from './pages/Settings'

function Gate() {
  const { isAuthed, ready } = useAuth()

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-leaf-500">
        加载中…
      </div>
    )
  }

  if (!isAuthed) {
    return <Login />
  }

  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<QuickEntry />} />
          <Route path="vegetables" element={<Vegetables />} />
          <Route path="history" element={<History />} />
          <Route path="stats" element={<Stats />} />
          <Route path="charts" element={<Charts />} />
          <Route path="export" element={<ExportPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </DataProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
