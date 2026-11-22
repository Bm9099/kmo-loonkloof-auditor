'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Lock } from 'lucide-react';
import { KpiCards } from '@/components/KpiCards';
import { FunctionFamilyTab } from '@/components/tabs/FunctionFamilyTab';
import { ChartsTab } from '@/components/tabs/ChartsTab';
import { VacancyGeneratorTab } from '@/components/tabs/VacancyGeneratorTab';
import { EmployeeInfoTab } from '@/components/tabs/EmployeeInfoTab';
import { PdfExport } from '@/components/PdfExport';
import { Employee, AnalysisResult } from '@/lib/types';
import { calculateAnalysis } from '@/lib/payGapCalculations';
import { isPremiumUser } from '@/lib/usageTracking';

interface DashboardProps {
  employees: Employee[];
  onReset: () => void;
}

const TABS = [
  { value: 'functies', label: 'Functiefamilie Analyse', pro: false },
  { value: 'grafieken', label: 'Visuele Grafieken', pro: false },
  { value: 'vacature', label: 'Vacature Generator', pro: true },
  { value: 'werknemer', label: 'Werknemer Informatierecht', pro: true },
];

function UnlockBanner() {
  return (
    <div
      className="rounded-xl border p-6 text-center"
      style={{ background: 'rgba(13,148,136,0.06)', borderColor: 'rgba(13,148,136,0.2)' }}
    >
      <Lock className="w-8 h-8 text-teal-400 mx-auto mb-3" />
      <p className="text-white font-semibold mb-1">Beschikbaar in Starter &amp; Professioneel</p>
      <p className="text-white/50 text-sm mb-4">Upgrade om toegang te krijgen tot deze functie.</p>
      <Link
        href="/prijzen"
        className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
      >
        Bekijk abonnementen
      </Link>
    </div>
  );
}

export function Dashboard({ employees, onReset }: DashboardProps) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('functies');
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const analysis = calculateAnalysis(employees);
    setResult(analysis);
    setPremium(isPremiumUser());
  }, [employees]);

  if (!result) return null;

  const isProTab = TABS.find((t) => t.value === activeTab)?.pro ?? false;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 border-b" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Loonkloof Analyse</h2>
            <p className="text-sm text-white/40">{employees.length} werknemers geanalyseerd</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/prijzen"
              className="text-white/60 hover:text-white text-sm transition-colors hidden sm:block"
            >
              Prijzen
            </Link>
            {!premium && (
              <Link
                href="/prijzen"
                className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                Upgrade
              </Link>
            )}
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium text-white/70 hover:text-white transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}
              onClick={onReset}
            >
              <RefreshCw className="w-4 h-4" />
              Nieuw bestand
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 pb-16">
        <KpiCards result={result} />

        <div className="rounded-2xl border overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex gap-1 px-6 pt-4 overflow-x-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`flex-shrink-0 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.value
                    ? 'bg-[#0D9488] text-white'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
                {tab.pro && (
                  <span className="bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6 animate-fade-in">
            {activeTab === 'functies' && <FunctionFamilyTab groups={result.functieGroepen} />}
            {activeTab === 'grafieken' && <ChartsTab groups={result.functieGroepen} employees={employees} />}
            {activeTab === 'vacature' && (premium ? <VacancyGeneratorTab groups={result.functieGroepen} /> : <UnlockBanner />)}
            {activeTab === 'werknemer' && (premium ? <EmployeeInfoTab employees={employees} groups={result.functieGroepen} /> : <UnlockBanner />)}
          </div>
        </div>

        <div className="mt-6">
          <PdfExport result={result} />
        </div>
      </div>
    </div>
  );
}
