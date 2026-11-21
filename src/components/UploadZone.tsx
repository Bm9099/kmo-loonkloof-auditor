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
    <div className="max-w-2xl mx-auto px-4 pb-12">
      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer
          transition-all duration-200 ring-1
          ${isDragging
            ? 'border-[#1E40AF] bg-blue-50 ring-[#1E40AF]/20 shadow-lg scale-[1.01]'
            : 'border-slate-300 bg-white ring-slate-900/5 hover:border-[#1E40AF] hover:bg-blue-50/40 hover:shadow-md'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <Upload
          className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragging ? 'text-[#1E40AF] animate-bounce-icon' : 'text-slate-400'}`}
        />
        <p className="text-base font-semibold text-slate-700 mb-1">
          Sleep uw Excel-bestand hier of klik om te bladeren
        </p>
        <p className="text-sm text-slate-400">.xlsx, .xls of .csv · max. 10 MB</p>
        {loading && <p className="text-sm text-blue-600 mt-3 font-medium">Bestand verwerken…</p>}
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
          className="group flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-150 text-left ring-1 ring-slate-900/5"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-200 transition-colors shrink-0">
            <Download className="w-5 h-5 text-slate-600" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Download Sjabloon</p>
            <p className="text-xs text-slate-500">Voorbeeld Excel-bestand</p>
          </div>
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDataLoaded(demoData); }}
          className="group flex items-center gap-3 p-4 rounded-2xl border border-[#1E40AF]/30 bg-blue-50 hover:bg-blue-100 hover:border-[#1E40AF]/50 hover:shadow-md transition-all duration-150 text-left ring-1 ring-[#1E40AF]/10"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1E40AF]/10 group-hover:bg-[#1E40AF]/20 transition-colors shrink-0">
            <Users className="w-5 h-5 text-[#1E40AF]" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#1E40AF]">Laad Demo-Data</p>
            <p className="text-xs text-blue-500">Belgische KMO · 34 werknemers</p>
          </div>
        </button>
      </div>

      <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-start gap-2">
        <FileSpreadsheet className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
        <span>
          Verplichte kolommen: <strong>id, geslacht (M/V/X), functietitel, paritair_comite,
          bruto_maandloon_voltijds, ancienniteit_jaren, variabel_loon_jaar</strong>. Geen namen of
          BSN-nummers invoeren.
        </span>
      </div>
    </div>
  );
}
