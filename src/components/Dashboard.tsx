'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export function Dashboard({ employees, onReset }: DashboardProps) {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const analysis = calculateAnalysis(employees);
    setResult(analysis);
  }, [employees]);

  if (!result) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Loonkloof Analyse</h2>
          <p className="text-sm text-slate-500">{employees.length} werknemers geanalyseerd</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={onReset}>
          <RefreshCw className="w-4 h-4" />
          Nieuw bestand
        </Button>
      </div>

      <KpiCards result={result} />

      <Tabs defaultValue="functies" className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <TabsList className="w-full border-b border-slate-200 rounded-t-xl rounded-b-none bg-slate-50 p-0 h-auto">
          <div className="flex overflow-x-auto">
            {[
              { value: 'functies', label: 'Functiefamilie Analyse' },
              { value: 'grafieken', label: 'Visuele Grafieken' },
              { value: 'vacature', label: 'Vacature Generator' },
              { value: 'werknemer', label: 'Werknemer Informatierecht' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-shrink-0 px-5 py-3.5 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-[#1E40AF] data-[state=active]:bg-white data-[state=active]:text-[#1E40AF] text-slate-500 transition-all"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </div>
        </TabsList>

        <TabsContent value="functies" className="p-6 mt-0">
          <FunctionFamilyTab groups={result.functieGroepen} />
        </TabsContent>
        <TabsContent value="grafieken" className="p-6 mt-0">
          <ChartsTab groups={result.functieGroepen} employees={employees} />
        </TabsContent>
        <TabsContent value="vacature" className="p-6 mt-0">
          <VacancyGeneratorTab groups={result.functieGroepen} />
        </TabsContent>
        <TabsContent value="werknemer" className="p-6 mt-0">
          <EmployeeInfoTab employees={employees} groups={result.functieGroepen} />
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <PdfExport result={result} />
      </div>
    </div>
  );
}
