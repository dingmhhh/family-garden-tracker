import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export default function Settings() {
  const { recorder, updateRecorder, logout } = useAuth()
  const { vegetables, records, reload } = useData()
  const [name, setName] = useState(recorder)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    updateRecorder(name)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function handleLogout() {
    const ok = window.confirm('确定要退出登录吗？退出后需要重新输入家庭访问密码。')
    if (ok) logout()
  }

  return (
    <div className="max-w-lg">
      <h1 className="page-title">设置</h1>
      <p className="page-sub">管理你的记录人姓名和账号</p>

      <div className="card space-y-4 mb-5">
        <h2 className="font-semibold text-leaf-800">我的姓名</h2>
        <p className="text-sm text-leaf-500">
          设置后，新增记录时会自动带出这个名字作为记录人
        </p>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn-primary w-full" onClick={handleSave}>
          {saved ? '✅ 已保存' : '保存姓名'}
        </button>
      </div>

      <div className="card space-y-3 mb-5">
        <h2 className="font-semibold text-leaf-800">数据概览</h2>
        <div className="flex justify-between text-sm text-leaf-600">
          <span>蔬菜品种数量</span>
          <span className="font-semibold">{vegetables.length}</span>
        </div>
        <div className="flex justify-between text-sm text-leaf-600">
          <span>收获记录总数</span>
          <span className="font-semibold">{records.length}</span>
        </div>
        <button className="btn-secondary w-full" onClick={reload}>
          🔄 重新加载数据
        </button>
      </div>

      <div className="card">
        <h2 className="font-semibold text-leaf-800 mb-3">账号</h2>
        <button className="btn-danger w-full" onClick={handleLogout}>
          退出登录
        </button>
      </div>
    </div>
  )
}
