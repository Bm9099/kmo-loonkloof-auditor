'use client';

import { useState } from 'react';
import { FileDown, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisResult } from '@/lib/types';

interface PdfExportProps {
  result: AnalysisResult;
}

const DISCLAIMER =
  'Dit document is gegenereerd door de KMO Loonkloof-Auditor op basis van de door u aangeleverde geanonimiseerde gegevens. Het vormt geen juridisch advies.';

export function PdfExport({ result }: PdfExportProps) {
  const [bedrijfsnaam, setBedrijfsnaam] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const naam = bedrijfsnaam.trim() || 'Uw Organisatie';
  const datum = new Date().toLocaleDateString('nl-BE', { day: '2-digit', month: 'long', year: 'numeric' });

  const generate = async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Header
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 32, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Loonkloof & Transparantie Rapport', 14, 14);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${naam} · ${datum}`, 14, 23);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Samenvatting', 14, 42);

      const kpis = [
        ['Gemiddelde loonkloof', `${Math.abs(result.totaleGemiddeldeLoonkloof).toFixed(1)}%`],
        ['Mediaan loonverschil', `€${Math.abs(result.mediaanVerschilEuro).toFixed(0)}/maand`],
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

      let y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Functiefamilie Analyse', 14, y);

      const rows = result.functieGroepen.map((g) => [
        g.naam,
        String(g.aantalM),
        String(g.aantalV),
        g.gemiddeldM > 0 ? `€${Math.round(g.gemiddeldM).toLocaleString('nl-BE')}` : '—',
        g.gemiddeldV > 0 ? `€${Math.round(g.gemiddeldV).toLocaleString('nl-BE')}` : '—',
        g.status !== 'onvoldoende_data' ? `${g.loonkloof.toFixed(1)}%` : '—',
        g.status === 'conform' ? 'Conform' : g.status === 'actie_vereist' ? 'Actie Vereist' : 'Onv. Data',
      ]);

      autoTable(doc, {
        startY: y + 4,
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

      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

      doc.addPage();
      y = 20;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Wettelijke Rapportage (Art. 9 EU Richtlijn 2023/970)', 14, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Loonkloof per functiegroep (gemiddeld & mediaan)', 14, y);
      y += 4;

      const art9Rows = result.functieGroepen.map((g) => [
        g.naam,
        g.status !== 'onvoldoende_data' ? `${g.loonkloof.toFixed(1)}%` : '—',
        g.mediaanM > 0 && g.mediaanV > 0
          ? `${(((g.mediaanM - g.mediaanV) / g.mediaanM) * 100).toFixed(1)}%`
          : '—',
        g.status === 'conform' ? 'Conform' : g.status === 'actie_vereist' ? 'Actie Vereist' : 'Onv. Data',
      ]);

      autoTable(doc, {
        startY: y,
        head: [['Functiegroep', 'Kloof gem.', 'Kloof mediaan', 'Status']],
        body: art9Rows,
        theme: 'grid',
        headStyles: { fillColor: [30, 64, 175], textColor: 255, fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14, right: 14 },
      });

      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('2. Mediaan loonkloof (totaal)', 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(
        `Mediaan loonkloof: ${Math.abs(result.mediaanLoonkloof).toFixed(1)}%  |  Mediaan loonverschil: €${Math.abs(result.mediaanVerschilEuro).toFixed(0)}/maand`,
        14,
        y,
      );
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Loonkloof bij deeltijdwerkers', 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(
        'Niet van toepassing — de ingevoerde data bevat uitsluitend voltijds equivalent (VTE) brutomaandlonen.',
        14,
        y,
        { maxWidth: 182 },
      );
      y += 12;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('4. Loonkloof in variabel loon / bonussen', 14, y);
      y += 4;

      const variabelRows = result.functieGroepen
        .filter((g) => g.aantalM >= 2 && g.aantalV >= 2)
        .map((g) => {
          const kloofVariabel =
            g.gemiddeldVariabelM > 0
              ? (((g.gemiddeldVariabelM - g.gemiddeldVariabelV) / g.gemiddeldVariabelM) * 100).toFixed(1) + '%'
              : '—';
          return [
            g.naam,
            g.gemiddeldVariabelM > 0 ? `€${Math.round(g.gemiddeldVariabelM).toLocaleString('nl-BE')}/jaar` : '—',
            g.gemiddeldVariabelV > 0 ? `€${Math.round(g.gemiddeldVariabelV).toLocaleString('nl-BE')}/jaar` : '—',
            kloofVariabel,
          ];
        });

      if (variabelRows.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [['Functiegroep', 'Var. loon M', 'Var. loon V', 'Kloof var.']],
          body: variabelRows,
          theme: 'grid',
          headStyles: { fillColor: [30, 64, 175], textColor: 255, fontSize: 8 },
          bodyStyles: { fontSize: 8 },
          margin: { left: 14, right: 14 },
        });
        y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('Onvoldoende data per geslacht per groep.', 14, y);
        y += 10;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 64, 175);
      doc.text('Art. 10 — Gemeenschappelijke Loonevaluatie', 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      const art10Text =
        'Bij een loonkloof >5% die niet objectief verklaard kan worden, bent u als werkgever wettelijk verplicht een gemeenschappelijke loonevaluatie uit te voeren samen met de werknemersvertegenwoordigers (Art. 10 EU Richtlijn 2023/970). ' +
        `Huidig aantal groepen met kloof >5%: ${result.aantalActieVereist}.`;
      const art10Lines = doc.splitTextToSize(art10Text, 182) as string[];
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(14, y - 2, 182, art10Lines.length * 5 + 6, 2, 2, 'F');
      doc.text(art10Lines, 18, y + 4);
      y += art10Lines.length * 5 + 14;

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 116, 139);
      doc.text(DISCLAIMER, 14, pageHeight - 10, { maxWidth: 182 });

      doc.save(`loonkloof-rapport-${naam.toLowerCase().replace(/\s+/g, '-')}-${datum.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF fout:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateActionPlan = async () => {
    setLoadingPlan(true);
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Header
      doc.setFillColor(13, 148, 136);
      doc.rect(0, 0, 210, 36, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(17);
      doc.setFont('helvetica', 'bold');
      doc.text(`Actieplan Loontransparantie — ${naam}`, 14, 15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Opgesteld op ${datum} · EU Richtlijn 2023/970`, 14, 26);

      doc.setTextColor(15, 23, 42);

      // Intro
      let y = 46;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const introText =
        'Dit actieplan identificeert de functiefamilies waarvoor corrigerende maatregelen vereist zijn conform de EU Richtlijn 2023/970 inzake loontransparantie. ' +
        'Per groep wordt een concrete aanbeveling geformuleerd met prioriteitsindicatie.';
      const introLines = doc.splitTextToSize(introText, 182) as string[];
      doc.text(introLines, 14, y);
      y += introLines.length * 5 + 8;

      // Summary table
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Overzicht', 14, y);
      y += 4;

      const summaryRows = [
        ['Totale gemiddelde loonkloof', `${Math.abs(result.totaleGemiddeldeLoonkloof).toFixed(1)}%`],
        ['Mediaan loonverschil', `€${Math.abs(result.mediaanVerschilEuro).toFixed(0)}/maand`],
        ['Functiefamilies met actie vereist', `${result.aantalActieVereist}`],
        ['Compliance score', `${result.complianceScore}/100`],
      ];

      autoTable(doc, {
        startY: y,
        head: [['Indicator', 'Waarde']],
        body: summaryRows,
        theme: 'grid',
        headStyles: { fillColor: [13, 148, 136], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
        margin: { left: 14, right: 14 },
      });

      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

      // Aanbevelingen per groep
      const actieGroepen = result.functieGroepen.filter((g) => g.status === 'actie_vereist');

      if (actieGroepen.length === 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(5, 150, 105);
        doc.text('✓ Geen actie vereist — alle functiefamilies zijn conform.', 14, y);
      } else {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('Concrete aanbevelingen per functiefamilie', 14, y);
        y += 8;

        for (const g of actieGroepen) {
          if (y > 250) {
            doc.addPage();
            y = 20;
          }

          const gapPct = Math.abs(g.loonkloof);
          const prioriteit = gapPct > 15 ? 'HOOG' : gapPct > 8 ? 'MEDIUM' : 'LAAG';
          const prioriteitColor: [number, number, number] =
            prioriteit === 'HOOG' ? [220, 38, 38] : prioriteit === 'MEDIUM' ? [245, 158, 11] : [13, 148, 136];

          // Group header
          doc.setFillColor(248, 250, 252);
          doc.roundedRect(14, y - 3, 182, 8, 1.5, 1.5, 'F');
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text(g.naam, 17, y + 2);

          // Priority badge
          doc.setFontSize(8);
          doc.setTextColor(...prioriteitColor);
          doc.text(`Prioriteit: ${prioriteit}`, 160, y + 2);
          y += 10;

          // Recommendation text
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(30, 41, 59);

          const verhoogPct = gapPct.toFixed(1);
          const absEur = g.absLoonkloof > 0 ? `€${Math.round(g.absLoonkloof).toLocaleString('nl-BE')}/maand` : '';

          const rec =
            g.loonkloof > 0
              ? `Verhoog het gemiddelde vrouwenloon met ${verhoogPct}% om de loonkloof te elimineren${absEur ? ` (verschil: ${absEur})` : ''}. ` +
                `Controleer of de kloof objectief verklaard kan worden (anciënniteit, functieprofiel). ` +
                `Indien niet: voer een gecorrigeerd loontraject in voor de V-groep in deze functiefamilie.`
              : `Verhoog het gemiddelde mannenloon met ${verhoogPct}% om de negatieve loonkloof te elimineren${absEur ? ` (verschil: ${absEur})` : ''}. ` +
                `Controleer loonschalen en bonusbeleid voor M-werknemers in deze groep.`;

          const recLines = doc.splitTextToSize(rec, 178) as string[];
          doc.text(recLines, 17, y);
          y += recLines.length * 5 + 4;

          // Detail row
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text(
            `Gem. M: €${Math.round(g.gemiddeldM).toLocaleString('nl-BE')}  ·  Gem. V: €${Math.round(g.gemiddeldV).toLocaleString('nl-BE')}  ·  Kloof: ${g.loonkloof.toFixed(1)}%`,
            17,
            y,
          );
          y += 10;
        }
      }

      // Footer EU reference on last page
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(13, 148, 136);
      doc.text('EU Richtlijn 2023/970 — Loontransparantie', 14, pageHeight - 16);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.text(
        'Richtlijn (EU) 2023/970 van het Europees Parlement en de Raad van 10 mei 2023 ter versterking van de toepassing van het beginsel van gelijke beloning van mannen en vrouwen voor gelijke of gelijkwaardige arbeid via loontransparantie en handhavingsmechanismen.',
        14,
        pageHeight - 10,
        { maxWidth: 182 },
      );

      doc.save(`actieplan-loontransparantie-${naam.toLowerCase().replace(/\s+/g, '-')}-${datum.replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('Actieplan PDF fout:', err);
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <div
      className="flex flex-wrap items-center gap-3 p-4 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <input
        type="text"
        placeholder="Bedrijfsnaam (optioneel)"
        value={bedrijfsnaam}
        onChange={(e) => setBedrijfsnaam(e.target.value)}
        className="flex-1 min-w-[180px] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      />
      <Button
        className="bg-[#0D9488] hover:bg-[#0F766E] text-white gap-2"
        onClick={generate}
        disabled={loading}
      >
        <FileDown className="w-4 h-4" />
        {loading ? 'PDF genereren…' : 'Download PDF Rapport'}
      </Button>
      <Button
        variant="outline"
        className="gap-2 border-teal-700 text-teal-300 hover:bg-teal-900/30 hover:text-teal-200"
        onClick={generateActionPlan}
        disabled={loadingPlan}
        style={{ borderColor: 'rgba(13,148,136,0.4)', background: 'rgba(13,148,136,0.08)' }}
      >
        <ClipboardList className="w-4 h-4" />
        {loadingPlan ? 'Genereren…' : 'Download Actieplan'}
      </Button>
    </div>
  );
}
