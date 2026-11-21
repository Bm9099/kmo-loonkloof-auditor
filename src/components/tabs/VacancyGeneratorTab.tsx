'use client';

import { useState } from 'react';
import { Copy, Download, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FunctionGroup } from '@/lib/types';

interface VacancyGeneratorTabProps {
  groups: FunctionGroup[];
}

export function VacancyGeneratorTab({ groups }: VacancyGeneratorTabProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [vacaturetekst, setVacaturetekst] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const group = groups.find((g) => g.naam === selectedGroup);

  const loonfork = group
    ? {
        min: Math.min(...group.employees.map((e) => e.bruto_maandloon_voltijds)),
        max: Math.max(...group.employees.map((e) => e.bruto_maandloon_voltijds)),
      }
    : null;

  const generate = async () => {
    if (!group || !loonfork) return;
    setLoading(true);
    setVacaturetekst('');
    try {
      const res = await fetch('/api/analyze-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ functietitels: [], mode: 'vacancy', functieGroep: group.naam, loonfork }),
      });
      const data = await res.json() as { vacaturetekst: string };
      setVacaturetekst(data.vacaturetekst ?? '');
    } catch {
      setVacaturetekst('Fout bij genereren. Probeer opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(vacaturetekst);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([vacaturetekst], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vacature-${selectedGroup.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500 mb-4">
          Genereer genderneutrale vacatureteksten met verplichte loonfork conform{' '}
          <strong>EU Art. 5 Richtlijn 2026/1646</strong>.
        </p>
        <div className="flex gap-3 flex-wrap">
          <select
            className="flex-1 min-w-[200px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            value={selectedGroup}
            onChange={(e) => { setSelectedGroup(e.target.value); setVacaturetekst(''); }}
          >
            <option value="">Selecteer een functiegroep\u2026</option>
            {groups.map((g) => (
              <option key={g.naam} value={g.naam}>{g.naam}</option>
            ))}
          </select>
          <Button
            className="bg-[#1E40AF] hover:bg-[#1D3A9E] text-white gap-2"
            disabled={!selectedGroup || loading}
            onClick={generate}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Genereer Vacaturetekst
          </Button>
        </div>
      </div>

      {loonfork && selectedGroup && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm">
          <span className="font-semibold text-blue-800">Berekende loonfork voor {selectedGroup}:</span>
          <span className="text-blue-700 ml-2">
            \u20ac{loonfork.min.toLocaleString('nl-BE')} \u2013 \u20ac{loonfork.max.toLocaleString('nl-BE')} bruto/maand
          </span>
        </div>
      )}

      {vacaturetekst && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">Gegenereerde vacaturetekst</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={copy}>
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Gekopieerd!' : 'Kopieer'}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={download}>
                <Download className="w-3.5 h-3.5" />
                Download
              </Button>
            </div>
          </div>
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
            {vacaturetekst}
          </pre>
        </div>
      )}
    </div>
  );
}
