'use client';

import { Shield, Clock, FileCheck } from 'lucide-react';

const badges = [
  { icon: Shield, text: 'EU-Richtlijn 2026/1646 compliant' },
  { icon: Clock, text: 'Resultaten in 2 minuten' },
  { icon: FileCheck, text: 'Geen data opgeslagen \u2014 100% client-side' },
];

export function HeroSection() {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-200 mb-6">
        <Shield className="w-4 h-4" />
        EU Loontransparantie Richtlijn 2026/1646
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] mb-4 leading-tight">
        Klaar voor de EU-Richtlijn<br className="hidden sm:block" /> Loontransparantie (2027){' '}
        <span className="text-[#1E40AF]">in 2 minuten.</span>
      </h1>
      <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
        Upload uw geanonimiseerde loonlijst en ontvang direct een volledig loonkloofrapport met
        compliance score, functiefamilie-analyse en juridisch correcte vacatureteksten.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {badges.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2.5 shadow-sm text-sm text-slate-600"
          >
            <Icon className="w-4 h-4 text-[#1E40AF] shrink-0" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
