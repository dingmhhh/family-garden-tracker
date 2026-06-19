import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 使用 HashRouter 是因为 GitHub Pages 是静态托管，
        不支持服务器端路由重写，HashRouter 用 #/ 的方式可以
        避免刷新页面时出现 404 */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
