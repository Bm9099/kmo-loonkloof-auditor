'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const TAB_ITEMS = [
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
    <div>
      {/* Sticky header */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-[#0F172A]">Loonkloof Analyse</span>
            <span className="ml-2 text-sm text-slate-400">{employees.length} werknemers</span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#1E40AF] transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            <RefreshCw className="w-4 h-4" />
            Nieuw bestand
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-16">
        <KpiCards result={result} />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden"
        >
          {/* Pill tabs */}
          <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3">
            <TabsList className="bg-transparent h-auto w-auto gap-1 p-0">
              {TAB_ITEMS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="px-4 py-2 text-sm font-medium rounded-full border-0 transition-all
                    text-slate-500 hover:text-slate-800 hover:bg-white
                    data-[state=active]:bg-[#1E40AF] data-[state=active]:text-white data-[state=active]:shadow-sm
                    after:hidden"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="functies" className="p-6 mt-0 animate-fade-in">
            <FunctionFamilyTab groups={result.functieGroepen} />
          </TabsContent>
          <TabsContent value="grafieken" className="p-6 mt-0 animate-fade-in">
            <ChartsTab groups={result.functieGroepen} employees={employees} />
          </TabsContent>
          <TabsContent value="vacature" className="p-6 mt-0 animate-fade-in">
            <VacancyGeneratorTab groups={result.functieGroepen} />
          </TabsContent>
          <TabsContent value="werknemer" className="p-6 mt-0 animate-fade-in">
            <EmployeeInfoTab employees={employees} groups={result.functieGroepen} />
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <PdfExport result={result} />
        </div>
      </div>
    </div>
  );
}
