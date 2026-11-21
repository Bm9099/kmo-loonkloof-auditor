'use client';

import { useState } from 'react';
import { FileText, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Employee, FunctionGroup } from '@/lib/types';

interface EmployeeInfoTabProps {
  employees: Employee[];
  groups: FunctionGroup[];
}

const DISCLAIMER =
  'Dit document is gegenereerd door de KMO Loonkloof-Auditor op basis van de door u aangeleverde geanonimiseerde gegevens. Het vormt geen juridisch advies.';

function fmt(n: number) {
  return `€${Math.round(n).toLocaleString('nl-BE')}`;
}

async function downloadPdf(
  docText: string,
  selectedId: string,
  group: FunctionGroup,
  datum: string,
) {
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Officieel Looninformatie Document', 14, 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Werknemer ID: ${selectedId}  ·  Datum: ${datum}`, 14, 23);

  doc.setTextColor(15, 23, 42);

  autoTable(doc, {
    startY: 38,
    head: [['Veld', 'Waarde']],
    body: [
      ['Functiegroep', group.naam],
      ['Gemiddeld brutoloon van de groep', fmt((group.gemiddeldM + group.gemiddeldV) / 2) + '/maand'],
      ['Gemiddeld brutoloon mannen (M)', group.aantalM >= 2 ? fmt(group.gemiddeldM) + '/maand' : 'Onvoldoende data (<2 personen)'],
      ['Gemiddeld brutoloon vrouwen (V)', group.aantalV >= 2 ? fmt(group.gemiddeldV) + '/maand' : 'Onvoldoende data (<2 personen)'],
      ['Loonkloof (M vs V) in de groep', group.status !== 'onvoldoende_data' ? `${group.loonkloof.toFixed(1)}%` : 'Onvoldoende data'],
      ['Wettelijke grondslag', 'EU Richtlijn 2023/970 Art. 7'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const lines = doc.splitTextToSize(docText, 182) as string[];
  doc.text(lines, 14, finalY);

  const pageH = doc.internal.pageSize.height;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text(DISCLAIMER, 14, pageH - 10, { maxWidth: 182 });

  doc.save(`looninformatie-${selectedId}.pdf`);
}

async function downloadWord(
  docText: string,
  selectedId: string,
  group: FunctionGroup,
  datum: string,
) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } =
    await import('docx');

  const tableRows = [
    ['Functiegroep', group.naam],
    ['Gemiddeld brutoloon van de groep', fmt((group.gemiddeldM + group.gemiddeldV) / 2) + '/maand'],
    ['Gemiddeld brutoloon mannen (M)', group.aantalM >= 2 ? fmt(group.gemiddeldM) + '/maand' : 'Onvoldoende data'],
    ['Gemiddeld brutoloon vrouwen (V)', group.aantalV >= 2 ? fmt(group.gemiddeldV) + '/maand' : 'Onvoldoende data'],
    ['Loonkloof (M vs V) in de groep', group.status !== 'onvoldoende_data' ? `${group.loonkloof.toFixed(1)}%` : 'Onvoldoende data'],
    ['Wettelijke grondslag', 'EU Richtlijn 2023/970 Art. 7'],
  ];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: 'Officieel Looninformatie Document', bold: true })],
          }),
          new Paragraph({ children: [new TextRun({ text: `Werknemer ID: ${selectedId}  ·  Datum: ${datum}`, color: '64748B' })] }),
          new Paragraph({ children: [new TextRun('')] }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows.map(
              ([label, value]) =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun(value)] })] }),
                  ],
                }),
            ),
          }),
          new Paragraph({ children: [new TextRun('')] }),
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' } },
            children: [new TextRun({ text: 'Inhoud antwoorddocument:', bold: true })],
          }),
          ...docText.split('\n').map((line) => new Paragraph({ children: [new TextRun(line)] })),
          new Paragraph({ children: [new TextRun('')] }),
          new Paragraph({ children: [new TextRun({ text: DISCLAIMER, italics: true, color: '94A3B8' })] }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = `looninformatie-${selectedId}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

export function EmployeeInfoTab({ employees, groups }: EmployeeInfoTabProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [docText, setDocText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const group = groups.find((g) => g.naam === selectedGroup);
  const gemiddeldLoon = group ? Math.round((group.gemiddeldM + group.gemiddeldV) / 2) : 0;
  const datum = new Date().toLocaleDateString('nl-BE', { day: '2-digit', month: 'long', year: 'numeric' });

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
          werknemer: {
            id: selectedId,
            functieGroep: group.naam,
            gemiddeldLoon,
            gemiddeldLoonM: group.aantalM >= 2 ? Math.round(group.gemiddeldM) : null,
            gemiddeldLoonV: group.aantalV >= 2 ? Math.round(group.gemiddeldV) : null,
            loonkloof: group.status !== 'onvoldoende_data' ? group.loonkloof : null,
          },
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

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500 mb-4">
          Genereer het officieel antwoorddocument voor werknemers die hun recht op looninformatie
          uitoefenen conform <strong>EU Art. 7 Richtlijn 2023/970</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Werknemer ID</label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setDocText(''); }}
            >
              <option value="">Selecteer werknemer ID…</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.id} — {e.functietitel}</option>
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
              <option value="">Selecteer functiegroep…</option>
              {groups.map((g) => (
                <option key={g.naam} value={g.naam}>{g.naam}</option>
              ))}
            </select>
          </div>
        </div>

        {group && selectedGroup && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm mb-3 space-y-1">
            <div>
              <span className="text-slate-600">Gemiddeld loon van groep <strong>{selectedGroup}</strong>:</span>
              <span className="text-[#0F172A] font-semibold ml-2">{fmt(gemiddeldLoon)}/maand</span>
            </div>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>Gem. M: {group.aantalM >= 2 ? fmt(group.gemiddeldM) : 'onvoldoende data'}</span>
              <span>Gem. V: {group.aantalV >= 2 ? fmt(group.gemiddeldV) : 'onvoldoende data'}</span>
              {group.status !== 'onvoldoende_data' && (
                <span className={group.loonkloof > 5 ? 'text-red-600 font-medium' : 'text-emerald-600'}>
                  Kloof: {group.loonkloof.toFixed(1)}%
                </span>
              )}
            </div>
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => downloadPdf(docText, selectedId, group!, datum)}
              >
                <FileDown className="w-3.5 h-3.5" />
                Download als PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => downloadWord(docText, selectedId, group!, datum)}
              >
                <FileText className="w-3.5 h-3.5" />
                Download als Word (.docx)
              </Button>
            </div>
          </div>
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
            {docText}
          </pre>
        </div>
      )}
    </div>
  );
}
