'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import Link from 'next/link';
import { setPremiumToken } from '@/lib/usageTracking';

const TEST_CODE = 'TESTPRO2024';

interface PaywallModalProps {
  onClose: () => void;
}

const starterFeatures = [
  'Onbeperkte analyses',
  'PDF compliance-rapport',
  'Excel sjabloon download',
];

const proFeatures = [
  'Alles van Starter',
  'AI vacatureteksten',
  'Word-export',
  'Prioriteitsondersteuning',
];

export function PaywallModal({ onClose }: PaywallModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleActivate() {
    if (code.trim().toUpperCase() === TEST_CODE) {
      setPremiumToken('test_pro_2024');
      setError('');
      setSuccess(true);
      setTimeout(onClose, 1500);
    } else {
      setError('Ongeldige testcode');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl rounded-2xl border p-8 shadow-2xl"
        style={{ background: '#111111', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1 text-xs text-teal-400 mb-4">
            Gratis limiet bereikt
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Uw gratis analyse is gebruikt</h2>
          <p className="text-white/50 max-w-md mx-auto text-sm">
            Upgrade voor onbeperkte analyses, PDF-rapporten en AI-vacatureteksten.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Starter */}
          <div
            className="rounded-2xl border p-6 flex flex-col"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="mb-4">
              <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-1">Starter</p>
              <p className="text-3xl font-black text-white">€249<span className="text-base font-normal text-white/40">/jaar</span></p>
              <p className="text-xs text-white/30 mt-0.5">€20.75/maand</p>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {starterFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/prijzen"
              className="block w-full text-center px-4 py-2.5 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Kies Starter
            </Link>
          </div>

          {/* Professioneel */}
          <div
            className="rounded-2xl border p-6 flex flex-col"
            style={{ background: 'rgba(13,148,136,0.08)', borderColor: 'rgba(13,148,136,0.4)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-1">Professioneel</p>
                <p className="text-3xl font-black text-white">€399<span className="text-base font-normal text-white/40">/jaar</span></p>
                <p className="text-xs text-white/30 mt-0.5">€33.25/maand</p>
              </div>
              <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 mt-0.5">
                AANGERADEN
              </span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-teal-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/prijzen"
              className="block w-full text-center px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors"
            >
              Kies Professioneel
            </Link>
          </div>
        </div>

        <div className="mt-4 mb-2 border-t border-white/5 pt-4">
          <p className="text-xs text-white/30 mb-2">Testcode</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
              placeholder="Voer testcode in"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/60 placeholder-white/20 focus:outline-none focus:border-white/20"
            />
            <button
              type="button"
              onClick={handleActivate}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white/70 hover:bg-white/5 transition-colors"
            >
              Activeer
            </button>
          </div>
          {error && <p className="text-xs text-red-400/70 mt-1">{error}</p>}
          {success && <p className="text-xs text-teal-400 mt-1">Pro-toegang geactiveerd</p>}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            Misschien later
          </button>
        </div>
      </div>
    </div>
  );
}
