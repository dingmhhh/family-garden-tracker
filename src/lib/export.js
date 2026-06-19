import * as XLSX from 'xlsx'
import { formatDateTime } from './dateUtils'

// records: 数组，每条记录包含 vegetable 关联信息（已经 join 过品种名称）
// filenamePrefix: 导出的文件名前缀
export function exportRecordsToExcel(records, filenamePrefix = '菜园收获记录') {
  const rows = records.map((r) => ({
    日期: r.harvest_date,
    品种: r.vegetable_name || '(已删除品种)',
    产量: r.amount,
    单位: r.unit,
    记录人: r.recorder || '',
    备注: r.note || '',
    创建时间: formatDateTime(r.created_at),
    更新时间: formatDateTime(r.updated_at),
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  worksheet['!cols'] = [
    { wch: 12 },
    { wch: 14 },
    { wch: 10 },
    { wch: 8 },
    { wch: 10 },
    { wch: 24 },
    { wch: 18 },
    { wch: 18 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '收获记录')

  const dateSuffix = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(workbook, `${filenamePrefix}_${dateSuffix}.xlsx`)
}
