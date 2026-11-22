'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/HeroSection';
import { UploadZone } from '@/components/UploadZone';
import { Dashboard } from '@/components/Dashboard';
import { PaywallModal } from '@/components/PaywallModal';
import { Employee } from '@/lib/types';
import {
  incrementUsage,
  hasReachedFreeLimit,
  isPremiumUser,
  resetUsageIfNewMonth,
} from '@/lib/usageTracking';

export default function Home() {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    resetUsageIfNewMonth();
  }, []);

  function handleDataLoaded(data: Employee[]) {
    incrementUsage();
    if (hasReachedFreeLimit() && !isPremiumUser()) {
      setShowPaywall(true);
      return;
    }
    setEmployees(data);
  }

  if (employees) {
    return (
      <>
        <Dashboard employees={employees} onReset={() => setEmployees(null)} />
        {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
      </>
    );
  }

  return (
    <main>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      {/* Top nav with Prijzen link */}
      <div
        className="sticky top-0 z-10 backdrop-blur-md border-b"
        style={{ background: 'rgba(9,9,11,0.85)', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-white font-bold text-lg">Loonkloof Auditor</span>
          <div className="flex items-center gap-4">
            <Link href="/prijzen" className="text-white/60 hover:text-white text-sm transition-colors">
              Prijzen
            </Link>
            <Link
              href="/prijzen"
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </div>

      <HeroSection />
      <UploadZone onDataLoaded={handleDataLoaded} />
      <footer className="text-white/40 py-12 text-center text-sm">
        Belgische KMO Loonkloof-Auditor &middot; Conform EU-Richtlijn 2023/970 &middot; 100% GDPR-veilig &middot; Geen data wordt opgeslagen
      </footer>
    </main>
  );
}
