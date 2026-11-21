'use client';

import { useState } from 'react';
import { FileDown, FileText, Sparkles, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FunctionGroup } from '@/lib/types';

interface VacancyGeneratorTabProps {
  groups: FunctionGroup[];
}

const DISCLAIMER =
  'Dit document is gegenereerd door de KMO Loonkloof-Auditor op basis van de door u aangeleverde geanonimiseerde gegevens. Het vormt geen juridisch advies.';

const GROEPERING_TOELICHTING =
  'Functiegroepen worden automatisch bepaald op basis van trefwoordherkenning in de functietitel (bijv. "admin", "sales", "it"). Criteria: vergelijkbare taken, verantwoordelijkheid en competentievereisten conform Art. 4 EU Richtlijn 2023/970.';

async function downloadPdf(vacaturetekst: string, selectedGroup: string, loonfork: { p25: number; p75: number }) {
  const { jsPDF } = await import('jspdf');
  const datum = new Date().toLocaleDateString('nl-BE', { day: '2-digit', month: 'long', year: 'numeric' });
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Vacature: ${selectedGroup}`, 14, 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(datum, 14, 23);

  doc.setTextColor(15, 23, 42);
  let y = 42;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(vacaturetekst, 182) as string[];
  doc.text(lines, 14, y);
  y += lines.length * 5 + 10;

  doc.setFillColor(239, 246, 255);
  doc.roundedRect(14, y, 182, 18, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Loonfork (P25–P75, bruto/maand — conform EU Art. 5 Richtlijn 2023/970):', 18, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `€${Math.round(loonfork.p25).toLocaleString('nl-BE')} – €${Math.round(loonfork.p75).toLocaleString('nl-BE')}`,
    18,
    y + 14,
  );

  const pageH = doc.internal.pageSize.height;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text(DISCLAIMER, 14, pageH - 10, { maxWidth: 182 });

  doc.save(`vacature-${selectedGroup.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

async function downloadWord(vacaturetekst: string, selectedGroup: string, loonfork: { p25: number; p75: number }) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } = await import('docx');
  const datum = new Date().toLocaleDateString('nl-BE', { day: '2-digit', month: 'long', year: 'numeric' });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: `Vacature: ${selectedGroup}`, bold: true })],
          }),
          new Paragraph({ children: [new TextRun({ text: datum, color: '64748B' })] }),
          new Paragraph({ children: [new TextRun('')] }),
          ...vacaturetekst.split('\n').map(
            (line) => new Paragraph({ children: [new TextRun(line)] }),
          ),
          new Paragraph({ children: [new TextRun('')] }),
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: '1E40AF' } },
            children: [
              new TextRun({
                text: `Loonfork (P25–P75, bruto/maand — conform EU Art. 5 Richtlijn 2023/970): €${Math.round(loonfork.p25).toLocaleString('nl-BE')} – €${Math.round(loonfork.p75).toLocaleString('nl-BE')}`,
                bold: true,
                color: '1E40AF',
              }),
            ],
          }),
          new Paragraph({ children: [new TextRun('')] }),
          new Paragraph({ children: [new TextRun({ text: DISCLAIMER, italics: true, color: '94A3B8' })] }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vacature-${selectedGroup.toLowerCase().replace(/\s+/g, '-')}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

export function VacancyGeneratorTab({ groups }: VacancyGeneratorTabProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [vacaturetekst, setVacaturetekst] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const group = groups.find((g) => g.naam === selectedGroup);

  const loonfork = group ? { p25: group.p25, p75: group.p75 } : null;

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

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500 mb-4">
          Genereer genderneutrale vacatureteksten met verplichte loonfork conform{' '}
          <strong>EU Art. 5 Richtlijn 2023/970</strong>.
        </p>
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              value={selectedGroup}
              onChange={(e) => { setSelectedGroup(e.target.value); setVacaturetekst(''); }}
            >
              <option value="">Selecteer een functiegroep…</option>
              {groups.map((g) => (
                <option key={g.naam} value={g.naam}>{g.naam}</option>
              ))}
            </select>
            <button
              className="absolute right-8 top-2.5 text-slate-400 hover:text-slate-600"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              type="button"
              aria-label="Info over groeperingslogica"
            >
              <Info className="w-4 h-4" />
            </button>
            {showTooltip && (
              <div className="absolute z-10 top-10 right-0 w-72 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-lg leading-relaxed">
                <strong className="block mb-1">Groeperingslogica (Art. 4)</strong>
                {GROEPERING_TOELICHTING}
              </div>
            )}
          </div>
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
          <span className="font-semibold text-blue-800">Loonfork voor {selectedGroup} (P25–P75):</span>
          <span className="text-blue-700 ml-2">
            €{Math.round(loonfork.p25).toLocaleString('nl-BE')} – €{Math.round(loonfork.p75).toLocaleString('nl-BE')} bruto/maand
          </span>
          <span className="text-blue-500 text-xs ml-2">(gebaseerd op interne P25–P75 range, conform Art. 5)</span>
        </div>
      )}

      {vacaturetekst && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700">Gegenereerde vacaturetekst</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => downloadPdf(vacaturetekst, selectedGroup, loonfork!)}
              >
                <FileDown className="w-3.5 h-3.5" />
                Download als PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => downloadWord(vacaturetekst, selectedGroup, loonfork!)}
              >
                <FileText className="w-3.5 h-3.5" />
                Download als Word (.docx)
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
