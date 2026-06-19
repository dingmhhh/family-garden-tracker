import React, { createContext, useContext, useEffect, useCallback, useState } from 'react'
import { supabase } from '../lib/supabase'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [vegetables, setVegetables] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadVegetables = useCallback(async () => {
    const { data, error } = await supabase
      .from('vegetables')
      .select('*')
      .order('name', { ascending: true })
    if (error) {
      setError(error.message)
      return []
    }
    setVegetables(data || [])
    return data || []
  }, [])

  const loadRecords = useCallback(async () => {
    const { data, error } = await supabase
      .from('harvest_records')
      .select('*, vegetable:vegetables(id, name, default_unit)')
      .order('harvest_date', { ascending: false })
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
      return []
    }
    const normalized = (data || []).map((r) => ({
      ...r,
      vegetable_name: r.vegetable?.name || null,
    }))
    setRecords(normalized)
    return normalized
  }, [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError('')
    await Promise.all([loadVegetables(), loadRecords()])
    setLoading(false)
  }, [loadVegetables, loadRecords])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // ---------- 蔬菜品种 CRUD ----------
  async function addVegetable({ name, default_unit, note }) {
    const { error } = await supabase
      .from('vegetables')
      .insert([{ name, default_unit, note }])
    if (error) return { success: false, message: error.message }
    await loadVegetables()
    return { success: true }
  }

  async function updateVegetable(id, { name, default_unit, note }) {
    const { error } = await supabase
      .from('vegetables')
      .update({ name, default_unit, note, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) return { success: false, message: error.message }
    await loadVegetables()
    return { success: true }
  }

  async function deleteVegetable(id) {
    const { error } = await supabase.from('vegetables').delete().eq('id', id)
    if (error) return { success: false, message: error.message }
    await loadVegetables()
    await loadRecords()
    return { success: true }
  }

  // ---------- 收获记录 CRUD ----------
  async function addRecord({ harvest_date, vegetable_id, amount, unit, recorder, note }) {
    const { error } = await supabase.from('harvest_records').insert([
      { harvest_date, vegetable_id, amount, unit, recorder, note },
    ])
    if (error) return { success: false, message: error.message }
    await loadRecords()
    return { success: true }
  }

  async function updateRecord(id, { harvest_date, vegetable_id, amount, unit, recorder, note }) {
    const { error } = await supabase
      .from('harvest_records')
      .update({
        harvest_date,
        vegetable_id,
        amount,
        unit,
        recorder,
        note,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    if (error) return { success: false, message: error.message }
    await loadRecords()
    return { success: true }
  }

  async function deleteRecord(id) {
    const { error } = await supabase.from('harvest_records').delete().eq('id', id)
    if (error) return { success: false, message: error.message }
    await loadRecords()
    return { success: true }
  }

  return (
    <DataContext.Provider
      value={{
        vegetables,
        records,
        loading,
        error,
        reload: loadAll,
        addVegetable,
        updateVegetable,
        deleteVegetable,
        addRecord,
        updateRecord,
        deleteRecord,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData 必须在 DataProvider 内部使用')
  return ctx
}
