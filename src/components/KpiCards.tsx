'use client';

import { TrendingDown, AlertTriangle, Euro, Award, ShieldAlert } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import { SECTOR_BENCHMARKS } from '@/lib/baremas';

interface KpiCardsProps {
  result: AnalysisResult;
}

export function KpiCards({ result }: KpiCardsProps) {
  const { totaleGemiddeldeLoonkloof, aantalActieVereist, mediaanVerschilEuro, mediaanLoonkloof, complianceScore, onderBarema } = result;

  const allEmployees = result.functieGroepen.flatMap((g) => g.employees);
  const pcCounts: Record<string, number> = {};
  allEmployees.forEach((e) => { pcCounts[e.paritair_comite] = (pcCounts[e.paritair_comite] || 0) + 1; });
  const dominantPc = Object.entries(pcCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'default';
  const benchmark = SECTOR_BENCHMARKS[dominantPc] ?? SECTOR_BENCHMARKS['default'];
  const gapAbs = Math.abs(totaleGemiddeldeLoonkloof);
  const gapValueColor = gapAbs > 5 ? 'text-red-400' : 'text-teal-400';
  const gapDotColor = gapAbs < 3 ? 'bg-teal-500' : gapAbs < 5 ? 'bg-amber-400' : 'bg-red-500';

  const scoreColor =
    complianceScore >= 80 ? 'text-teal-400' : complianceScore >= 60 ? 'text-amber-400' : 'text-red-400';

  const cards = [
    {
      icon: TrendingDown,
      label: 'Gem. Loonkloof',
      value: `${gapAbs.toFixed(1)}%`,
      valueColor: gapValueColor,
      sub: totaleGemiddeldeLoonkloof > 0 ? 'mannen verdienen meer' : totaleGemiddeldeLoonkloof < 0 ? 'vrouwen verdienen meer' : 'gelijk',
      indicator: <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${gapDotColor}`} />,
    },
    {
      icon: AlertTriangle,
      label: 'Actie Vereist',
      value: `${aantalActieVereist}`,
      valueColor: aantalActieVereist > 0 ? 'text-red-400' : 'text-teal-400',
      sub: `functiegroep${aantalActieVereist !== 1 ? 'en' : ''} >5% kloof`,
      indicator: null,
    },
    {
      icon: Euro,
      label: 'Mediaan Verschil',
      value: `\u20ac${Math.abs(mediaanVerschilEuro).toLocaleString('nl-BE', { maximumFractionDigits: 0 })}`,
      valueColor: 'text-white',
      sub: `${Math.abs(mediaanLoonkloof).toFixed(1)}% mediaan kloof`,
      indicator: null,
    },
    {
      icon: Award,
      label: 'Compliance Score',
      value: `${complianceScore}/100`,
      valueColor: scoreColor,
      sub: complianceScore >= 80 ? 'Goed' : complianceScore >= 60 ? 'Verbetering nodig' : 'Kritisch',
      indicator: null,
    },
    {
      icon: ShieldAlert,
      label: 'Onder Barema',
      value: `${onderBarema}`,
      valueColor: onderBarema === 0 ? 'text-teal-400' : onderBarema <= 2 ? 'text-amber-400' : 'text-red-400',
      sub: onderBarema === 0 ? 'conform sectorminima' : `medewerker${onderBarema !== 1 ? 's' : ''} onder PC-minimum`,
      indicator: onderBarema === 0
        ? <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-teal-500" />
        : onderBarema <= 2
          ? <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-amber-400" />
          : <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-red-500" />,
    },
  ];

  const betterThanSector = gapAbs <= benchmark.gemiddeldeLoonkloof;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl p-6 hover:scale-[1.02] transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-white/20" />
                {card.indicator}
              </div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-1">{card.label}</p>
              <div className={`text-4xl font-black mb-1 ${card.valueColor}`}>{card.value}</div>
              <p className="text-xs text-white/30">{card.sub}</p>
            </div>
          );
        })}
      </div>
      <div
        className="mb-6 rounded-xl px-4 py-2.5 text-xs flex flex-wrap items-center gap-x-3 gap-y-1"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-white/40">Sectorvergelijking ({benchmark.sectorNaam}):</span>
        <span className="text-white/70">
          Uw loonkloof: <strong className={gapAbs > 5 ? 'text-red-400' : 'text-teal-400'}>{gapAbs.toFixed(1)}%</strong>
          {' | '}
          Sectorgemiddelde: <strong className="text-white/70">{benchmark.gemiddeldeLoonkloof}%</strong>
          {' | '}
          <span className={betterThanSector ? 'text-teal-400' : 'text-amber-400'}>
            {betterThanSector ? '✓ Beter dan sectorgemiddelde' : '↑ Slechter dan sectorgemiddelde'}
          </span>
        </span>
      </div>
    </>
  );
}
