import Link from 'next/link';
import { Check, Key, Minus, Mail } from 'lucide-react';

const plans = [
  {
    name: 'Gratis',
    price: '€0',
    period: '',
    sub: '1 analyse per maand',
    recommended: false,
    features: ['1 analyse/maand', 'Basis loonkloofrapport', 'Compliance score', 'Functiefamilie-analyse'],
    cta: 'Begin gratis',
    href: '/',
    stripePriceId: null,
  },
  {
    name: 'Starter',
    price: '€99',
    period: '/jaar',
    sub: '€9/maand',
    recommended: false,
    features: ['Onbeperkte analyses', 'PDF compliance-rapport', 'Excel sjabloon download', 'Compliance score', 'Functiefamilie-analyse'],
    cta: 'Kies Starter',
    href: null,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID ?? null,
  },
  {
    name: 'Professioneel',
    price: '€199',
    period: '/jaar',
    sub: '€17/maand',
    recommended: true,
    apiKeyNotice: 'Vereist eigen OpenAI API-sleutel (gratis aan te maken op platform.openai.com)',
    features: ['Onbeperkte analyses', 'PDF compliance-rapport', 'Excel sjabloon download', 'AI vacatureteksten', 'Word-export', 'Eigen API-sleutel', 'Prioriteitsondersteuning'],
    cta: 'Kies Professioneel',
    href: null,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? null,
  },
  {
    name: 'Bureau',
    price: '€599',
    period: '/jaar',
    sub: 'Voor accountants & HR-adviseurs',
    recommended: false,
    features: ['Alles in Professioneel', 'Meerdere klanten', 'Wit-label rapporten', 'Prioriteitsondersteuning', 'Dedicated onboarding'],
    cta: 'Contacteer ons',
    href: 'mailto:info@loonkloof.be',
    stripePriceId: null,
  },
];

const comparisonFeatures = [
  { label: 'Analyses per maand', gratis: '1', starter: 'Onbeperkt', pro: 'Onbeperkt' },
  { label: 'Loonkloofrapport', gratis: true, starter: true, pro: true },
  { label: 'Compliance score', gratis: true, starter: true, pro: true },
  { label: 'PDF-export', gratis: false, starter: true, pro: true },
  { label: 'Excel sjabloon', gratis: false, starter: true, pro: true },
  { label: 'AI vacatureteksten', gratis: false, starter: false, pro: true },
  { label: 'Word-export', gratis: false, starter: false, pro: true },
  { label: 'Prioriteitsondersteuning', gratis: false, starter: false, pro: true },
];

const faqs = [
  {
    q: 'Hoe werkt de gratis versie?',
    a: 'U kunt elke maand één volledige loonkloofanalyse uitvoeren zonder enige betaling. Na gebruik van die analyse wordt u gevraagd te upgraden voor aanvullende analyses.',
  },
  {
    q: 'Is mijn data veilig?',
    a: 'Absoluut. Alle verwerking gebeurt volledig client-side in uw browser. Geen enkele loondata verlaat uw computer — er wordt niets opgeslagen op onze servers. 100% GDPR-conform.',
  },
  {
    q: 'Kan ik op elk moment opzeggen?',
    a: 'Ja. Uw abonnement is jaarlijks en wordt niet automatisch verlengd zonder expliciete bevestiging. Neem contact op via het contactformulier voor annulering.',
  },
];

