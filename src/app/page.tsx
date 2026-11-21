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
    </main>
  );
}
