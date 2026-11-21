'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { UploadZone } from '@/components/UploadZone';
import { Dashboard } from '@/components/Dashboard';
import { Employee } from '@/lib/types';

export default function Home() {
  const [employees, setEmployees] = useState<Employee[] | null>(null);

  if (employees) {
    return <Dashboard employees={employees} onReset={() => setEmployees(null)} />;
  }

  return (
    <main>
      <HeroSection />
      <UploadZone onDataLoaded={setEmployees} />
      <footer className="bg-[#09090B] text-white/40 py-12 text-center text-sm">
        Belgische KMO Loonkloof-Auditor &middot; Conform EU-Richtlijn 2023/970 &middot; 100% GDPR-veilig &middot; Geen data wordt opgeslagen
      </footer>
    </main>
  );
}
