/**
 * @deprecated This server-side OpenAI proxy is deprecated and will be removed in a future release.
 * AI features now call the OpenAI API directly from the browser using a user-supplied API key
 * stored in localStorage. This route is kept temporarily as a keyword-based fallback only.
 */
import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  functietitels: string[];
  mode?: 'grouping' | 'vacancy' | 'employee_info';
  functieGroep?: string;
  loonfork?: { min: number; max: number };
  werknemer?: { id: string; functieGroep: string; gemiddeldLoon: number };
}

interface GroupingResponse {
  groepen: { naam: string; titels: string[] }[];
}

function keywordGrouping(titels: string[]): GroupingResponse {
  const families: Record<string, string[]> = {
    'Admin & Secretariaat': [],
    'Accountmanagement & Sales': [],
    'IT & Systemen': [],
    'Operations & Management': [],
    'HR & People': [],
    'Finance & Boekhouding': [],
    'Overige': [],
  };

  const keywords: Record<string, string[]> = {
    'Admin & Secretariaat': ['admin', 'office', 'binnendienst', 'secretar', 'assistante', 'receptie'],
    'Accountmanagement & Sales': ['account', 'sales', 'verkoop', 'commerci'],
    'IT & Systemen': ['it ', 'it-', 'developer', 'systeem', 'software', 'data', 'infra'],
    'Operations & Management': ['teamlead', 'manager', 'directeur', 'operations', 'coordinator'],
    'HR & People': ['hr', 'human', 'personeel', 'rekrutering', 'talent'],
    'Finance & Boekhouding': ['boekhouder', 'boekhoud', 'finance', 'financieel', 'accountant'],
  };

  titels.forEach((titel) => {
    const lower = titel.toLowerCase();
    let assigned = false;
    for (const [family, kws] of Object.entries(keywords)) {
      if (kws.some((kw) => lower.includes(kw))) {
        families[family].push(titel);
        assigned = true;
        break;
      }
    }
    if (!assigned) families['Overige'].push(titel);
  });

  return {
    groepen: Object.entries(families)
      .filter(([, titels]) => titels.length > 0)
      .map(([naam, titels]) => ({ naam, titels })),
  };
}

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json();
  const { functietitels, mode = 'grouping', functieGroep, loonfork, werknemer } = body;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    if (mode === 'grouping') {
      return NextResponse.json(keywordGrouping(functietitels));
    }
    if (mode === 'vacancy') {
      const min = loonfork?.min ?? 3000;
      const max = loonfork?.max ?? 4500;
      const text = generateVacancyFallback(functieGroep ?? 'Medewerker', min, max);
      return NextResponse.json({ vacaturetekst: text });
    }
    if (mode === 'employee_info') {
      const text = generateEmployeeInfoFallback(werknemer);
      return NextResponse.json({ antwoorddocument: text });
    }
    return NextResponse.json(keywordGrouping(functietitels));
  }

  try {
    if (mode === 'grouping') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'Je bent een Belgische HR-expert. Groepeer de gegeven functietitels in logische functiefamilies voor een KMO. Geef terug als JSON: { "groepen": [{ "naam": string, "titels": string[] }] }',
            },
            {
              role: 'user',
              content: `Groepeer deze functietitels: ${functietitels.join(', ')}`,
            },
          ],
        }),
      });
      const data = await response.json() as { choices: { message: { content: string } }[] };
      const parsed = JSON.parse(data.choices[0].message.content) as GroupingResponse;
      return NextResponse.json(parsed);
    }

    if (mode === 'vacancy') {
      const min = loonfork?.min ?? 3000;
      const max = loonfork?.max ?? 4500;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'Schrijf een genderneutrale Belgische vacaturetekst conform EU-richtlijn loontransparantie 2026/1646. Verplicht: vermeld de loonfork. Taal: Nederlands. JSON: { "vacaturetekst": string }',
            },
            {
              role: 'user',
              content: `Functiegroep: ${functieGroep}. Loonfork: €${min} \u2013 €${max} bruto/maand. Paritair Comité 200.`,
            },
          ],
        }),
      });
      const data = await response.json() as { choices: { message: { content: string } }[] };
      const parsed = JSON.parse(data.choices[0].message.content) as { vacaturetekst: string };
      return NextResponse.json(parsed);
    }

    if (mode === 'employee_info') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'Schrijf een officieel antwoorddocument voor een werknemer die zijn/haar recht op looninformatie uitoefent (EU-richtlijn 2026/1646, Art. 7). Formeel Nederlands. JSON: { "antwoorddocument": string }',
            },
            {
              role: 'user',
              content: `Werknemer ID: ${werknemer?.id}. Functiegroep: ${werknemer?.functieGroep}. Gemiddeld loon van de groep: \u20ac${werknemer?.gemiddeldLoon}`,
            },
          ],
        }),
      });
      const data = await response.json() as { choices: { message: { content: string } }[] };
      const parsed = JSON.parse(data.choices[0].message.content) as { antwoorddocument: string };
      return NextResponse.json(parsed);
    }

    return NextResponse.json(keywordGrouping(functietitels));
  } catch {
    if (mode === 'vacancy') {
      return NextResponse.json({ vacaturetekst: generateVacancyFallback(functieGroep ?? 'Medewerker', loonfork?.min ?? 3000, loonfork?.max ?? 4500) });
    }
    if (mode === 'employee_info') {
      return NextResponse.json({ antwoorddocument: generateEmployeeInfoFallback(werknemer) });
    }
    return NextResponse.json(keywordGrouping(functietitels));
  }
}

