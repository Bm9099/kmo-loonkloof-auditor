'use client';

import { TrendingDown, AlertTriangle, Euro, Award } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';

interface KpiCardsProps {
  result: AnalysisResult;
}

function StoplichtIcon({ value }: { value: number }) {
  const abs = Math.abs(value);
  if (abs < 3) return <div className="w-3 h-3 rounded-full bg-emerald-500" />;
  if (abs < 5) return <div className="w-3 h-3 rounded-full bg-amber-400" />;
  return <div className="w-3 h-3 rounded-full bg-red-500" />;
}

export function KpiCards({ result }: KpiCardsProps) {
  const { totaleGemiddeldeLoonkloof, aantalActieVereist, mediaanVerschilEuro, mediaanLoonkloof, complianceScore } = result;

  const scoreColor =
    complianceScore >= 80 ? 'text-emerald-600' : complianceScore >= 60 ? 'text-amber-500' : 'text-red-600';

  const cards = [
    {
      icon: TrendingDown,
      label: 'Gem. Loonkloof',
      value: `${Math.abs(totaleGemiddeldeLoonkloof).toFixed(1)}%`,
      sub: totaleGemiddeldeLoonkloof > 0 ? 'mannen verdienen meer' : totaleGemiddeldeLoonkloof < 0 ? 'vrouwen verdienen meer' : 'gelijk',
      extra: <StoplichtIcon value={totaleGemiddeldeLoonkloof} />,
      color: Math.abs(totaleGemiddeldeLoonkloof) > 5 ? 'border-red-200' : 'border-emerald-200',
    },
    {
      icon: AlertTriangle,
      label: 'Actie Vereist',
      value: `${aantalActieVereist}`,
      sub: `functiegroep${aantalActieVereist !== 1 ? 'en' : ''} >5% kloof`,
      extra: null,
      color: aantalActieVereist > 0 ? 'border-red-200' : 'border-emerald-200',
    },
    {
      icon: Euro,
      label: 'Mediaan Verschil',
      value: `\u20ac${Math.abs(mediaanVerschilEuro).toLocaleString('nl-BE', { maximumFractionDigits: 0 })}`,
      sub: `${Math.abs(mediaanLoonkloof).toFixed(1)}% mediaan kloof`,
      extra: null,
      color: 'border-slate-200',
    },
    {
      icon: Award,
      label: 'Compliance Score',
      value: <span className={scoreColor}>{complianceScore}/100</span>,
      sub: complianceScore >= 80 ? 'Goed' : complianceScore >= 60 ? 'Verbetering nodig' : 'Kritisch',
      extra: null,
      color: complianceScore >= 80 ? 'border-emerald-200' : complianceScore >= 60 ? 'border-amber-200' : 'border-red-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={`bg-white rounded-xl border ${card.color} shadow-sm p-5`}>
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-5 h-5 text-slate-400" />
              {card.extra}
            </div>
            <div className="text-2xl font-bold text-[#0F172A] mb-0.5">{card.value}</div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{card.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{card.sub}</div>
          </div>
        );
      })}
    </div>
  );
}
