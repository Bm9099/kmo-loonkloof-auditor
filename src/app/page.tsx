'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
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
  const [menuOpen, setMenuOpen] = useState(false);

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
            {/* Desktop nav */}
            <Link href="/prijzen" className="text-white/60 hover:text-white text-sm transition-colors hidden sm:block">
              Prijzen
            </Link>
            <Link
              href="/prijzen"
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors hidden sm:block"
            >
              Upgrade
            </Link>
            {/* Mobile hamburger */}
            <button
              type="button"
              className="sm:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="sm:hidden px-4 pb-4 flex flex-col gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <Link
              href="/prijzen"
              className="text-white/60 hover:text-white text-sm py-2 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Prijzen
            </Link>
            <Link
              href="/prijzen"
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors text-center"
              onClick={() => setMenuOpen(false)}
            >
              Upgrade
            </Link>
          </div>
        )}
      </div>

      <HeroSection />
      <UploadZone onDataLoaded={handleDataLoaded} />
      <footer className="text-white/40 py-12 text-center text-sm">
        Belgische KMO Loonkloof-Auditor &middot; Conform EU-Richtlijn 2023/970 &middot; 100% GDPR-veilig &middot; Geen data wordt opgeslagen
      </footer>
    </main>
  );
}
