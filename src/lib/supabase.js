import { createClient } from '@supabase/supabase-js'

// ====== 在这里填写你的 Supabase 信息 ======
// 推荐做法：不要直接写死在这个文件里，而是在项目根目录的 .env 文件中配置：
//   VITE_SUPABASE_URL=你的 Supabase 项目 URL
//   VITE_SUPABASE_ANON_KEY=你的 Supabase anon public key
// .env 文件不会被提交到 GitHub（已在 .gitignore 中忽略）
// 部署到 GitHub Pages 时，需要把这两个值配置在 GitHub Actions Secrets 中
// 具体步骤见 README.md 的「部署到 GitHub Pages」章节
// ==========================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] 缺少 VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY，请检查 .env 文件是否正确配置。'
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
