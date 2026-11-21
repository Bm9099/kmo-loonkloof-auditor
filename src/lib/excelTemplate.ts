import * as XLSX from 'xlsx';
import { Employee } from './types';

export function downloadTemplate(): void {
  const headers = [
    'id',
    'geslacht',
    'functietitel',
    'paritair_comite',
    'bruto_maandloon_voltijds',
    'ancienniteit_jaren',
    'variabel_loon_jaar',
  ];

  const exampleRows = [
    ['W001', 'V', 'HR Medewerker', 'PC 200', 3200, 5, 400],
    ['W002', 'M', 'HR Medewerker', 'PC 200', 3250, 6, 420],
    ['W003', 'X', 'IT Support Medewerker', 'PC 200', 3400, 3, 0],
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleRows]);
  ws['!cols'] = headers.map(() => ({ wch: 28 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Loonlijst');
  XLSX.writeFile(wb, 'loonlijst_sjabloon.xlsx');
}

export function parseExcelFile(file: File): Promise<Employee[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);

        const employees: Employee[] = rows.map((row, i) => {
          const geslacht = String(row['geslacht'] ?? '').toUpperCase();
          return {
            id: String(row['id'] ?? `W${String(i + 1).padStart(3, '0')}`),
            geslacht: (geslacht === 'M' || geslacht === 'V' || geslacht === 'X' ? geslacht : 'X') as Employee['geslacht'],
            functietitel: String(row['functietitel'] ?? 'Onbekend'),
            paritair_comite: String(row['paritair_comite'] ?? 'PC 200'),
            bruto_maandloon_voltijds: Number(row['bruto_maandloon_voltijds'] ?? 0),
            ancienniteit_jaren: Number(row['ancienniteit_jaren'] ?? 0),
            variabel_loon_jaar: Number(row['variabel_loon_jaar'] ?? 0),
          };
        });

        resolve(employees);
      } catch (err) {
        reject(new Error(`Fout bij verwerking van bestand: ${String(err)}`));
      }
    };
    reader.onerror = () => reject(new Error('Fout bij lezen van bestand'));
    reader.readAsArrayBuffer(file);
  });
}
