import xlsx from 'xlsx';
import fs from 'fs';

const filePath = "Exportação_imóveis - 20260414_144223.xlsx";
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

fs.writeFileSync('excel_dump.json', JSON.stringify({
  columns: data[0],
  rows: data.slice(1, 5) // first 4 rows to check
}, null, 2));
console.log('Done!');
