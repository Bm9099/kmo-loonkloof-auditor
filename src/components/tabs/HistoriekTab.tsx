'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { SavedAnalysis, loadHistory, deleteAnalysis } from '@/lib/history';

export function HistoriekTab() {
  const [history, setHistory] = useState<SavedAnalysis[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    setHistory(loadHistory());
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)' }}
        >
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-white/60 font-medium mb-1">Nog geen analyses opgeslagen</p>
        <p className="text-white/30 text-sm max-w-xs">
          Voer minstens 2 analyses uit om trends te zien. Elke analyse wordt automatisch bewaard.
        </p>
      </div>
    );
  }

  if (history.length < 2) {
    return (
      <div className="space-y-6">
        <div
          className="rounded-xl border p-5 text-center"
          style={{ background: 'rgba(13,148,136,0.06)', borderColor: 'rgba(13,148,136,0.2)' }}
        >
          <p className="text-white/60 text-sm">
            Voer minstens 2 analyses uit om trends te zien
          </p>
        </div>
        <HistoryTable history={history} onDelete={handleDelete} />
      </div>
    );
  }

  const chartData = [...history].reverse().map((s) => ({
    name: s.label || s.date,
    gap: parseFloat(Math.abs(s.overallGap).toFixed(1)),
    score: s.complianceScore,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
          Loonkloof % over tijd
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(15,23,42,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value}%`, 'Loonkloof']}
            />
            <Bar dataKey="gap" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.gap > 5 ? '#ef4444' : entry.gap > 2 ? '#f59e0b' : '#0D9488'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <HistoryTable history={history} onDelete={handleDelete} />
    </div>
  );
}

function HistoryTable({
  history,
  onDelete,
}: {
  history: SavedAnalysis[];
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
        Opgeslagen analyses
      </h3>
      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-widest">Label</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-widest">Datum</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-widest">Loonkloof</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-widest">Compliance</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {history.map((s) => (
              <tr
                key={s.id}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                className="hover:bg-white/[0.03] transition-colors"
              >
                <td className="px-4 py-3 text-white/80 font-medium">{s.label || '—'}</td>
                <td className="px-4 py-3 text-white/40">{s.date}</td>
                <td className={`px-4 py-3 text-right font-semibold ${Math.abs(s.overallGap) > 5 ? 'text-red-400' : 'text-teal-400'}`}>
                  {Math.abs(s.overallGap).toFixed(1)}%
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${s.complianceScore >= 80 ? 'text-teal-400' : s.complianceScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                  {s.complianceScore}/100
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(s.id)}
                    className="text-white/20 hover:text-red-400 transition-colors p-1 rounded"
                    aria-label="Verwijder analyse"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
