'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

export function ChartsTab({ groups, employees }: ChartsTabProps) {
  const barData = groups
    .filter((g) => g.status !== 'onvoldoende_data' && (g.gemiddeldM > 0 || g.gemiddeldV > 0))
    .map((g) => ({
      name: g.naam.length > 20 ? g.naam.slice(0, 18) + '\u2026' : g.naam,
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
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Gemiddeld bruto maandloon per functiegroep (M vs V)
        </h3>
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
              tickFormatter={(v: number) => `\u20ac${(v / 1000).toFixed(1)}k`}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip
              formatter={(value) =>
                typeof value === 'number'
                  ? `\u20ac${value.toLocaleString('nl-BE', { minimumFractionDigits: 0 })}`
                  : String(value)
              }
            />
            <Legend verticalAlign="top" />
            <Bar dataKey="Mannen" fill={COLORS.M} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Vrouwen" fill={COLORS.V} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Anci\u00ebnniteit vs bruto maandloon (per geslacht)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 5, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="x"
              name="Anci\u00ebnniteit"
              unit=" jr"
              tick={{ fontSize: 11, fill: '#64748b' }}
              label={{ value: 'Anci\u00ebnniteit (jaar)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#94a3b8' }}
            />
            <YAxis
              dataKey="y"
              name="Loon"
              tickFormatter={(v: number) => `\u20ac${(v / 1000).toFixed(1)}k`}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) =>
                typeof value === 'number'
                  ? name === 'Loon'
                    ? `\u20ac${value.toLocaleString('nl-BE')}`
                    : `${value} jaar`
                  : String(value)
              }
            />
            <Legend />
            {(['M', 'V', 'X'] as const).map((g) =>
              scatterByGender[g].length > 0 ? (
                <Scatter
                  key={g}
                  name={g === 'M' ? 'Man' : g === 'V' ? 'Vrouw' : 'Non-binair'}
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
