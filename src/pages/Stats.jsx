import React, { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'
import { getGroupKey } from '../lib/dateUtils'

const GRANULARITIES = [
  { value: 'day', label: '按天' },
  { value: 'week', label: '按周' },
  { value: 'month', label: '按月' },
  { value: 'year', label: '按年' },
]

export default function Stats() {
  const { records } = useData()
  const [granularity, setGranularity] = useState('month')
  const [tab, setTab] = useState('timeline') // 'timeline' | 'byVegetable'

  // 时间维度统计：分组 key = 时间段 + 品种 + 单位，绝不混合
  const timelineStats = useMemo(() => {
    const map = new Map()
    for (const r of records) {
      const periodKey = getGroupKey(r.harvest_date, granularity)
      const groupKey = `${periodKey}__${r.vegetable_name || '未知品种'}__${r.unit}`
      if (!map.has(groupKey)) {
        map.set(groupKey, {
          period: periodKey,
          vegetable: r.vegetable_name || '未知品种',
          unit: r.unit,
          total: 0,
          count: 0,
        })
      }
      const entry = map.get(groupKey)
      entry.total += Number(r.amount)
      entry.count += 1
    }
    return Array.from(map.values()).sort((a, b) => {
      if (a.period !== b.period) return b.period.localeCompare(a.period)
      return a.vegetable.localeCompare(b.vegetable)
    })
  }, [records, granularity])

  // 按品种汇总统计（不分时间段，但仍然按品种+单位分开）
  const byVegetableStats = useMemo(() => {
    const map = new Map()
    for (const r of records) {
      const groupKey = `${r.vegetable_name || '未知品种'}__${r.unit}`
      if (!map.has(groupKey)) {
        map.set(groupKey, {
          vegetable: r.vegetable_name || '未知品种',
          unit: r.unit,
          total: 0,
          count: 0,
        })
      }
      const entry = map.get(groupKey)
      entry.total += Number(r.amount)
      entry.count += 1
    }
    return Array.from(map.values()).sort((a, b) => a.vegetable.localeCompare(b.vegetable))
  }, [records])

  return (
    <div>
      <h1 className="page-title">数据统计</h1>
      <p className="page-sub">不同品种、不同单位的产量分开统计，不会被加在一起</p>

      <div className="flex gap-2 mb-5">
        <button
          className={`btn-sm rounded-lg ${tab === 'timeline' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('timeline')}
        >
          按时间段统计
        </button>
        <button
          className={`btn-sm rounded-lg ${tab === 'byVegetable' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('byVegetable')}
        >
          按品种汇总
        </button>
      </div>

      {tab === 'timeline' && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {GRANULARITIES.map((g) => (
              <button
                key={g.value}
                className={`btn-sm rounded-lg ${
                  granularity === g.value ? 'btn-primary' : 'btn-secondary'
                }`}
                onClick={() => setGranularity(g.value)}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-leaf-500 border-b border-leaf-100">
                  <th className="py-2 pr-3">时间段</th>
                  <th className="py-2 pr-3">品种</th>
                  <th className="py-2 pr-3">单位</th>
                  <th className="py-2 pr-3">总产量</th>
                  <th className="py-2 pr-3">记录条数</th>
                </tr>
              </thead>
              <tbody>
                {timelineStats.map((s, i) => (
                  <tr key={i} className="border-b border-leaf-50 last:border-0">
                    <td className="py-2 pr-3 whitespace-nowrap">{s.period}</td>
                    <td className="py-2 pr-3">{s.vegetable}</td>
                    <td className="py-2 pr-3">{s.unit}</td>
                    <td className="py-2 pr-3 font-semibold text-leaf-700">
                      {s.total} {s.unit}
                    </td>
                    <td className="py-2 pr-3 text-leaf-500">{s.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {timelineStats.length === 0 && (
              <p className="text-leaf-400 text-center py-8">暂无数据</p>
            )}
          </div>
        </>
      )}

      {tab === 'byVegetable' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {byVegetableStats.map((s, i) => (
            <div key={i} className="card">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-leaf-800">{s.vegetable}</h3>
                <span className="chip">{s.unit}</span>
              </div>
              <div className="text-2xl font-display font-semibold text-leaf-700">
                {s.total} <span className="text-base font-body text-leaf-500">{s.unit}</span>
              </div>
              <p className="text-xs text-leaf-400 mt-1">共 {s.count} 条记录</p>
            </div>
          ))}
          {byVegetableStats.length === 0 && (
            <p className="text-leaf-400 col-span-full text-center py-8">暂无数据</p>
          )}
        </div>
      )}
    </div>
  )
}
