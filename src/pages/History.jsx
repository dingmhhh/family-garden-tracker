import React, { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'
import RecordEditModal from '../components/RecordEditModal'

export default function History() {
  const { vegetables, records, deleteRecord } = useData()

  const [filters, setFilters] = useState({
    mode: 'range', // 'range' | 'single'
    startDate: '',
    endDate: '',
    singleDate: '',
    vegetableId: '',
    recorder: '',
  })
  const [editingRecord, setEditingRecord] = useState(null)

  const recorders = useMemo(() => {
    const set = new Set(records.map((r) => r.recorder).filter(Boolean))
    return Array.from(set)
  }, [records])

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filters.mode === 'single' && filters.singleDate) {
        if (r.harvest_date !== filters.singleDate) return false
      }
      if (filters.mode === 'range') {
        if (filters.startDate && r.harvest_date < filters.startDate) return false
        if (filters.endDate && r.harvest_date > filters.endDate) return false
      }
      if (filters.vegetableId && String(r.vegetable_id) !== String(filters.vegetableId)) {
        return false
      }
      if (filters.recorder && r.recorder !== filters.recorder) return false
      return true
    })
  }, [records, filters])

  async function handleDelete(record) {
    const ok = window.confirm(
      `确定要删除这条记录吗？\n${record.harvest_date} ${record.vegetable_name || ''} ${record.amount}${record.unit}`
    )
    if (!ok) return
    const result = await deleteRecord(record.id)
    if (!result.success) alert('删除失败：' + result.message)
  }

  return (
    <div>
      <h1 className="page-title">历史记录</h1>
      <p className="page-sub">查看并管理所有收获记录</p>

      {/* 筛选条件 */}
      <div className="card mb-5 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <button
            className={`btn-sm rounded-lg ${
              filters.mode === 'range' ? 'btn-primary' : 'btn-secondary'
            }`}
            onClick={() => setFilters((f) => ({ ...f, mode: 'range' }))}
          >
            按日期范围
          </button>
          <button
            className={`btn-sm rounded-lg ${
              filters.mode === 'single' ? 'btn-primary' : 'btn-secondary'
            }`}
            onClick={() => setFilters((f) => ({ ...f, mode: 'single' }))}
          >
            按单日
          </button>
        </div>

        {filters.mode === 'range' ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">开始日期</label>
              <input
                type="date"
                className="input"
                value={filters.startDate}
                onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">结束日期</label>
              <input
                type="date"
                className="input"
                value={filters.endDate}
                onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="label">日期</label>
            <input
              type="date"
              className="input"
              value={filters.singleDate}
              onChange={(e) => setFilters((f) => ({ ...f, singleDate: e.target.value }))}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">品种</label>
            <select
              className="input"
              value={filters.vegetableId}
              onChange={(e) => setFilters((f) => ({ ...f, vegetableId: e.target.value }))}
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
            <select
              className="input"
              value={filters.recorder}
              onChange={(e) => setFilters((f) => ({ ...f, recorder: e.target.value }))}
            >
              <option value="">全部记录人</option>
              {recorders.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="text-sm text-leaf-500 mb-3">共 {filtered.length} 条记录</p>

      {/* 桌面端表格 */}
      <div className="hidden sm:block card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-leaf-500 border-b border-leaf-100">
              <th className="py-2 pr-3">日期</th>
              <th className="py-2 pr-3">品种</th>
              <th className="py-2 pr-3">产量</th>
              <th className="py-2 pr-3">单位</th>
              <th className="py-2 pr-3">记录人</th>
              <th className="py-2 pr-3">备注</th>
              <th className="py-2 pr-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-leaf-50 last:border-0">
                <td className="py-2 pr-3 whitespace-nowrap">{r.harvest_date}</td>
                <td className="py-2 pr-3">{r.vegetable_name || '(已删除品种)'}</td>
                <td className="py-2 pr-3">{r.amount}</td>
                <td className="py-2 pr-3">{r.unit}</td>
                <td className="py-2 pr-3">{r.recorder}</td>
                <td className="py-2 pr-3 text-leaf-500 max-w-xs truncate">{r.note}</td>
                <td className="py-2 pr-3 whitespace-nowrap">
                  <button
                    className="text-leaf-600 font-medium hover:underline mr-3"
                    onClick={() => setEditingRecord(r)}
                  >
                    编辑
                  </button>
                  <button
                    className="text-tomato-500 font-medium hover:underline"
                    onClick={() => handleDelete(r)}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-leaf-400 text-center py-8">没有符合条件的记录</p>
        )}
      </div>

      {/* 手机端卡片 */}
      <div className="sm:hidden space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="card">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-leaf-800">
                {r.vegetable_name || '(已删除品种)'}
              </span>
              <span className="text-leaf-500 text-sm">{r.harvest_date}</span>
            </div>
            <div className="text-2xl font-display font-semibold text-leaf-700 mb-2">
              {r.amount} <span className="text-base font-body">{r.unit}</span>
            </div>
            <div className="text-sm text-leaf-500 space-y-0.5 mb-3">
              <p>记录人：{r.recorder || '-'}</p>
              {r.note && <p>备注：{r.note}</p>}
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary btn-sm flex-1" onClick={() => setEditingRecord(r)}>
                编辑
              </button>
              <button className="btn-danger btn-sm flex-1" onClick={() => handleDelete(r)}>
                删除
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-leaf-400 text-center py-8">没有符合条件的记录</p>
        )}
      </div>

      {editingRecord && (
        <RecordEditModal record={editingRecord} onClose={() => setEditingRecord(null)} />
      )}
    </div>
  )
}
