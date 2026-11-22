export interface BaremaEntry {
  pc: string;
  pcNaam: string;
  niveau: string;
  minBrutoMaand: number;
}

export const BAREMAS: BaremaEntry[] = [
  // PC 100 — Aanvullend nationaal paritair comité arbeiders
  { pc: 'PC 100', pcNaam: 'Aanvullend nationaal paritair comité arbeiders', niveau: 'Cat. 1', minBrutoMaand: 1900 },
  { pc: 'PC 100', pcNaam: 'Aanvullend nationaal paritair comité arbeiders', niveau: 'Cat. 2', minBrutoMaand: 2050 },
  { pc: 'PC 100', pcNaam: 'Aanvullend nationaal paritair comité arbeiders', niveau: 'Cat. 3', minBrutoMaand: 2200 },
  { pc: 'PC 100', pcNaam: 'Aanvullend nationaal paritair comité arbeiders', niveau: 'Cat. 4', minBrutoMaand: 2400 },
  { pc: 'PC 100', pcNaam: 'Aanvullend nationaal paritair comité arbeiders', niveau: 'Cat. 5', minBrutoMaand: 2600 },

  // PC 118 — Voedingsnijverheid
  { pc: 'PC 118', pcNaam: 'Voedingsnijverheid', niveau: 'Cat. 1', minBrutoMaand: 1950 },
  { pc: 'PC 118', pcNaam: 'Voedingsnijverheid', niveau: 'Cat. 2', minBrutoMaand: 2100 },
  { pc: 'PC 118', pcNaam: 'Voedingsnijverheid', niveau: 'Cat. 3', minBrutoMaand: 2300 },
  { pc: 'PC 118', pcNaam: 'Voedingsnijverheid', niveau: 'Cat. 4', minBrutoMaand: 2500 },

  // PC 200 — Bedienden (nationaal paritair comité voor de bedienden)
  { pc: 'PC 200', pcNaam: 'Bedienden', niveau: 'Niveau E', minBrutoMaand: 1750 },
  { pc: 'PC 200', pcNaam: 'Bedienden', niveau: 'Niveau D', minBrutoMaand: 2100 },
  { pc: 'PC 200', pcNaam: 'Bedienden', niveau: 'Niveau C', minBrutoMaand: 2550 },
  { pc: 'PC 200', pcNaam: 'Bedienden', niveau: 'Niveau B', minBrutoMaand: 3100 },
  { pc: 'PC 200', pcNaam: 'Bedienden', niveau: 'Niveau A', minBrutoMaand: 3800 },

  // PC 218 — Bewakingsondernemingen
  { pc: 'PC 218', pcNaam: 'Bewakingsondernemingen', niveau: 'Niveau I', minBrutoMaand: 2100 },
  { pc: 'PC 218', pcNaam: 'Bewakingsondernemingen', niveau: 'Niveau II', minBrutoMaand: 2250 },
  { pc: 'PC 218', pcNaam: 'Bewakingsondernemingen', niveau: 'Niveau III', minBrutoMaand: 2400 },
  { pc: 'PC 218', pcNaam: 'Bewakingsondernemingen', niveau: 'Niveau IV', minBrutoMaand: 2600 },

  // PC 302 — Hotel, restaurant en catering
  { pc: 'PC 302', pcNaam: 'Hotel, restaurant en catering', niveau: 'Cat. 1', minBrutoMaand: 1850 },
  { pc: 'PC 302', pcNaam: 'Hotel, restaurant en catering', niveau: 'Cat. 2', minBrutoMaand: 1980 },
  { pc: 'PC 302', pcNaam: 'Hotel, restaurant en catering', niveau: 'Cat. 3', minBrutoMaand: 2100 },
  { pc: 'PC 302', pcNaam: 'Hotel, restaurant en catering', niveau: 'Cat. 4', minBrutoMaand: 2300 },

  // PC 330 — Gezondheidszorg
  { pc: 'PC 330', pcNaam: 'Gezondheidszorg', niveau: 'Niveau 1', minBrutoMaand: 1950 },
  { pc: 'PC 330', pcNaam: 'Gezondheidszorg', niveau: 'Niveau 2', minBrutoMaand: 2200 },
  { pc: 'PC 330', pcNaam: 'Gezondheidszorg', niveau: 'Niveau 3', minBrutoMaand: 2500 },
  { pc: 'PC 330', pcNaam: 'Gezondheidszorg', niveau: 'Niveau 4', minBrutoMaand: 2750 },
  { pc: 'PC 330', pcNaam: 'Gezondheidszorg', niveau: 'Niveau 5', minBrutoMaand: 2950 },
  { pc: 'PC 330', pcNaam: 'Gezondheidszorg', niveau: 'Niveau 6', minBrutoMaand: 3200 },
];

/** Returns the barema for a specific PC and niveau, or the lowest barema for that PC if no niveau given. */
export function getBarema(pc: string, niveau?: string): BaremaEntry | undefined {
  const entries = BAREMAS.filter((b) => b.pc === pc);
  if (entries.length === 0) return undefined;
  if (niveau) return entries.find((b) => b.niveau === niveau);
  return entries.reduce((min, b) => (b.minBrutoMaand < min.minBrutoMaand ? b : min));
}

/** Returns the minimum barema floor for a PC (lowest niveau). */
export function getMinBaremaForPc(pc: string): number | undefined {
  return getBarema(pc)?.minBrutoMaand;
}
