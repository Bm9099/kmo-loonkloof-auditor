'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { KpiCards } from '@/components/KpiCards';
import { FunctionFamilyTab } from '@/components/tabs/FunctionFamilyTab';
import { ChartsTab } from '@/components/tabs/ChartsTab';
import { VacancyGeneratorTab } from '@/components/tabs/VacancyGeneratorTab';
import { EmployeeInfoTab } from '@/components/tabs/EmployeeInfoTab';
import { PdfExport } from '@/components/PdfExport';
import { Employee, AnalysisResult } from '@/lib/types';
import { calculateAnalysis } from '@/lib/payGapCalculations';

interface DashboardProps {
  employees: Employee[];
  onReset: () => void;
}

const TABS = [
  { value: 'functies', label: 'Functiefamilie Analyse' },
  { value: 'grafieken', label: 'Visuele Grafieken' },
  { value: 'vacature', label: 'Vacature Generator' },
  { value: 'werknemer', label: 'Werknemer Informatierecht' },
];

export function Dashboard({ employees, onReset }: DashboardProps) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('functies');

  useEffect(() => {
    const analysis = calculateAnalysis(employees);
    setResult(analysis);
  }, [employees]);

  if (!result) return null;

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <div className="sticky top-0 z-10 backdrop-blur-md border-b" style={{ background: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Loonkloof Analyse</h2>
            <p className="text-sm text-white/40">{employees.length} werknemers geanalyseerd</p>
          </div>
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

      <div className="max-w-6xl mx-auto px-4 py-8 pb-16">
        <KpiCards result={result} />

        <div className="rounded-2xl border overflow-hidden" style={{ background: '#111111', borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex gap-1 px-6 pt-4 overflow-x-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`flex-shrink-0 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.value
                    ? 'bg-[#0D9488] text-white'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 animate-fade-in">
            {activeTab === 'functies' && <FunctionFamilyTab groups={result.functieGroepen} />}
            {activeTab === 'grafieken' && <ChartsTab groups={result.functieGroepen} employees={employees} />}
            {activeTab === 'vacature' && <VacancyGeneratorTab groups={result.functieGroepen} />}
            {activeTab === 'werknemer' && <EmployeeInfoTab employees={employees} groups={result.functieGroepen} />}
          </div>
        </div>

        <div className="mt-6">
          <PdfExport result={result} />
        </div>
      </div>
    </div>
  );
}
