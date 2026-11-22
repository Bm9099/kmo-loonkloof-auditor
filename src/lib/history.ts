import { FunctionGroup } from '@/lib/types';

export interface SavedAnalysis {
  id: string;
  date: string;
  label: string;
  functionGroups: FunctionGroup[];
  overallGap: number;
  complianceScore: number;
}

const STORAGE_KEY = 'kmo_loonkloof_history';
const MAX_ENTRIES = 10;

export function saveAnalysis(label: string, data: Omit<SavedAnalysis, 'id' | 'date' | 'label'>): void {
  if (typeof window === 'undefined') return;
  const history = loadHistory();
  const entry: SavedAnalysis = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toLocaleDateString('nl-BE', { day: '2-digit', month: 'short', year: 'numeric' }),
    label,
    ...data,
  };
  const updated = [entry, ...history].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage quota exceeded — drop oldest and retry
    const trimmed = [entry, ...history].slice(0, MAX_ENTRIES - 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }
}

export function loadHistory(): SavedAnalysis[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedAnalysis[]) : [];
  } catch {
    return [];
  }
}

export function deleteAnalysis(id: string): void {
  if (typeof window === 'undefined') return;
  const updated = loadHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
