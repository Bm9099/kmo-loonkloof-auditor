'use client';

import { TrendingDown, AlertTriangle, Euro, Award } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';

interface KpiCardsProps {
  result: AnalysisResult;
}

export function KpiCards({ result }: KpiCardsProps) {
  const { totaleGemiddeldeLoonkloof, aantalActieVereist, mediaanVerschilEuro, mediaanLoonkloof, complianceScore } = result;

  const gapAbs = Math.abs(totaleGemiddeldeLoonkloof);
  const gapValueColor = gapAbs > 5 ? 'text-red-600' : 'text-emerald-600';
  const gapDotColor = gapAbs < 3 ? 'bg-emerald-500' : gapAbs < 5 ? 'bg-amber-400' : 'bg-red-500';

  const scoreColor =
    complianceScore >= 80 ? 'text-emerald-600' : complianceScore >= 60 ? 'text-amber-500' : 'text-red-600';

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
      valueColor: aantalActieVereist > 0 ? 'text-red-600' : 'text-emerald-600',
      sub: `functiegroep${aantalActieVereist !== 1 ? 'en' : ''} >5% kloof`,
      indicator: null,
    },
    {
      icon: Euro,
      label: 'Mediaan Verschil',
      value: `\u20ac${Math.abs(mediaanVerschilEuro).toLocaleString('nl-BE', { maximumFractionDigits: 0 })}`,
      valueColor: 'text-slate-900',
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
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-5 h-5 text-slate-400" />
              {card.indicator}
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{card.label}</p>
            <div className={`text-4xl font-black mb-1 ${card.valueColor}`}>{card.value}</div>
            <p className="text-xs text-slate-400">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
