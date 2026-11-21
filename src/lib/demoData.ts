import { Employee } from './types';

export const demoData: Employee[] = [
  // Admin & Secretariaat
  { id: 'W001', geslacht: 'V', functietitel: 'Admin Bediende', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 2850, ancienniteit_jaren: 3, variabel_loon_jaar: 0 },
  { id: 'W002', geslacht: 'V', functietitel: 'Admin Bediende', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 2920, ancienniteit_jaren: 5, variabel_loon_jaar: 0 },
  { id: 'W003', geslacht: 'M', functietitel: 'Admin Bediende', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 2880, ancienniteit_jaren: 4, variabel_loon_jaar: 0 },
  { id: 'W004', geslacht: 'V', functietitel: 'Office Assistant', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 2700, ancienniteit_jaren: 1, variabel_loon_jaar: 0 },
  { id: 'W005', geslacht: 'M', functietitel: 'Office Assistant', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 2730, ancienniteit_jaren: 2, variabel_loon_jaar: 0 },
  { id: 'W006', geslacht: 'V', functietitel: 'Binnendienst Medewerker', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 2980, ancienniteit_jaren: 6, variabel_loon_jaar: 300 },
  { id: 'W007', geslacht: 'M', functietitel: 'Binnendienst Medewerker', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3010, ancienniteit_jaren: 7, variabel_loon_jaar: 300 },
  { id: 'W008', geslacht: 'X', functietitel: 'Binnendienst Medewerker', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 2960, ancienniteit_jaren: 5, variabel_loon_jaar: 200 },

  // Accountmanagement & Sales (loonkloof ~8%)
  { id: 'W009', geslacht: 'M', functietitel: 'Account Manager', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 4200, ancienniteit_jaren: 8, variabel_loon_jaar: 2400 },
  { id: 'W010', geslacht: 'M', functietitel: 'Account Manager', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 4350, ancienniteit_jaren: 10, variabel_loon_jaar: 2800 },
  { id: 'W011', geslacht: 'M', functietitel: 'Account Manager', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 4150, ancienniteit_jaren: 7, variabel_loon_jaar: 2200 },
  { id: 'W012', geslacht: 'V', functietitel: 'Account Manager', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3850, ancienniteit_jaren: 6, variabel_loon_jaar: 1800 },
  { id: 'W013', geslacht: 'V', functietitel: 'Account Manager', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3920, ancienniteit_jaren: 7, variabel_loon_jaar: 1900 },
  { id: 'W014', geslacht: 'M', functietitel: 'Sales Representative', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3450, ancienniteit_jaren: 4, variabel_loon_jaar: 3600 },
  { id: 'W015', geslacht: 'M', functietitel: 'Sales Representative', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3380, ancienniteit_jaren: 3, variabel_loon_jaar: 3200 },
  { id: 'W016', geslacht: 'V', functietitel: 'Sales Representative', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3180, ancienniteit_jaren: 3, variabel_loon_jaar: 2800 },
  { id: 'W017', geslacht: 'V', functietitel: 'Sales Coordinator', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3050, ancienniteit_jaren: 4, variabel_loon_jaar: 600 },
  { id: 'W018', geslacht: 'M', functietitel: 'Sales Coordinator', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3120, ancienniteit_jaren: 5, variabel_loon_jaar: 700 },

  // IT & Systemen (loonkloof ~7%)
  { id: 'W019', geslacht: 'M', functietitel: 'IT Support Medewerker', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3300, ancienniteit_jaren: 4, variabel_loon_jaar: 0 },
  { id: 'W020', geslacht: 'M', functietitel: 'IT Support Medewerker', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3250, ancienniteit_jaren: 3, variabel_loon_jaar: 0 },
  { id: 'W021', geslacht: 'V', functietitel: 'IT Support Medewerker', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3050, ancienniteit_jaren: 3, variabel_loon_jaar: 0 },
  { id: 'W022', geslacht: 'M', functietitel: 'Systeembeheerder', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 4100, ancienniteit_jaren: 9, variabel_loon_jaar: 500 },
  { id: 'W023', geslacht: 'M', functietitel: 'Systeembeheerder', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 4050, ancienniteit_jaren: 8, variabel_loon_jaar: 500 },
  { id: 'W024', geslacht: 'V', functietitel: 'Systeembeheerder', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3800, ancienniteit_jaren: 7, variabel_loon_jaar: 400 },
  { id: 'W025', geslacht: 'M', functietitel: 'Junior Developer', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3600, ancienniteit_jaren: 2, variabel_loon_jaar: 0 },
  { id: 'W026', geslacht: 'V', functietitel: 'Junior Developer', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3380, ancienniteit_jaren: 2, variabel_loon_jaar: 0 },

  // Operations & HR (conform)
  { id: 'W027', geslacht: 'M', functietitel: 'Teamlead Operations', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 4800, ancienniteit_jaren: 12, variabel_loon_jaar: 1200 },
  { id: 'W028', geslacht: 'V', functietitel: 'Teamlead Operations', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 4750, ancienniteit_jaren: 11, variabel_loon_jaar: 1200 },
  { id: 'W029', geslacht: 'V', functietitel: 'HR Medewerker', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3450, ancienniteit_jaren: 6, variabel_loon_jaar: 400 },
  { id: 'W030', geslacht: 'V', functietitel: 'HR Medewerker', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3380, ancienniteit_jaren: 5, variabel_loon_jaar: 350 },
  { id: 'W031', geslacht: 'M', functietitel: 'HR Medewerker', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3420, ancienniteit_jaren: 6, variabel_loon_jaar: 380 },

  // Finance (conform)
  { id: 'W032', geslacht: 'V', functietitel: 'Boekhouder', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3800, ancienniteit_jaren: 8, variabel_loon_jaar: 500 },
  { id: 'W033', geslacht: 'M', functietitel: 'Boekhouder', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3850, ancienniteit_jaren: 9, variabel_loon_jaar: 520 },
  { id: 'W034', geslacht: 'V', functietitel: 'Boekhouder', paritair_comite: 'PC 200', bruto_maandloon_voltijds: 3780, ancienniteit_jaren: 7, variabel_loon_jaar: 480 },
];
