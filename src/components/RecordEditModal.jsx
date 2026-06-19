import React, { useState } from 'react'
import { useData } from '../context/DataContext'
import { COMMON_UNITS } from '../lib/units'

export default function RecordEditModal({ record, onClose }) {
  const { vegetables, updateRecord } = useData()
  const [form, setForm] = useState({
    harvest_date: record.harvest_date,
    vegetable_id: record.vegetable_id,
    amount: record.amount,
    unit: record.unit,
    recorder: record.recorder || '',
    note: record.note || '',
  })
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.vegetable_id || !form.amount || !form.unit) {
      setMessage('请完整填写品种、产量和单位')
      return
    }
    setSubmitting(true)
    const result = await updateRecord(record.id, {
      ...form,
      amount: Number(form.amount),
    })
    setSubmitting(false)
    if (!result.success) {
      setMessage('保存失败：' + result.message)
      return
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-leaf-900/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-leaf-800">编辑记录</h2>
          <button onClick={onClose} className="text-leaf-400 text-2xl leading-none">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={form.vegetable_id || ''}
              onChange={(e) => setForm((f) => ({ ...f, vegetable_id: e.target.value }))}
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
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">单位</label>
              <input
                className="input"
                list="unit-options"
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              />
              <datalist id="unit-options">
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>
          </div>
          <div>
            <label className="label">记录人</label>
            <input
              className="input"
              value={form.recorder}
              onChange={(e) => setForm((f) => ({ ...f, recorder: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">备注</label>
            <input
              className="input"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            />
          </div>
          {message && <p className="text-tomato-500 text-sm">{message}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
              {submitting ? '保存中…' : '保存修改'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
