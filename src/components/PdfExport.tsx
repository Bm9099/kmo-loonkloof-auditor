'use client';

import { useState } from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisResult } from '@/lib/types';

interface PdfExportProps {
  result: AnalysisResult;
}

export function PdfExport({ result }: PdfExportProps) {
  const [bedrijfsnaam, setBedrijfsnaam] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const datum = new Date().toLocaleDateString('nl-BE', { day: '2-digit', month: 'long', year: 'numeric' });
      const naam = bedrijfsnaam.trim() || 'Uw Organisatie';

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 32, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Loonkloof & Transparantie Rapport', 14, 14);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${naam} \u00b7 ${datum}`, 14, 23);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Samenvatting', 14, 42);

      const kpis = [
        ['Gemiddelde loonkloof', `${Math.abs(result.totaleGemiddeldeLoonkloof).toFixed(1)}%`],
        ['Mediaan loonverschil', `\u20ac${Math.abs(result.mediaanVerschilEuro).toFixed(0)}/maand`],
        ['Groepen actie vereist', `${result.aantalActieVereist}`],
        ['Compliance score', `${result.complianceScore}/100`],
      ];

      autoTable(doc, {
        startY: 46,
        head: [['Indicator', 'Waarde']],
        body: kpis,
        theme: 'grid',
        headStyles: { fillColor: [30, 64, 175], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
        margin: { left: 14, right: 14 },
      });

      const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Functiefamilie Analyse', 14, finalY);

      const rows = result.functieGroepen.map((g) => [
        g.naam,
        String(g.aantalM),
        String(g.aantalV),
        g.gemiddeldM > 0 ? `\u20ac${Math.round(g.gemiddeldM).toLocaleString('nl-BE')}` : '\u2014',
        g.gemiddeldV > 0 ? `\u20ac${Math.round(g.gemiddeldV).toLocaleString('nl-BE')}` : '\u2014',
        g.status !== 'onvoldoende_data' ? `${g.loonkloof.toFixed(1)}%` : '\u2014',
        g.status === 'conform' ? 'Conform' : g.status === 'actie_vereist' ? 'Actie Vereist' : 'Onv. Data',
      ]);

      autoTable(doc, {
        startY: finalY + 4,
        head: [['Functiegroep', 'M', 'V', 'Gem. Bruto M', 'Gem. Bruto V', 'Kloof', 'Status']],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [30, 64, 175], textColor: 255, fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        didParseCell: (data) => {
          if (data.column.index === 6 && data.section === 'body') {
            const val = String(data.cell.raw);
            if (val === 'Actie Vereist') {
              data.cell.styles.textColor = [220, 38, 38];
              data.cell.styles.fontStyle = 'bold';
            } else if (val === 'Conform') {
              data.cell.styles.textColor = [5, 150, 105];
            }
          }
        },
        margin: { left: 14, right: 14 },
      });

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Dit rapport is gegenereerd door de KMO Loonkloof- & Transparantie Auditor. Geen juridisch advies. Verifieer resultaten met een HR-expert of juridisch adviseur.',
        14,
        pageHeight - 10,
        { maxWidth: 182 }
      );

      doc.save(`loonkloof-rapport-${naam.toLowerCase().replace(/\s+/g, '-')}-${datum.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF fout:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl">
      <input
        type="text"
        placeholder="Bedrijfsnaam (optioneel)"
        value={bedrijfsnaam}
        onChange={(e) => setBedrijfsnaam(e.target.value)}
        className="flex-1 min-w-[200px] rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
      />
      <Button
        className="bg-[#1E40AF] hover:bg-[#1D3A9E] text-white gap-2"
        onClick={generate}
        disabled={loading}
      >
        <FileDown className="w-4 h-4" />
        {loading ? 'PDF genereren\u2026' : 'Download PDF Rapport'}
      </Button>
    </div>
  );
}
