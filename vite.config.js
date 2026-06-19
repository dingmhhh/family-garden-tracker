import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 重要：部署到 GitHub Pages 时，base 必须设置为你的仓库名
// 例如仓库地址是 https://github.com/yourname/family-garden-tracker
// 那么 base 就要写成 '/family-garden-tracker/'
// 如果你修改了仓库名，请同步修改这里
export default defineConfig({
  plugins: [react()],
  base: '/family-garden-tracker/',
})
