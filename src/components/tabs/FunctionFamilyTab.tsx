'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FunctionGroup } from '@/lib/types';

const GROEPERING_TOELICHTING =
  'Automatisch op basis van trefwoorden in functietitel (bijv. "admin", "sales", "it"). Criteria: vergelijkbare taken, verantwoordelijkheid en competentievereisten conform Art. 4 EU Richtlijn 2023/970.';

interface FunctionFamilyTabProps {
  groups: FunctionGroup[];
}

function StatusBadge({ status }: { status: FunctionGroup['status'] }) {
  if (status === 'conform') {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50">
        Conform &lt;5%
      </Badge>
    );
  }
  if (status === 'actie_vereist') {
    return (
      <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-50">
        Actie Vereist &gt;5%
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50">
      Onvoldoende Data
    </Badge>
  );
}

function fmt(n: number) {
  return `\u20ac${n.toLocaleString('nl-BE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function FunctionFamilyTab({ groups }: FunctionFamilyTabProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-3 font-semibold text-slate-600 w-6"></th>
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Functiegroep</th>
            <th className="text-center py-3 px-3 font-semibold text-slate-600">#M</th>
            <th className="text-center py-3 px-3 font-semibold text-slate-600">#V</th>
            <th className="text-right py-3 px-3 font-semibold text-slate-600">Gem. M</th>
            <th className="text-right py-3 px-3 font-semibold text-slate-600">Gem. V</th>
            <th className="text-right py-3 px-3 font-semibold text-slate-600">Kloof %</th>
            <th className="text-left py-3 px-3 font-semibold text-slate-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <>
              <tr
                key={g.naam}
                className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setExpanded(expanded === g.naam ? null : g.naam)}
              >
                <td className="py-3 px-3 text-slate-400">
                  {expanded === g.naam ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </td>
                <td className="py-3 px-3 font-medium text-[#0F172A]">
                  <div className="flex items-center gap-1.5">
                    {g.naam}
                    <div className="relative">
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600"
                        onMouseEnter={(e) => { e.stopPropagation(); setTooltip(g.naam); }}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Info over groeperingslogica"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      {tooltip === g.naam && (
                        <div className="absolute z-20 left-6 top-0 w-64 bg-slate-800 text-white text-xs rounded-lg p-2.5 shadow-lg leading-relaxed">
                          <strong className="block mb-1">Groeperingslogica (Art. 4)</strong>
                          {GROEPERING_TOELICHTING}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
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
                        <p className="font-semibold text-slate-700 mb-1 flex items-center gap-1">
                          Anciënniteitsverklaring
                          <span className="relative group cursor-pointer">
                            <Info className="w-3 h-3 text-slate-400" />
                            <span className="absolute z-20 left-5 top-0 w-56 bg-slate-800 text-white text-xs rounded p-2 hidden group-hover:block leading-relaxed">
                              Berekend als: (verschil gemiddelde anciënniteit × €150/jaar) / absoluut loonverschil. €150/jaar is een indicatieve waarde per anciënniteitsjaar.
                            </span>
                          </span>
                        </p>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${Math.min(100, g.ancienniteitVerklaring)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-blue-700">
                            ~{g.ancienniteitVerklaring.toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs">
                          van het loonverschil mogelijk verklaard door anciënniteit
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
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
