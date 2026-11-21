# KMO Loonkloof- & Transparantie Auditor

Belgische KMO Loonkloof- & Transparantie Auditor — klaar voor de EU-Richtlijn Loontransparantie (2027) in 2 minuten.

## Functies

- Upload geanonimiseerde loonlijst (Excel/CSV) of laad demo-data (34 werknemers)
- Automatische functiefamilie-analyse met loonkloofberekening per groep
- Interactieve grafieken (bar + scatter) via Recharts
- Vacaturetekstgenerator conform EU Art. 5 (met loonfork)
- Werknemersinformatiedocument conform EU Art. 7
- PDF-rapport export via jsPDF
- OpenAI gpt-4o-mini integratie (optioneel, met keyword-fallback)

## Lokaal draaien

```bash
npm install
cp .env.local.example .env.local  # optioneel: voeg OPENAI_API_KEY toe
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- xlsx (SheetJS), recharts, jspdf, jspdf-autotable, lucide-react
- OpenAI API (gpt-4o-mini) via `/api/analyze-roles`
