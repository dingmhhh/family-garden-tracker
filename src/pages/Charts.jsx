import React, { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useData } from '../context/DataContext'
import { getGroupKey } from '../lib/dateUtils'

const GRANULARITIES = [
  { value: 'day', label: '天' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' },
]

export default function Charts() {
  const { vegetables, records } = useData()
  const [vegetableId, setVegetableId] = useState('')
  const [unit, setUnit] = useState('')
  const [granularity, setGranularity] = useState('month')
  const [chartType, setChartType] = useState('bar')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const vegRecords = useMemo(
    () => records.filter((r) => !vegetableId || String(r.vegetable_id) === String(vegetableId)),
    [records, vegetableId]
  )

  const availableUnits = useMemo(() => {
    const set = new Set(vegRecords.map((r) => r.unit))
    return Array.from(set)
  }, [vegRecords])

  const chartData = useMemo(() => {
    const filtered = vegRecords.filter((r) => {
      if (unit && r.unit !== unit) return false
      if (startDate && r.harvest_date < startDate) return false
      if (endDate && r.harvest_date > endDate) return false
      return true
    })
    const map = new Map()
    for (const r of filtered) {
      const key = getGroupKey(r.harvest_date, granularity)
      map.set(key, (map.get(key) || 0) + Number(r.amount))
    }
    return Array.from(map.entries())
      .map(([period, total]) => ({ period, total }))
      .sort((a, b) => a.period.localeCompare(b.period))
  }, [vegRecords, unit, startDate, endDate, granularity])

  const selectedVegName =
    vegetables.find((v) => String(v.id) === String(vegetableId))?.name || '全部品种'

  return (
    <div>
      <h1 className="page-title">图表分析</h1>
      <p className="page-sub">查看某个品种在不同时间维度上的产量变化</p>

      <div className="card mb-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">蔬菜品种</label>
            <select
              className="input"
              value={vegetableId}
              onChange={(e) => {
                setVegetableId(e.target.value)
                setUnit('')
              }}
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
            <label className="label">单位</label>
            <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="">全部单位（不建议，可能混合显示）</option>
              {availableUnits.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
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

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {GRANULARITIES.map((g) => (
              <button
                key={g.value}
                className={`btn-sm rounded-lg ${
                  granularity === g.value ? 'btn-primary' : 'btn-secondary'
                }`}
                onClick={() => setGranularity(g.value)}
              >
                按{g.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              className={`btn-sm rounded-lg ${chartType === 'bar' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setChartType('bar')}
            >
              柱状图
            </button>
            <button
              className={`btn-sm rounded-lg ${chartType === 'line' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setChartType('line')}
            >
              折线图
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-leaf-800 mb-4">
          {selectedVegName} {unit ? `（${unit}）` : ''}
        </h2>
        {chartData.length === 0 ? (
          <p className="text-leaf-400 text-center py-16">暂无数据，请调整筛选条件</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e0" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#4f7f45" radius={[6, 6, 0, 0]} name={`产量${unit ? `(${unit})` : ''}`} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e0" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#dd961a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name={`产量${unit ? `(${unit})` : ''}`}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
