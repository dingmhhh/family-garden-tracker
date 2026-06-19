import React, { useState } from 'react'
import { useData } from '../context/DataContext'
import { COMMON_UNITS } from '../lib/units'

const emptyForm = { name: '', default_unit: '斤', note: '' }

export default function Vegetables() {
  const { vegetables, addVegetable, updateVegetable, deleteVegetable } = useData()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function startEdit(veg) {
    setEditingId(veg.id)
    setForm({ name: veg.name, default_unit: veg.default_unit, note: veg.note || '' })
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setMessage('请输入品种名称')
      return
    }
    setSubmitting(true)
    const result = editingId
      ? await updateVegetable(editingId, form)
      : await addVegetable(form)
    setSubmitting(false)

    if (!result.success) {
      setMessage('保存失败：' + result.message)
      return
    }
    setMessage(editingId ? '✅ 已更新品种' : '✅ 已添加品种')
    setForm(emptyForm)
    setEditingId(null)
  }

  async function handleDelete(veg) {
    const ok = window.confirm(
      `确定要删除品种「${veg.name}」吗？\n注意：该品种下的历史收获记录不会被删除，但会失去品种名称显示。`
    )
    if (!ok) return
    const result = await deleteVegetable(veg.id)
    if (!result.success) {
      alert('删除失败：' + result.message)
    }
  }

  return (
    <div>
      <h1 className="page-title">品种管理</h1>
      <p className="page-sub">管理菜园里种植的蔬菜品种</p>

      <form onSubmit={handleSubmit} className="card space-y-4 mb-6 max-w-lg">
        <h2 className="font-semibold text-leaf-800">
          {editingId ? '编辑品种' : '添加新品种'}
        </h2>
        <div>
          <label className="label">品种名称</label>
          <input
            className="input"
            placeholder="例如：番茄"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">默认单位</label>
          <select
            className="input"
            value={COMMON_UNITS.includes(form.default_unit) ? form.default_unit : '__custom__'}
            onChange={(e) => {
              if (e.target.value !== '__custom__') {
                setForm((f) => ({ ...f, default_unit: e.target.value }))
              }
            }}
          >
            {COMMON_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
            <option value="__custom__">自定义…</option>
          </select>
          {!COMMON_UNITS.includes(form.default_unit) && (
            <input
              className="input mt-2"
              placeholder="输入自定义单位"
              value={form.default_unit}
              onChange={(e) => setForm((f) => ({ ...f, default_unit: e.target.value }))}
            />
          )}
        </div>
        <div>
          <label className="label">备注（可选）</label>
          <input
            className="input"
            placeholder="例如：种在后院左侧"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          />
        </div>
        {message && (
          <p className={`text-sm ${message.startsWith('✅') ? 'text-leaf-600' : 'text-tomato-500'}`}>
            {message}
          </p>
        )}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1" disabled={submitting}>
            {submitting ? '保存中…' : editingId ? '保存修改' : '添加品种'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={cancelEdit}>
              取消
            </button>
          )}
        </div>
      </form>

      <h2 className="font-semibold text-leaf-800 mb-3">已有品种（{vegetables.length}）</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {vegetables.map((v) => (
          <div key={v.id} className="card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-leaf-800">{v.name}</h3>
                <span className="chip">{v.default_unit}</span>
              </div>
              {v.note && <p className="text-sm text-leaf-500">{v.note}</p>}
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn-secondary btn-sm flex-1" onClick={() => startEdit(v)}>
                编辑
              </button>
              <button className="btn-danger btn-sm flex-1" onClick={() => handleDelete(v)}>
                删除
              </button>
            </div>
          </div>
        ))}
        {vegetables.length === 0 && (
          <p className="text-leaf-400 col-span-full">还没有添加任何品种，先在上面添加一个吧</p>
        )}
      </div>
    </div>
  )
}
