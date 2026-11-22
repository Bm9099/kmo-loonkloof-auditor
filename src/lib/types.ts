export interface Employee {
  id: string;
  geslacht: 'M' | 'V' | 'X';
  functietitel: string;
  paritair_comite: string;
  bruto_maandloon_voltijds: number;
  ancienniteit_jaren: number;
  variabel_loon_jaar: number;
}

export interface FunctionGroup {
  naam: string;
  employees: Employee[];
  aantalM: number;
  aantalV: number;
  gemiddeldM: number;
  gemiddeldV: number;
  mediaanM: number;
  mediaanV: number;
  p25: number;
  p75: number;
  gemiddeldVariabelM: number;
  gemiddeldVariabelV: number;
  loonkloof: number;
  absLoonkloof: number;
  status: 'conform' | 'actie_vereist' | 'onvoldoende_data';
  ancienniteitVerklaring: number;
}

export interface AnalysisResult {
  totaleGemiddeldeLoonkloof: number;
  mediaanLoonkloof: number;
  mediaanVerschilEuro: number;
  complianceScore: number;
  aantalActieVereist: number;
  functieGroepen: FunctionGroup[];
  onderBarema: number;
}

export interface RoleGrouping {
  groepen: { naam: string; titels: string[] }[];
}
