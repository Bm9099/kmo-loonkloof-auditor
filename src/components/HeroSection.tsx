'use client';

import { Shield, Clock, FileCheck } from 'lucide-react';

const badges = [
  { icon: Shield, text: 'EU-Richtlijn 2026/1646 compliant' },
  { icon: Clock, text: 'Resultaten in 2 minuten' },
  { icon: FileCheck, text: 'Geen data opgeslagen — 100% client-side' },
];

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background:
            'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 33%, #F0F9FF 66%, #F8FAFC 100%)',
        }}
      />

      {/* Decorative SVG grid overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0F172A" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="relative text-center py-20 px-4">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-blue-200 mb-6">
          <Shield className="w-4 h-4" />
          EU Loontransparantie Richtlijn 2026/1646
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-[#0F172A] mb-5 leading-[1.05]">
          Klaar voor de EU-Richtlijn<br className="hidden sm:block" />
          Loontransparantie{' '}
          <span className="text-[#1E40AF]">in 2 minuten.</span>
        </h1>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload uw geanonimiseerde loonlijst en ontvang direct een volledig loonkloofrapport met
          compliance score, functiefamilie-analyse en juridisch correcte vacatureteksten.
        </p>

        {/* Glassmorphism trust badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {badges.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 backdrop-blur-sm bg-white/70 border border-white/80 shadow-sm rounded-xl px-4 py-2.5 text-sm text-slate-700 font-medium ring-1 ring-slate-900/5"
            >
              <Icon className="w-4 h-4 text-[#1E40AF] shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