function generateVacancyFallback(groep: string, min: number, max: number): string {
  return `**Vacature: ${groep}**

Wij zijn op zoek naar een gemotiveerde medewerker voor onze afdeling ${groep}.

**Over de functie**
In deze rol draag je bij aan de dagelijkse werking van ons team. Je werkt nauw samen met collega's en rapporteert aan de teamleider.

**Jouw profiel**
- Relevante opleiding of gelijkwaardige ervaring
- Sterke communicatievaardigheden in Nederlands
- Teamspeler met aandacht voor detail

**Wat bieden wij?**
- Bruto maandloon: \u20ac${min.toLocaleString('nl-BE')} \u2013 \u20ac${max.toLocaleString('nl-BE')} (conform PC 200)
- Extralegale voordelen
- Flexibele werkuren en thuiswerkmogelijkheden
- Opleidingskansen

*Conform EU-richtlijn loontransparantie 2026/1646 publiceren wij steeds de loonfork bij onze vacatures.*`;
}

function generateEmployeeInfoFallback(werknemer?: { id: string; functieGroep: string; gemiddeldLoon: number }): string {
  const datum = new Date().toLocaleDateString('nl-BE');
  return `**OFFICIEEL ANTWOORDDOCUMENT**
Datum: ${datum}

Betreft: Uitoefening recht op looninformatie (EU-richtlijn 2026/1646, Art. 7)

Geachte medewerker (ID: ${werknemer?.id ?? 'XXXX'}),

In antwoord op uw verzoek tot looninformatie bevestigen wij het volgende:

**Uw functiegroep:** ${werknemer?.functieGroep ?? 'Onbekend'}

**Gemiddeld bruto maandloon van uw functiegroep:** \u20ac${(werknemer?.gemiddeldLoon ?? 0).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}

Dit gemiddelde is berekend op basis van alle medewerkers in dezelfde functiegroep binnen onze organisatie, conform de methodologie vereist door de Europese Richtlijn 2026/1646 betreffende loontransparantie.

**Juridische mededeling:** Alle persoonsgegevens worden verwerkt conform de AVG/GDPR. Dit document mag niet worden verspreid.

Met vriendelijke groeten,
HR-afdeling`;
}
