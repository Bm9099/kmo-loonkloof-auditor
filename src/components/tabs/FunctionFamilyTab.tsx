'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { FunctionGroup } from '@/lib/types';
import { getMinBaremaForPc } from '@/lib/baremas';

const GROEPERING_TOELICHTING =
  'Automatisch op basis van trefwoorden in functietitel (bijv. "admin", "sales", "it"). Criteria: vergelijkbare taken, verantwoordelijkheid en competentievereisten conform Art. 4 EU Richtlijn 2023/970.';

interface FunctionFamilyTabProps {
  groups: FunctionGroup[];
}

function StatusBadge({ status }: { status: FunctionGroup['status'] }) {
  if (status === 'conform') {
    return (
      <span className="rounded-full px-3 py-1 text-xs font-semibold bg-teal-900/50 text-teal-400 border border-teal-800">
        Conform &lt;5%
      </span>
    );
  }
  if (status === 'actie_vereist') {
    return (
      <span className="rounded-full px-3 py-1 text-xs font-semibold bg-red-900/50 text-red-400 border border-red-800">
        Actie Vereist &gt;5%
      </span>
    );
  }
  return (
    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-amber-900/30 text-amber-400 border border-amber-800">
      Onvoldoende Data
    </span>
  );
}

function fmt(n: number) {
  return `€${n.toLocaleString('nl-BE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function getGroupBaremaStatus(group: FunctionGroup): { floor: number; pc: string } | null {
  const pcCounts: Record<string, number> = {};
  for (const emp of group.employees) {
    pcCounts[emp.paritair_comite] = (pcCounts[emp.paritair_comite] ?? 0) + 1;
  }
  const dominantPc = Object.entries(pcCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!dominantPc) return null;
  const floor = getMinBaremaForPc(dominantPc);
  if (floor === undefined) return null;
  return { floor, pc: dominantPc };
}

function BaremaBadge({ group }: { group: FunctionGroup }) {
  const info = getGroupBaremaStatus(group);
  if (!info) {
    return <span className="text-white/20 text-xs">—</span>;
  }
  const avg = group.employees.reduce((s, e) => s + e.bruto_maandloon_voltijds, 0) / group.employees.length;
  const meets = avg >= info.floor;
  return meets ? (
    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-teal-900/50 text-teal-400 border border-teal-800 whitespace-nowrap">
      ✓ {fmt(info.floor)}
    </span>
  ) : (
    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-900/50 text-red-400 border border-red-800 whitespace-nowrap">
      ✗ min {fmt(info.floor)}
    </span>
  );
}

export function FunctionFamilyTab({ groups }: FunctionFamilyTabProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <th className="text-left py-3 px-3 text-xs font-semibold text-white/30 uppercase tracking-widest w-6"></th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-white/30 uppercase tracking-widest">Functiegroep</th>
            <th className="text-center py-3 px-3 text-xs font-semibold text-white/30 uppercase tracking-widest">#M</th>
            <th className="text-center py-3 px-3 text-xs font-semibold text-white/30 uppercase tracking-widest">#V</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-white/30 uppercase tracking-widest">Gem. Bruto M</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-white/30 uppercase tracking-widest">Gem. Bruto V</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-white/30 uppercase tracking-widest">Kloof %</th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-white/30 uppercase tracking-widest">Status</th>
            <th className="text-left py-3 px-3 text-xs font-semibold text-white/30 uppercase tracking-widest">PC Barema</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, idx) => (
            <React.Fragment key={g.naam}>
              <tr
                className="cursor-pointer transition-colors hover:bg-white/5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onClick={() => setExpanded(expanded === g.naam ? null : g.naam)}
              >
                <td className="py-3 px-3 text-white/30">
                  {expanded === g.naam ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </td>
                <td className="py-3 px-3 font-medium text-white/80">
                  <div className="flex items-center gap-1.5">
                    {g.naam}
                    <div className="relative">
                      <button
                        type="button"
                        className="text-white/20 hover:text-white/50"
                        onMouseEnter={(e) => { e.stopPropagation(); setTooltip(g.naam); }}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Info over groeperingslogica"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      {tooltip === g.naam && (
                        <div className="absolute z-20 left-6 top-0 w-64 text-white text-xs rounded-lg p-2.5 shadow-lg leading-relaxed" style={{ background: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <strong className="block mb-1">Groeperingslogica (Art. 4)</strong>
                          {GROEPERING_TOELICHTING}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-center text-white/50">{g.aantalM}</td>
                <td className="py-3 px-3 text-center text-white/50">{g.aantalV}</td>
                <td className="py-3 px-3 text-right text-white/50">{g.gemiddeldM > 0 ? fmt(g.gemiddeldM) : '\u2014'}</td>
                <td className="py-3 px-3 text-right text-white/50">{g.gemiddeldV > 0 ? fmt(g.gemiddeldV) : '\u2014'}</td>
                <td className={`py-3 px-3 text-right font-semibold ${g.loonkloof > 5 ? 'text-red-400' : g.loonkloof < -5 ? 'text-amber-400' : 'text-teal-400'}`}>
                  {g.status !== 'onvoldoende_data' ? `${g.loonkloof.toFixed(1)}%` : '\u2014'}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={g.status} />
                </td>
                <td className="py-3 px-3">
                  <BaremaBadge group={g} />
                </td>
              </tr>
              {expanded === g.naam && (
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <td colSpan={9} className="px-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-white/60 mb-1">Loonverdeling</p>
                        <p className="text-white/40">Mediaan M: {g.mediaanM > 0 ? fmt(g.mediaanM) : '\u2014'}</p>
                        <p className="text-white/40">Mediaan V: {g.mediaanV > 0 ? fmt(g.mediaanV) : '\u2014'}</p>
                        <p className="text-white/40">Abs. verschil: {fmt(g.absLoonkloof)}/maand</p>
                      </div>
                      <div>
                        <p className="font-semibold text-white/60 mb-1 flex items-center gap-1">
                          Anciënniteitsverklaring
                          <span className="relative group cursor-pointer">
                            <Info className="w-3 h-3 text-white/30" />
                            <span className="absolute z-20 left-5 top-0 w-56 text-white text-xs rounded p-2 hidden group-hover:block leading-relaxed" style={{ background: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
                              Berekend als: (verschil gemiddelde anciënniteit × €150/jaar) / absoluut loonverschil. €150/jaar is een indicatieve waarde per anciënniteitsjaar.
                            </span>
                          </span>
                        </p>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <div
                              className="bg-teal-500 h-1.5 rounded-full"
                              style={{ width: `${Math.min(100, g.ancienniteitVerklaring)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-teal-400">
                            ~{g.ancienniteitVerklaring.toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-white/30 text-xs">
                          van het loonverschil mogelijk verklaard door anciënniteit
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-white/60 mb-1">Samenstelling</p>
                        <p className="text-white/40">Totaal: {g.employees.length} medewerkers</p>
                        <p className="text-white/40">M: {g.aantalM} &middot; V: {g.aantalV} &middot; X: {g.employees.filter(e => e.geslacht === 'X').length}</p>
                        {g.status === 'onvoldoende_data' && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-amber-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span className="text-xs">Minder dan 2 personen per geslacht</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