function StripeButton({ plan }: { plan: typeof plans[0] }) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const isBureau = plan.name === 'Bureau';

  if (plan.href) {
    return (
      <Link
        href={plan.href}
        className={`block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          isBureau
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'border border-white/10 text-white hover:bg-white/5'
        }`}
      >
        {plan.cta}
      </Link>
    );
  }

  if (!publishableKey) {
    return (
      <div className="w-full text-center px-4 py-2.5 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 text-xs">
        Stripe configuratie vereist — zie .env.local.example
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled
      className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
        plan.recommended
          ? 'bg-teal-500 hover:bg-teal-600 text-white'
          : 'border border-white/10 text-white hover:bg-white/5'
      }`}
    >
      {plan.cta}
    </button>
  );
}

function FeatureCell({ value }: { value: string | boolean }) {
  if (typeof value === 'string') {
    return <span className="text-sm text-white/70">{value}</span>;
  }
  return value ? (
    <Check className="w-4 h-4 text-teal-400 mx-auto" />
  ) : (
    <Minus className="w-4 h-4 text-white/20 mx-auto" />
  );
}

export default function PrijzenPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
      {/* Nav */}
      <nav className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            Loonkloof Auditor
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/prijzen" className="text-teal-400 text-sm font-medium">
              Prijzen
            </Link>
            <Link
              href="/"
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Start gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div
        className="py-24 px-6 text-center"
        style={{
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(13,148,136,0.2), transparent)',
        }}
      >
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-3 py-1 text-xs text-teal-400 mb-6">
          Eenvoudig & transparant
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter mb-4">
          Transparante prijzen.
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Geen verrassingen.
          </span>
        </h1>
        <p className="text-white/50 max-w-lg mx-auto text-lg">
          Begin gratis en schaal op wanneer u klaar bent.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isBureau = plan.name === 'Bureau';
            return (
            <div
              key={plan.name}
              className="rounded-2xl border p-8 flex flex-col"
              style={{
                background: plan.recommended
                  ? 'rgba(13,148,136,0.08)'
                  : isBureau
                    ? 'rgba(79,70,229,0.08)'
                    : 'rgba(255,255,255,0.03)',
                borderColor: plan.recommended
                  ? 'rgba(13,148,136,0.4)'
                  : isBureau
                    ? 'rgba(79,70,229,0.4)'
                    : 'rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">{plan.name}</p>
                  <p className="text-4xl font-black text-white">
                    {plan.price}
                    <span className="text-base font-normal text-white/40">{plan.period}</span>
                  </p>
                  <p className="text-xs text-white/30 mt-1">{plan.sub}</p>
                  {'apiKeyNotice' in plan && plan.apiKeyNotice && (
                    <div className="flex items-start gap-1.5 mt-2">
                      <Key className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-300/70 leading-snug">{plan.apiKeyNotice as string}</p>
                    </div>
                  )}
                </div>
                {plan.recommended && (
                  <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                    AANBEVOLEN
                  </span>
                )}
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <Check className="w-4 h-4 text-teal-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <StripeButton plan={plan} />
            </div>
          );})}
        </div>

        {/* Enterprise */}
        <div
          className="mt-6 rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div>
            <p className="text-white font-semibold">Enterprise</p>
            <p className="text-white/50 text-sm">Onbeperkte seats, SLA, dedicated onboarding, facturatie op maat.</p>
          </div>
          <a
            href="mailto:info@loonkloofauditor.be"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contacteer ons
          </a>
        </div>

        {/* Feature comparison */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Volledige vergelijking</h2>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/50">Functie</th>
                  <th className="text-center px-4 py-4 text-sm font-semibold text-white/50">Gratis</th>
                  <th className="text-center px-4 py-4 text-sm font-semibold text-white/50">Starter</th>
                  <th className="text-center px-4 py-4 text-sm font-semibold text-teal-400">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr
                    key={row.label}
                    style={{
                      borderBottom: i < comparisonFeatures.length - 1 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                    }}
                  >
                    <td className="px-6 py-3.5 text-sm text-white/70">{row.label}</td>
                    <td className="px-4 py-3.5 text-center"><FeatureCell value={row.gratis} /></td>
                    <td className="px-4 py-3.5 text-center"><FeatureCell value={row.starter} /></td>
                    <td className="px-4 py-3.5 text-center"><FeatureCell value={row.pro} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Veelgestelde vragen</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border p-6"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <p className="text-white font-semibold mb-2">{faq.q}</p>
                <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="mt-20 rounded-2xl border p-10 text-center"
          style={{
            background: 'rgba(13,148,136,0.06)',
            borderColor: 'rgba(13,148,136,0.2)',
          }}
        >
          <p className="text-white font-semibold text-lg mb-2">Nood aan een offerte voor uw team?</p>
          <p className="text-white/50 text-sm mb-6">
            Wij bieden maatwerk voor organisaties met meerdere gebruikers of specifieke compliance-vereisten.
          </p>
          <a
            href="mailto:info@loonkloofauditor.be"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contacteer ons
          </a>
        </div>
      </div>

      <footer
        className="border-t text-white/30 py-10 text-center text-xs"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        Belgische KMO Loonkloof-Auditor &middot; Conform EU-Richtlijn 2023/970 &middot; 100% GDPR-veilig
      </footer>
    </div>
  );
}
