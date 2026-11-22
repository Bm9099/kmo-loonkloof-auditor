'use client';

import { useState, useEffect } from 'react';
import { Check, X, Key } from 'lucide-react';
import { getStoredApiKey, saveApiKey, clearApiKey } from '@/lib/openai';

interface ApiKeyInputProps {
  onKeyChange?: (key: string | null) => void;
}

export function ApiKeyInput({ onKeyChange }: ApiKeyInputProps) {
  const [inputKey, setInputKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredApiKey();
    setSavedKey(stored);
  }, []);

  const handleSave = () => {
    const trimmed = inputKey.trim();
    if (!trimmed) return;
    saveApiKey(trimmed);
    setSavedKey(trimmed);
    setInputKey('');
    onKeyChange?.(trimmed);
  };

  const handleClear = () => {
    clearApiKey();
    setSavedKey(null);
    onKeyChange?.(null);
  };

  const maskedKey = savedKey ? `sk-...${savedKey.slice(-4)}` : '';

  return (
    <div
      className="rounded-lg p-4 space-y-3"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <Key className="w-4 h-4 text-teal-400 shrink-0" />
        <span className="text-sm font-medium text-white/80">OpenAI API-sleutel</span>
        {savedKey && (
          <span className="flex items-center gap-1 text-xs text-teal-400 font-mono">
            <Check className="w-3.5 h-3.5" />
            {maskedKey}
          </span>
        )}
      </div>

      {savedKey ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 flex-1">Sleutel opgeslagen en actief</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Verwijderen
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="password"
            placeholder="sk-..."
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
            className="flex-1 min-w-0 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={!inputKey.trim()}
            className="px-3 py-1.5 text-sm text-white rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            Opslaan
          </button>
        </div>
      )}

      <p className="text-[11px] text-white/30 leading-relaxed">
        Uw API-sleutel wordt enkel lokaal opgeslagen in uw browser en nooit naar onze servers verzonden.
      </p>
    </div>
  );
}
