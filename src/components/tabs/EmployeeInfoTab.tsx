'use client';

import { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Employee, FunctionGroup } from '@/lib/types';

interface EmployeeInfoTabProps {
  employees: Employee[];
  groups: FunctionGroup[];
}

export function EmployeeInfoTab({ employees, groups }: EmployeeInfoTabProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [docText, setDocText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const group = groups.find((g) => g.naam === selectedGroup);
  const gemiddeldLoon = group
    ? Math.round((group.gemiddeldM + group.gemiddeldV) / 2)
    : 0;

  const generate = async () => {
    if (!selectedId || !group) return;
    setLoading(true);
    setDocText('');
    try {
      const res = await fetch('/api/analyze-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          functietitels: [],
          mode: 'employee_info',
          werknemer: { id: selectedId, functieGroep: group.naam, gemiddeldLoon },
        }),
      });
      const data = await res.json() as { antwoorddocument: string };
      setDocText(data.antwoorddocument ?? '');
    } catch {
      setDocText('Fout bij genereren van document.');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `looninformatie-${selectedId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500 mb-4">
          Genereer het officieel antwoorddocument voor werknemers die hun recht op looninformatie
          uitoefenen conform <strong>EU Art. 7 Richtlijn 2026/1646</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Werknemer ID</label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setDocText(''); }}
            >
              <option value="">Selecteer werknemer ID\u2026</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.id} \u2014 {e.functietitel}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Vergelijkingsgroep</label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              value={selectedGroup}
              onChange={(e) => { setSelectedGroup(e.target.value); setDocText(''); }}
            >
              <option value="">Selecteer functiegroep\u2026</option>
              {groups.map((g) => (
                <option key={g.naam} value={g.naam}>{g.naam}</option>
              ))}
            </select>
          </div>
        </div>

        {group && selectedGroup && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm mb-3">
            <span className="text-slate-600">Gemiddeld loon van groep <strong>{selectedGroup}</strong>:</span>
            <span className="text-[#0F172A] font-semibold ml-2">
              \u20ac{gemiddeldLoon.toLocaleString('nl-BE')}/maand
            </span>
          </div>
        )}

        <Button
          className="bg-[#1E40AF] hover:bg-[#1D3A9E] text-white gap-2"
          disabled={!selectedId || !selectedGroup || loading}
          onClick={generate}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          Genereer Antwoorddocument
        </Button>
      </div>

      {docText && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">Officieel antwoorddocument</p>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={download}>
              <Download className="w-3.5 h-3.5" />
              Download .txt
            </Button>
          </div>
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
            {docText}
          </pre>
        </div>
      )}
    </div>
  );
}
