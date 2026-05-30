import { ApiMode, API_MODE_LABELS, API_MODE_DESCRIPTIONS } from '../lib/analyzeWithMode';
import { getApiSettings, hasGeminiKey, hasRakutenKeys } from '../lib/apiSettings';

interface ApiModeSelectorProps {
  value: ApiMode;
  onChange: (mode: ApiMode) => void;
}

const MODES: ApiMode[] = ['demo', 'gemini', 'rakuten', 'hybrid'];

function modeRequirements(mode: ApiMode): string | null {
  if (mode === 'demo') return null;
  if (mode === 'gemini') return 'Gemini API Key が必要';
  if (mode === 'rakuten') return 'Rakuten App ID と Access Key が必要';
  return 'Gemini + Rakuten の両キーが必要';
}

export function ApiModeSelector({ value, onChange }: ApiModeSelectorProps) {
  const settings = getApiSettings();

  function isAvailable(mode: ApiMode): boolean {
    if (mode === 'demo') return true;
    if (mode === 'gemini') return hasGeminiKey(settings);
    if (mode === 'rakuten') return hasRakutenKeys(settings);
    return hasGeminiKey(settings) && hasRakutenKeys(settings);
  }

  return (
    <div className="space-y-2">
      {MODES.map((mode) => {
        const available = isAvailable(mode);
        const selected = value === mode;
        const req = modeRequirements(mode);

        return (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
              selected
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className={`text-sm font-semibold ${selected ? 'text-white' : 'text-gray-800'}`}>
                {API_MODE_LABELS[mode]}
              </span>
              <span className={`w-2 h-2 rounded-full ${selected ? 'bg-white' : available ? 'bg-emerald-400' : 'bg-gray-300'}`} />
            </div>
            <p className={`text-xs leading-relaxed ${selected ? 'text-gray-300' : 'text-gray-500'}`}>
              {API_MODE_DESCRIPTIONS[mode]}
            </p>
            {!available && req && (
              <p className={`text-[10px] mt-1 ${selected ? 'text-gray-400' : 'text-amber-500'}`}>
                ※ {req}（未設定の場合はデモモードにフォールバック）
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
