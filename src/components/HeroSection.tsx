'use client';

import { Check } from 'lucide-react';

const badges = [
  'EU-Richtlijn 2023/970 compliant',
  'Resultaten in 2 minuten',
  'Geen data opgeslagen — 100% client-side',
];

export function HeroSection() {
  return (
    <div
      className="min-h-[75vh] flex flex-col justify-center items-center text-center px-6 py-24"
      style={{
        backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(13, 148, 136, 0.15), transparent)',
      }}
    >
      <div className="bg-white/10 text-white/70 border border-white/10 rounded-full px-3 py-1 text-xs mb-8 inline-block">
        EU-Richtlijn 2023/970 · Belgische KMO&apos;s
      </div>

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-6">
        <span
          className="block text-gradient"
          style={{
            background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Klaar voor de EU
        </span>
        <span className="text-white block">Loontransparantie?</span>
      </h1>

      <p className="text-slate-300 text-lg max-w-xl mb-10">
        Upload uw geanonimiseerde loonlijst en ontvang direct een volledig loonkloofrapport met
        compliance score, functiefamilie-analyse en juridisch correcte vacatureteksten.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {badges.map((text) => (
          <div
            key={text}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-300 border border-white/10"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
