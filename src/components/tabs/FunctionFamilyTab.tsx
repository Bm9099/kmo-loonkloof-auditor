'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FunctionGroup } from '@/lib/types';

interface FunctionFamilyTabProps {
  groups: FunctionGroup[];
}

function StatusBadge({ status }: { status: FunctionGroup['status'] }) {
  if (status === 'conform') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        Conform &lt;5%
      </span>
    );
  }
  if (status === 'actie_vereist') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
        Actie Vereist &gt;5%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
      Onvoldoende Data
    </span>
  );
}

function fmt(n: number) {
  return `\u20ac${n.toLocaleString('nl-BE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function FunctionFamilyTab({ groups }: FunctionFamilyTabProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-3 font-semibold text-slate-600 w-6"></th>
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Functiegroep</th>
            <th className="text-center py-3 px-3 font-semibold text-slate-600">#M</th>
            <th className="text-center py-3 px-3 font-semibold text-slate-600">#V</th>
            <th className="text-right py-3 px-3 font-semibold text-slate-600">Gem. Bruto M</th>
            <th className="text-right py-3 px-3 font-semibold text-slate-600">Gem. Bruto V</th>
            <th className="text-right py-3 px-3 font-semibold text-slate-600">Kloof %</th>
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, idx) => (
            <React.Fragment key={g.naam}>
              <tr
                className={`border-b border-slate-100 cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/60'}`}
                onClick={() => setExpanded(expanded === g.naam ? null : g.naam)}
              >
                <td className="py-3 px-3 text-slate-400">
                  {expanded === g.naam ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </td>
                <td className="py-3 px-3 font-medium text-[#0F172A]">{g.naam}</td>
                <td className="py-3 px-3 text-center text-slate-600">{g.aantalM}</td>
                <td className="py-3 px-3 text-center text-slate-600">{g.aantalV}</td>
                <td className="py-3 px-3 text-right text-slate-600">{g.gemiddeldM > 0 ? fmt(g.gemiddeldM) : '\u2014'}</td>
                <td className="py-3 px-3 text-right text-slate-600">{g.gemiddeldV > 0 ? fmt(g.gemiddeldV) : '\u2014'}</td>
                <td className={`py-3 px-3 text-right font-semibold ${g.loonkloof > 5 ? 'text-red-600' : g.loonkloof < -5 ? 'text-orange-500' : 'text-emerald-600'}`}>
                  {g.status !== 'onvoldoende_data' ? `${g.loonkloof.toFixed(1)}%` : '\u2014'}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={g.status} />
                </td>
              </tr>
              {expanded === g.naam && (
                <tr key={`${g.naam}-detail`} className="bg-blue-50/50">
                  <td colSpan={8} className="px-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-slate-700 mb-1">Loonverdeling</p>
                        <p className="text-slate-600">Mediaan M: {g.mediaanM > 0 ? fmt(g.mediaanM) : '\u2014'}</p>
                        <p className="text-slate-600">Mediaan V: {g.mediaanV > 0 ? fmt(g.mediaanV) : '\u2014'}</p>
                        <p className="text-slate-600">Abs. verschil: {fmt(g.absLoonkloof)}/maand</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 mb-1">Anci\u00ebnniteitsverklaring</p>
                        <p className="text-slate-600">
                          ~{g.ancienniteitVerklaring.toFixed(0)}% van het loonverschil is mogelijk
                          verklaard door verschil in gemiddelde anci\u00ebnniteit.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 mb-1">Samenstelling</p>
                        <p className="text-slate-600">Totaal: {g.employees.length} medewerkers</p>
                        <p className="text-slate-600">M: {g.aantalM} \u00b7 V: {g.aantalV} \u00b7 X: {g.employees.filter(e => e.geslacht === 'X').length}</p>
                        {g.status === 'onvoldoende_data' && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-amber-700">
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
