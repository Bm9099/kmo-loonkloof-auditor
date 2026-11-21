'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="max-w-2xl mx-auto px-4 pb-10">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
          ${isDragging ? 'border-[#1E40AF] bg-blue-50' : 'border-slate-300 bg-white hover:border-[#1E40AF] hover:bg-blue-50/40'}
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
        <p className="text-xs text-slate-400">.xlsx, .xls of .csv \u00b7 max. 10 MB</p>
        {loading && <p className="text-sm text-blue-600 mt-3">Bestand verwerken\u2026</p>}
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
        >
          <Download className="w-4 h-4" />
          Download Voorbeeld Excel-sjabloon
        </Button>
        <Button
          className="flex-1 gap-2 bg-[#1E40AF] hover:bg-[#1D3A9E] text-white"
          onClick={(e) => { e.stopPropagation(); onDataLoaded(demoData); }}
        >
          <Users className="w-4 h-4" />
          Laad Belgische KMO Demo-Data (34 werknemers)
        </Button>
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
  );
}
