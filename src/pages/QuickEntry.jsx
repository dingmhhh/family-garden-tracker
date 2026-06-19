import React, { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { todayStr } from '../lib/dateUtils'
import { COMMON_UNITS } from '../lib/units'

const emptyNoteHints = ['天气', '虫害', '施肥', '成熟情况']

export default function QuickEntry() {
  const { vegetables, addRecord } = useData()
  const { recorder, updateRecorder } = useAuth()

  const [form, setForm] = useState({
    harvest_date: todayStr(),
    vegetable_id: '',
    amount: '',
    unit: '',
    recorder: recorder || '',
    note: '',
  })
  const [customUnit, setCustomUnit] = useState(false)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm((f) => ({ ...f, recorder }))
  }, [recorder])

  function handleVegetableChange(id) {
    const veg = vegetables.find((v) => String(v.id) === String(id))
    setForm((f) => ({
      ...f,
      vegetable_id: id,
      unit: veg?.default_unit || f.unit,
    }))
    setCustomUnit(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

    if (!form.vegetable_id) {
      setMessage('请先选择蔬菜品种')
      return
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setMessage('请输入大于 0 的产量数字')
      return
    }
    if (!form.unit) {
      setMessage('请选择或填写单位')
      return
    }

    setSubmitting(true)
    const result = await addRecord({
      harvest_date: form.harvest_date,
      vegetable_id: form.vegetable_id,
      amount: Number(form.amount),
      unit: form.unit,
      recorder: form.recorder,
      note: form.note,
    })
    setSubmitting(false)

    if (!result.success) {
      setMessage('保存失败：' + result.message)
      return
    }

    if (form.recorder) updateRecorder(form.recorder)

    // 提交后只清空产量和备注，方便连续录入
    setForm((f) => ({ ...f, amount: '', note: '' }))
    setMessage('✅ 已保存，可以继续录入下一条')
  }

  if (vegetables.length === 0) {
    return (
      <div className="card text-center py-10">
        <p className="text-leaf-600 mb-4">还没有添加任何蔬菜品种</p>
        <a href="#/vegetables" className="btn-primary inline-flex">
          去添加品种
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="page-title">今日记录</h1>
      <p className="page-sub">快速录入一条收获记录，提交后可以继续录入</p>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">日期</label>
          <input
            type="date"
            className="input"
            value={form.harvest_date}
            onChange={(e) => setForm((f) => ({ ...f, harvest_date: e.target.value }))}
          />
        </div>

        <div>
          <label className="label">蔬菜品种</label>
          <select
            className="input"
            value={form.vegetable_id}
            onChange={(e) => handleVegetableChange(e.target.value)}
          >
            <option value="">请选择品种</option>
            {vegetables.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">产量</label>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              min="0"
              className="input"
              placeholder="例如 5.5"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">单位</label>
            {!customUnit ? (
              <select
                className="input"
                value={COMMON_UNITS.includes(form.unit) ? form.unit : ''}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCustomUnit(true)
                    setForm((f) => ({ ...f, unit: '' }))
                  } else {
                    setForm((f) => ({ ...f, unit: e.target.value }))
                  }
                }}
              >
                <option value="">选择单位</option>
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
                {form.unit && !COMMON_UNITS.includes(form.unit) && (
                  <option value={form.unit}>{form.unit}（自定义）</option>
                )}
                <option value="__custom__">自定义单位…</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="输入自定义单位"
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setCustomUnit(false)}
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="label">记录人</label>
          <input
            className="input"
            placeholder="你的名字"
            value={form.recorder}
            onChange={(e) => setForm((f) => ({ ...f, recorder: e.target.value }))}
          />
        </div>

        <div>
          <label className="label">备注（可选）</label>
          <input
            className="input"
            placeholder={`例如：${emptyNoteHints.join(' / ')}`}
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          />
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.startsWith('✅') ? 'text-leaf-600' : 'text-tomato-500'
            }`}
          >
            {message}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? '保存中…' : '保存记录'}
        </button>
      </form>
    </div>
  )
}
