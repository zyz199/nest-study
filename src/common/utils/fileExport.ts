import * as XLSX from 'xlsx';

/**
 *
 * @param data 数据
 * @param sheetName 工作簿名称
 * @returns 导出excel
 */
export const exportExcel = <T>(data: T[], sheetName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
};
