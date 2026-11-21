'use client';

import { TrendingDown, AlertTriangle, Euro, Award } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';

interface KpiCardsProps {
  result: AnalysisResult;
}

function StoplichtDot({ value }: { value: number }) {
  const abs = Math.abs(value);
  if (abs < 3) return <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />;
  if (abs < 5) return <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />;
  return <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-500/20" />;
}

function MiniSparkline({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(Math.abs(value) / max, 1);
  const w = 56;
  const h = 24;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const x = (i / 7) * w;
    const noise = (Math.sin(i * 2.3 + value) * 0.15 + 1) * pct;
    const y = h - noise * h * 0.85 - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
      extra: <StoplichtDot value={totaleGemiddeldeLoonkloof} />,
      sparkColor: Math.abs(totaleGemiddeldeLoonkloof) > 5 ? '#ef4444' : '#10b981',
      sparkValue: Math.abs(totaleGemiddeldeLoonkloof),
      sparkMax: 20,
      borderColor: Math.abs(totaleGemiddeldeLoonkloof) > 5 ? 'border-l-red-400' : 'border-l-emerald-400',
    },
    {
      icon: AlertTriangle,
      label: 'Actie Vereist',
      value: `${aantalActieVereist}`,
      sub: `functiegroep${aantalActieVereist !== 1 ? 'en' : ''} >5% kloof`,
      extra: null,
      sparkColor: aantalActieVereist > 0 ? '#ef4444' : '#10b981',
      sparkValue: aantalActieVereist,
      sparkMax: 10,
      borderColor: aantalActieVereist > 0 ? 'border-l-red-400' : 'border-l-emerald-400',
    },
    {
      icon: Euro,
      label: 'Mediaan Verschil',
      value: `€${Math.abs(mediaanVerschilEuro).toLocaleString('nl-BE', { maximumFractionDigits: 0 })}`,
      sub: `${Math.abs(mediaanLoonkloof).toFixed(1)}% mediaan kloof`,
      extra: null,
      sparkColor: '#6366f1',
      sparkValue: Math.abs(mediaanLoonkloof),
      sparkMax: 20,
      borderColor: 'border-l-indigo-400',
    },
    {
      icon: Award,
      label: 'Compliance Score',
      value: <span className={scoreColor}>{complianceScore}/100</span>,
      sub: complianceScore >= 80 ? 'Goed' : complianceScore >= 60 ? 'Verbetering nodig' : 'Kritisch',
      extra: null,
      sparkColor: complianceScore >= 80 ? '#10b981' : complianceScore >= 60 ? '#f59e0b' : '#ef4444',
      sparkValue: complianceScore,
      sparkMax: 100,
      borderColor: complianceScore >= 80 ? 'border-l-emerald-400' : complianceScore >= 60 ? 'border-l-amber-400' : 'border-l-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`group bg-white rounded-2xl border-l-4 ${card.borderColor} ring-1 ring-slate-900/5 shadow-sm p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-5 h-5 text-slate-400" />
              {card.extra}
            </div>
            <div className="text-2xl font-bold text-[#0F172A] mb-0.5">{card.value}</div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{card.label}</div>
            <div className="flex items-end justify-between mt-1">
              <div className="text-xs text-slate-400">{card.sub}</div>
              <MiniSparkline value={card.sparkValue} max={card.sparkMax} color={card.sparkColor} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
