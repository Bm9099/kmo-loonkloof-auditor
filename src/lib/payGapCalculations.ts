import { Employee, FunctionGroup, AnalysisResult } from './types';

const FUNCTION_FAMILIES: Record<string, string[]> = {
  'Admin & Secretariaat': ['admin', 'office', 'binnendienst', 'secretar', 'receptie', 'assistante'],
  'Accountmanagement & Sales': ['account', 'sales', 'verkoop', 'commerci', 'business development'],
  'IT & Systemen': ['it ', 'it-', 'developer', 'ontwikkel', 'systeem', 'software', 'data', 'cyber', 'infra'],
  'Operations & Management': ['teamlead', 'manager', 'directeur', 'operations', 'operationeel', 'co\u00f6rdinator', 'coordinator'],
  'HR & People': ['hr', 'human resources', 'personeel', 'rekrutering', 'talent'],
  'Finance & Boekhouding': ['boekhouder', 'boekhoud', 'finance', 'financieel', 'accountant', 'controller'],
};

function assignToFamily(title: string): string {
  const lower = title.toLowerCase();
  for (const [family, keywords] of Object.entries(FUNCTION_FAMILIES)) {
    if (keywords.some((kw) => lower.includes(kw))) return family;
  }
  return 'Overige';
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function groupByFunctionFamily(
  employees: Employee[],
  customGroups?: Record<string, string[]>
): FunctionGroup[] {
  const groupMap: Record<string, Employee[]> = {};

  employees.forEach((emp) => {
    const family = customGroups
      ? findInCustomGroups(emp.functietitel, customGroups) ?? assignToFamily(emp.functietitel)
      : assignToFamily(emp.functietitel);
    if (!groupMap[family]) groupMap[family] = [];
    groupMap[family].push(emp);
  });

  return Object.entries(groupMap).map(([naam, emps]) => buildFunctionGroup(naam, emps));
}

function findInCustomGroups(
  title: string,
  groups: Record<string, string[]>
): string | null {
  for (const [family, titles] of Object.entries(groups)) {
    if (titles.map((t) => t.toLowerCase()).includes(title.toLowerCase())) return family;
  }
  return null;
}

function buildFunctionGroup(naam: string, employees: Employee[]): FunctionGroup {
  const males = employees.filter((e) => e.geslacht === 'M');
  const females = employees.filter((e) => e.geslacht === 'V');

  const lonenM = males.map((e) => e.bruto_maandloon_voltijds);
  const lonenV = females.map((e) => e.bruto_maandloon_voltijds);

  const gemiddeldM = average(lonenM);
  const gemiddeldV = average(lonenV);
  const mediaanM = median(lonenM);
  const mediaanV = median(lonenV);

  const loonkloof = gemiddeldM > 0 ? ((gemiddeldM - gemiddeldV) / gemiddeldM) * 100 : 0;
  const absLoonkloof = Math.abs(gemiddeldM - gemiddeldV);

  const hasEnoughData = males.length >= 2 && females.length >= 2;
  let status: FunctionGroup['status'];
  if (!hasEnoughData) {
    status = 'onvoldoende_data';
  } else if (Math.abs(loonkloof) > 5) {
    status = 'actie_vereist';
  } else {
    status = 'conform';
  }

  const gemAncM = average(males.map((e) => e.ancienniteit_jaren));
  const gemAncV = average(females.map((e) => e.ancienniteit_jaren));
  const ancDiff = gemAncM - gemAncV;
  let ancienniteitVerklaring = 0;
  if (absLoonkloof > 0 && ancDiff > 0) {
    const verklaard = ancDiff * 150;
    ancienniteitVerklaring = Math.min(100, (verklaard / absLoonkloof) * 100);
  }

  return {
    naam,
    employees,
    aantalM: males.length,
    aantalV: females.length,
    gemiddeldM,
    gemiddeldV,
    mediaanM,
    mediaanV,
    loonkloof,
    absLoonkloof,
    status,
    ancienniteitVerklaring,
  };
}

export function calculateAnalysis(employees: Employee[], customGroups?: Record<string, string[]>): AnalysisResult {
  const functieGroepen = groupByFunctionFamily(employees, customGroups);

  const groepsKloven = functieGroepen
    .filter((g) => g.status !== 'onvoldoende_data')
    .map((g) => g.loonkloof);

  const totaleGemiddeldeLoonkloof = average(groepsKloven);
  const mediaanLoonkloof = median(groepsKloven);

  const allMales = employees.filter((e) => e.geslacht === 'M').map((e) => e.bruto_maandloon_voltijds);
  const allFemales = employees.filter((e) => e.geslacht === 'V').map((e) => e.bruto_maandloon_voltijds);
  const mediaanVerschilEuro = median(allMales) - median(allFemales);

  const aantalActieVereist = functieGroepen.filter((g) => g.status === 'actie_vereist').length;
  const complianceScore = Math.max(
    0,
    100 - aantalActieVereist * 15 - (Math.abs(totaleGemiddeldeLoonkloof) > 5 ? 10 : 0)
  );

  return {
    totaleGemiddeldeLoonkloof,
    mediaanLoonkloof,
    mediaanVerschilEuro,
    complianceScore,
    aantalActieVereist,
    functieGroepen,
  };
}
