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
    <div className="bg-slate-50 min-h-screen">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">Loonkloof Analyse</h2>
            <p className="text-sm text-slate-500">{employees.length} werknemers geanalyseerd</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors shadow-sm"
            onClick={onReset}
          >
            <RefreshCw className="w-4 h-4" />
            Nieuw bestand
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 pb-16">
        <KpiCards result={result} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-100 px-6 pt-4 flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`flex-shrink-0 px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.value
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
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
