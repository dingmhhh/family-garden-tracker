// 日期相关的工具函数
// harvest_date 统一使用 'YYYY-MM-DD' 格式的字符串存储和比较，避免时区问题

export function todayStr() {
  const d = new Date()
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${y}-${m}-${d}`
}

export function formatDateTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

// 获取某日期所在 ISO 周的周一日期，返回 'YYYY-MM-DD'
export function getWeekStart(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay() === 0 ? 7 : d.getDay() // 周日记为 7
  d.setDate(d.getDate() - (day - 1))
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// 获取某日期所在 ISO 周的周数标签，例如 '2024-W23'
export function getWeekLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const target = new Date(d.valueOf())
  const dayNr = (d.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = new Date(target.getFullYear(), 0, 4)
  const diff = target - firstThursday
  const weekNo = 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000))
  return `${target.getFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

export function getMonthLabel(dateStr) {
  return dateStr.slice(0, 7) // 'YYYY-MM'
}

export function getYearLabel(dateStr) {
  return dateStr.slice(0, 4) // 'YYYY'
}

// 根据维度（day/week/month/year）获取分组用的 key 和展示用的 label
export function getGroupKey(dateStr, granularity) {
  switch (granularity) {
    case 'day':
      return dateStr
    case 'week':
      return getWeekLabel(dateStr)
    case 'month':
      return getMonthLabel(dateStr)
    case 'year':
      return getYearLabel(dateStr)
    default:
      return dateStr
  }
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
