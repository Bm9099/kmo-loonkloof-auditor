'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, Users, Download } from 'lucide-react';
import { Employee } from '@/lib/types';
import { downloadTemplate, parseExcelFile } from '@/lib/excelTemplate';
import { demoData } from '@/lib/demoData';

interface UploadZoneProps {
  onDataLoaded: (employees: Employee[]) => void;
}

export function UploadZone({ onDataLoaded }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
        setError('Enkel .xlsx, .xls of .csv bestanden zijn toegestaan.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const employees = await parseExcelFile(file);
        if (employees.length === 0) {
          setError('Geen werknemers gevonden in het bestand.');
          return;
        }
        onDataLoaded(employees);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Onbekende fout');
      } finally {
        setLoading(false);
      }
    },
    [onDataLoaded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="bg-white py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">Upload uw loondata</h2>
        <p className="text-slate-500 text-center mb-10">Sleep uw Excel-bestand of kies een optie hieronder</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all
            ${isDragging ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/30'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700 mb-1">
            Sleep uw Excel-bestand hier of klik om te bladeren
          </p>
          <p className="text-xs text-slate-400">.xlsx, .xls of .csv &middot; max. 10 MB</p>
          {loading && <p className="text-sm text-blue-600 mt-3">Bestand verwerken&hellip;</p>}
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="button"
            className="flex-1 bg-white border border-slate-200 hover:border-slate-400 rounded-xl px-6 py-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all text-slate-700 font-medium"
            onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
          >
            <Download className="w-5 h-5 text-slate-400 shrink-0" />
            Download Sjabloon
          </button>
          <button
            type="button"
            className="flex-1 bg-[#1E40AF] hover:bg-[#1D3A9E] text-white rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all font-semibold"
            onClick={(e) => { e.stopPropagation(); onDataLoaded(demoData); }}
          >
            <Users className="w-5 h-5 shrink-0" />
            Laad Demo-Data
          </button>
        </div>

        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 flex items-start gap-2">
          <FileSpreadsheet className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
          <span>
            Verplichte kolommen: <strong>id, geslacht (M/V/X), functietitel, paritair_comite,
            bruto_maandloon_voltijds, ancienniteit_jaren, variabel_loon_jaar</strong>. Geen namen of
            BSN-nummers invoeren.
          </span>
        </div>
      </div>
    </div>
  );
}
