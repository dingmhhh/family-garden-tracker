import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/', label: '快速录入', icon: '✏️', end: true },
  { to: '/history', label: '历史记录', icon: '📋' },
  { to: '/stats', label: '统计', icon: '📊' },
  { to: '/charts', label: '图表', icon: '📈' },
  { to: '/vegetables', label: '品种管理', icon: '🥬' },
  { to: '/export', label: '导出', icon: '⬇️' },
  { to: '/settings', label: '设置', icon: '⚙️' },
]

export default function Layout() {
  const { recorder } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* 顶部栏 */}
      <header className="bg-leaf-700 text-white sticky top-0 z-30 shadow-soft">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="font-display font-semibold text-lg">家庭菜园</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-leaf-900 text-white' : 'text-leaf-100 hover:bg-leaf-600'
                  }`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {recorder && (
              <span className="hidden sm:inline text-sm text-leaf-100">
                当前记录人：{recorder}
              </span>
            )}
            <button
              className="sm:hidden text-2xl leading-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="打开菜单"
            >
              ☰
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="sm:hidden border-t border-leaf-600 bg-leaf-700">
            <div className="px-2 py-2 flex flex-col">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-base font-medium transition ${
                      isActive ? 'bg-leaf-900 text-white' : 'text-leaf-100 active:bg-leaf-600'
                    }`
                  }
                >
                  {item.icon} {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* 页面内容 */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 pb-24 sm:pb-6">
        <Outlet />
      </main>

      {/* 手机端底部快捷导航（常用四个） */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-leaf-100 shadow-soft z-30">
        <div className="grid grid-cols-4">
          {NAV_ITEMS.slice(0, 4).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 text-xs font-medium ${
                  isActive ? 'text-leaf-700' : 'text-leaf-400'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
