'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { UploadZone } from '@/components/UploadZone';
import { Dashboard } from '@/components/Dashboard';
import { Employee } from '@/lib/types';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400">
        <span>Conform EU-Richtlijn 2023/970 · Art. 7 &amp; 9</span>
        <span className="hidden sm:inline">·</span>
        <span>100% GDPR-veilig</span>
        <span className="hidden sm:inline">·</span>
        <span>Geen data wordt opgeslagen</span>
      </div>
    </footer>
  );
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[] | null>(null);

  if (employees) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Dashboard employees={employees} onReset={() => setEmployees(null)} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
        <UploadZone onDataLoaded={setEmployees} />
      </main>
      <Footer />
    </div>
  );
}
