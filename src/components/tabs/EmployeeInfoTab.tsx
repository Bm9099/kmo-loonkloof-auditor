'use client';

import { useState } from 'react';
import { FileText, FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { callOpenAI, getStoredApiKey, OpenAIError } from '@/lib/openai';
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

function generateEmployeeInfoFallback(
  id: string,
  groep: string,
  gemiddeldLoon: number,
): string {
  const datum = new Date().toLocaleDateString('nl-BE');
  return `**OFFICIEEL ANTWOORDDOCUMENT**
Datum: ${datum}

Betreft: Uitoefening recht op looninformatie (EU-richtlijn 2026/1646, Art. 7)

Geachte medewerker (ID: ${id}),

In antwoord op uw verzoek tot looninformatie bevestigen wij het volgende:

**Uw functiegroep:** ${groep}

**Gemiddeld bruto maandloon van uw functiegroep:** €${gemiddeldLoon.toLocaleString('nl-BE', { minimumFractionDigits: 2 })}

Dit gemiddelde is berekend op basis van alle medewerkers in dezelfde functiegroep binnen onze organisatie, conform de methodologie vereist door de Europese Richtlijn 2026/1646 betreffende loontransparantie.

**Juridische mededeling:** Alle persoonsgegevens worden verwerkt conform de AVG/GDPR. Dit document mag niet worden verspreid.

Met vriendelijke groeten,
HR-afdeling`;
}

export function EmployeeInfoTab({ employees, groups }: EmployeeInfoTabProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [docText, setDocText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [apiKeyError, setApiKeyError] = useState('');

  const group = groups.find((g) => g.naam === selectedGroup);
  const gemiddeldLoon = group ? Math.round((group.gemiddeldM + group.gemiddeldV) / 2) : 0;
  const datum = new Date().toLocaleDateString('nl-BE', { day: '2-digit', month: 'long', year: 'numeric' });

  const generate = async () => {
    if (!selectedId || !group) return;
    setLoading(true);
    setDocText('');
    setApiKeyError('');

    const apiKey = getStoredApiKey();

    if (!apiKey) {
      setDocText(generateEmployeeInfoFallback(selectedId, group.naam, gemiddeldLoon));
      setLoading(false);
      return;
    }

    try {
      const content = await callOpenAI(
        [
          {
            role: 'system',
            content:
              'Schrijf een officieel antwoorddocument voor een werknemer die zijn/haar recht op looninformatie uitoefent (EU-richtlijn 2026/1646, Art. 7). Formeel Nederlands. JSON: { "antwoorddocument": string }',
          },
          {
            role: 'user',
            content: `Werknemer ID: ${selectedId}. Functiegroep: ${group.naam}. Gemiddeld loon van de groep: €${gemiddeldLoon}`,
          },
        ],
        apiKey,
      );
      const parsed = JSON.parse(content) as { antwoorddocument: string };
      setDocText(parsed.antwoorddocument ?? '');
    } catch (err) {
      if (err instanceof OpenAIError && err.status === 401) {
        setApiKeyError('Ongeldige API-sleutel. Controleer uw sleutel en probeer opnieuw.');
      } else {
        setDocText('Fout bij genereren van document.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <ApiKeyInput onKeyChange={() => setApiKeyError('')} />

      {apiKeyError && (
        <div
          className="rounded-lg px-4 py-3 text-sm text-red-300"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          {apiKeyError}
        </div>
      )}

      <div>
        <p className="text-sm text-white/40 mb-4">
          Genereer het officieel antwoorddocument voor werknemers die hun recht op looninformatie
          uitoefenen conform <strong className="text-white/60">EU Art. 7 Richtlijn 2023/970</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Werknemer ID</label>
            <select
              className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setDocText(''); }}
            >
              <option value="" style={{ background: '#1a1a1a' }}>Selecteer werknemer ID…</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id} style={{ background: '#1a1a1a' }}>{e.id} — {e.functietitel}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1">Vergelijkingsgroep</label>
            <select
              className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              value={selectedGroup}
              onChange={(e) => { setSelectedGroup(e.target.value); setDocText(''); }}
            >
              <option value="" style={{ background: '#1a1a1a' }}>Selecteer functiegroep…</option>
              {groups.map((g) => (
                <option key={g.naam} value={g.naam} style={{ background: '#1a1a1a' }}>{g.naam}</option>
              ))}
            </select>
          </div>
        </div>

        {group && selectedGroup && (
          <div className="rounded-lg px-4 py-3 text-sm mb-3 space-y-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <span className="text-white/50">Gemiddeld loon van groep <strong className="text-white/70">{selectedGroup}</strong>:</span>
              <span className="text-white font-semibold ml-2">{fmt(gemiddeldLoon)}/maand</span>
            </div>
            <div className="flex gap-4 text-xs text-white/40">
              <span>Gem. M: {group.aantalM >= 2 ? fmt(group.gemiddeldM) : 'onvoldoende data'}</span>
              <span>Gem. V: {group.aantalV >= 2 ? fmt(group.gemiddeldV) : 'onvoldoende data'}</span>
              {group.status !== 'onvoldoende_data' && (
                <span className={group.loonkloof > 5 ? 'text-red-400 font-medium' : 'text-teal-400'}>
                  Kloof: {group.loonkloof.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        )}

        <Button
          className="bg-[#0D9488] hover:bg-[#0F766E] text-white gap-2"
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
            <p className="text-sm font-semibold text-white/70">Officieel antwoorddocument</p>
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
          <pre className="rounded-lg p-4 text-sm text-white/70 whitespace-pre-wrap font-sans leading-relaxed" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {docText}
          </pre>
        </div>
      )}
    </div>
  );
}
