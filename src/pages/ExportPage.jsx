import React, { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'
import { exportRecordsToExcel } from '../lib/export'

export default function ExportPage() {
  const { vegetables, records } = useData()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [vegetableId, setVegetableId] = useState('')
  const [recorder, setRecorder] = useState('')

  const recorders = useMemo(() => {
    const set = new Set(records.map((r) => r.recorder).filter(Boolean))
    return Array.from(set)
  }, [records])

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (startDate && r.harvest_date < startDate) return false
      if (endDate && r.harvest_date > endDate) return false
      if (vegetableId && String(r.vegetable_id) !== String(vegetableId)) return false
      if (recorder && r.recorder !== recorder) return false
      return true
    })
  }, [records, startDate, endDate, vegetableId, recorder])

  return (
    <div className="max-w-lg">
      <h1 className="page-title">数据导出</h1>
      <p className="page-sub">将收获记录导出为 Excel 文件</p>

      <div className="card space-y-4 mb-5">
        <h2 className="font-semibold text-leaf-800">筛选条件（用于「导出筛选结果」）</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">开始日期</label>
            <input
              type="date"
              className="input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="label">结束日期</label>
            <input
              type="date"
              className="input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">品种</label>
            <select
              className="input"
              value={vegetableId}
              onChange={(e) => setVegetableId(e.target.value)}
            >
              <option value="">全部品种</option>
              {vegetables.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">记录人</label>
            <select className="input" value={recorder} onChange={(e) => setRecorder(e.target.value)}>
              <option value="">全部记录人</option>
              {recorders.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-sm text-leaf-500">符合筛选条件的记录：{filtered.length} 条</p>
      </div>

      <div className="space-y-3">
        <button
          className="btn-primary w-full"
          onClick={() => exportRecordsToExcel(filtered, '菜园收获记录_筛选结果')}
          disabled={filtered.length === 0}
        >
          ⬇️ 导出筛选结果（{filtered.length} 条）
        </button>
        <button
          className="btn-secondary w-full"
          onClick={() => exportRecordsToExcel(records, '菜园收获记录_全部')}
          disabled={records.length === 0}
        >
          ⬇️ 导出全部数据（{records.length} 条）
        </button>
      </div>
    </div>
  )
}
