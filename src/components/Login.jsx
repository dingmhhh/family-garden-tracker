import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const result = login(password)
    if (!result.success) {
      setErrorMsg(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🌱</div>
          <h1 className="text-2xl font-display font-semibold text-leaf-800">
            家庭菜园产量记录
          </h1>
          <p className="text-leaf-500 text-sm mt-1">请输入家庭访问密码进入</p>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label" htmlFor="password">
              访问密码
            </label>
            <input
              id="password"
              type="password"
              className="input"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrorMsg('')
              }}
              placeholder="请输入密码"
            />
          </div>
          {errorMsg && <p className="text-tomato-500 text-sm">{errorMsg}</p>}
          <button type="submit" className="btn-primary w-full">
            进入菜园
          </button>
        </form>
        <p className="text-center text-xs text-leaf-400 mt-6">
          这只是一个简单的访问保护，并非高安全性登录系统
        </p>
      </div>
    </div>
  )
}
