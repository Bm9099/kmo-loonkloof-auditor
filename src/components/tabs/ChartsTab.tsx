'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
} from 'recharts';
import { FunctionGroup, Employee } from '@/lib/types';

interface ChartsTabProps {
  groups: FunctionGroup[];
  employees: Employee[];
}

const COLORS = { M: '#1E40AF', V: '#EC4899', X: '#8B5CF6' };
const GENDER_LABELS = { M: 'Man', V: 'Vrouw', X: 'Non-binair' } as const;

interface TooltipEntry {
  name?: unknown;
  value?: unknown;
  color?: unknown;
  payload?: unknown;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: unknown }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm ring-1 ring-slate-900/5">
      {label != null && <p className="font-semibold text-slate-800 mb-1.5">{String(label)}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-slate-600">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: String(entry.color) }}
          />
          <span className="font-medium">{String(entry.name)}:</span>
          <span>
            {typeof entry.value === 'number'
              ? `€${entry.value.toLocaleString('nl-BE', { minimumFractionDigits: 0 })}`
              : String(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScatterTooltip({ active, payload }: { active?: boolean; payload?: TooltipEntry[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as { x: number; y: number; geslacht: 'M' | 'V' | 'X' };
  if (!d) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm ring-1 ring-slate-900/5">
      <p className="font-semibold text-slate-800 mb-1">{GENDER_LABELS[d.geslacht]}</p>
      <p className="text-slate-600">
        <span className="font-medium">Anciënniteit:</span> {d.x} jaar
      </p>
      <p className="text-slate-600">
        <span className="font-medium">Bruto loon:</span>{' '}
        €{d.y.toLocaleString('nl-BE', { minimumFractionDigits: 0 })}
      </p>
    </div>
  );
}

function LegendDots({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex gap-4 flex-wrap">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: i.color }} />
          {i.label}
        </div>
      ))}
    </div>
  );
}

export function ChartsTab({ groups, employees }: ChartsTabProps) {
  const barData = groups
    .filter((g) => g.status !== 'onvoldoende_data' && (g.gemiddeldM > 0 || g.gemiddeldV > 0))
    .map((g) => ({
      name: g.naam.length > 20 ? g.naam.slice(0, 18) + '…' : g.naam,
      Mannen: Math.round(g.gemiddeldM),
      Vrouwen: Math.round(g.gemiddeldV),
    }));

  const scatterData = employees.map((e) => ({
    x: e.ancienniteit_jaren,
    y: e.bruto_maandloon_voltijds,
    geslacht: e.geslacht,
    id: e.id,
  }));

  const scatterByGender = {
    M: scatterData.filter((d) => d.geslacht === 'M'),
    V: scatterData.filter((d) => d.geslacht === 'V'),
    X: scatterData.filter((d) => d.geslacht === 'X'),
  };

  return (
    <div className="space-y-10">
      {/* Bar chart */}
      <div>
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#0F172A]">
            Gem. bruto maandloon per functiegroep
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">Vergelijking man vs. vrouw per functiecategorie</p>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <LegendDots items={[{ color: COLORS.M, label: 'Man' }, { color: COLORS.V, label: 'Vrouw' }]} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#64748b' }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickFormatter={(v: number) => `€${(v / 1000).toFixed(1)}k`}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Tooltip content={(props: any) => <ChartTooltip {...props} />} />
            <Bar dataKey="Mannen" fill={COLORS.M} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Vrouwen" fill={COLORS.V} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter chart */}
      <div>
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#0F172A]">
            Anciënniteit vs. bruto maandloon
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">Spreiding per medewerker, gekleurd op geslacht</p>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <LegendDots items={[
            { color: COLORS.M, label: 'Man' },
            { color: COLORS.V, label: 'Vrouw' },
            { color: COLORS.X, label: 'Non-binair' },
          ]} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 5, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="x"
              name="Anciënniteit"
              unit=" jr"
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{ value: 'Anciënniteit (jaar)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
            />
            <YAxis
              dataKey="y"
              name="Loon"
              tickFormatter={(v: number) => `€${(v / 1000).toFixed(1)}k`}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Tooltip content={(props: any) => <ScatterTooltip {...props} />} cursor={{ strokeDasharray: '3 3' }} />
            {(['M', 'V', 'X'] as const).map((g) =>
              scatterByGender[g].length > 0 ? (
                <Scatter
                  key={g}
                  name={GENDER_LABELS[g]}
                  data={scatterByGender[g]}
                  fill={COLORS[g]}
                  opacity={0.75}
                />
              ) : null
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
