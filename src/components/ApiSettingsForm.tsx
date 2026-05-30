import { useState, useEffect } from 'react';
import { Check, Eye, EyeOff, Wifi, WifiOff, Loader } from 'lucide-react';
import { ApiSettings, getApiSettings, saveApiSettings } from '../lib/apiSettings';

interface ApiSettingsFormProps {
  onSaved?: () => void;
}

interface FieldState {
  value: string;
  show: boolean;
}

type FieldKey = 'geminiApiKey' | 'rakutenAppId' | 'rakutenAccessKey' | 'rakutenAffiliateId';

const FIELD_META: { key: FieldKey; label: string; placeholder: string }[] = [
  { key: 'geminiApiKey', label: 'Gemini API Key', placeholder: 'AIza...' },
  { key: 'rakutenAppId', label: 'Rakuten App ID', placeholder: '1234567890' },
  { key: 'rakutenAccessKey', label: 'Rakuten Access Key', placeholder: 'access key...' },
  { key: 'rakutenAffiliateId', label: 'Rakuten Affiliate ID', placeholder: 'affiliate id...' },
];

const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-proxy`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

type TestStatus = 'idle' | 'testing' | 'ok' | 'error';

function StatusBadge({ isSet }: { isSet: boolean }) {
  if (isSet) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
        <Check size={9} />
        設定済み
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100">
      未設定
    </span>
  );
}

export function ApiSettingsForm({ onSaved }: ApiSettingsFormProps) {
  const [fields, setFields] = useState<Record<FieldKey, FieldState>>({
    geminiApiKey: { value: '', show: false },
    rakutenAppId: { value: '', show: false },
    rakutenAccessKey: { value: '', show: false },
    rakutenAffiliateId: { value: '', show: false },
  });
  const [savedKeys, setSavedKeys] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    refreshSavedKeys();
  }, []);

  function refreshSavedKeys() {
    const settings = getApiSettings();
    setSavedKeys({
      geminiApiKey: Boolean(settings.geminiApiKey),
      rakutenAppId: Boolean(settings.rakutenAppId),
      rakutenAccessKey: Boolean(settings.rakutenAccessKey),
      rakutenAffiliateId: Boolean(settings.rakutenAffiliateId),
    });
  }

  function setValue(key: FieldKey, value: string) {
    setFields((prev) => ({ ...prev, [key]: { ...prev[key], value } }));
  }

  function toggleShow(key: FieldKey) {
    setFields((prev) => ({ ...prev, [key]: { ...prev[key], show: !prev[key].show } }));
  }

  function handleSave() {
    // Only update keys that have a value typed in the input.
    // Empty input = keep the existing sessionStorage value unchanged.
    const existing = getApiSettings();
    const merged: ApiSettings = {
      geminiApiKey: fields.geminiApiKey.value.trim() || existing.geminiApiKey,
      rakutenAppId: fields.rakutenAppId.value.trim() || existing.rakutenAppId,
      rakutenAccessKey: fields.rakutenAccessKey.value.trim() || existing.rakutenAccessKey,
      rakutenAffiliateId: fields.rakutenAffiliateId.value.trim() || existing.rakutenAffiliateId,
    };
    saveApiSettings(merged);

    // Clear inputs after save (keys are now stored in sessionStorage)
    setFields({
      geminiApiKey: { value: '', show: false },
      rakutenAppId: { value: '', show: false },
      rakutenAccessKey: { value: '', show: false },
      rakutenAffiliateId: { value: '', show: false },
    });

    refreshSavedKeys();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    if (onSaved) onSaved();
  }

  async function handleTestGemini() {
    const settings = getApiSettings();
    const apiKey = settings.geminiApiKey;
    if (!apiKey) {
      setTestStatus('error');
      setTestMessage('Gemini APIキーが未設定です。キーを入力して保存してください。');
      return;
    }

    setTestStatus('testing');
    setTestMessage('');

    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ apiKey, prompt: '「テスト」と一言だけ日本語で返してください。' }),
      });
      const text = await res.text();
      if (res.ok) {
        const data = JSON.parse(text);
        if (data.error) {
          setTestStatus('error');
          setTestMessage(`Gemini APIエラー: ${data.error}${data.detail?.error?.message ? `\n詳細: ${data.detail.error.message}` : ''}`);
        } else {
          setTestStatus('ok');
          setTestMessage(`接続成功。Gemini応答: ${(data.text ?? '').slice(0, 80)}`);
        }
      } else {
        let detail = text;
        try { detail = JSON.parse(text)?.error ?? text; } catch { /* keep raw */ }
        setTestStatus('error');
        setTestMessage(`HTTP ${res.status}: ${detail}`);
      }
    } catch (err) {
      setTestStatus('error');
      setTestMessage(`ネットワークエラー: ${err}`);
    }
  }

  function handleClearGemini() {
    sessionStorage.removeItem('SOLE_MATRIX_GEMINI_API_KEY');
    sessionStorage.removeItem('GEMINI_API_KEY');
    refreshSavedKeys();
    setTestStatus('idle');
    setTestMessage('');
  }

  return (
    <div className="space-y-4">
      {FIELD_META.map(({ key, label, placeholder }) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-600">{label}</label>
            <StatusBadge isSet={savedKeys[key] ?? false} />
          </div>
          <div className="relative">
            <input
              type={fields[key].show ? 'text' : 'password'}
              value={fields[key].value}
              onChange={(e) => setValue(key, e.target.value)}
              placeholder={savedKeys[key] ? '（設定済み — 変更する場合のみ入力）' : placeholder}
              autoComplete="off"
              className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-400 transition-all bg-white"
            />
            <button
              type="button"
              onClick={() => toggleShow(key)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {fields[key].show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
          saved
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {saved ? '保存しました' : '保存（セッションのみ）'}
      </button>

      {/* Gemini connection test */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-700">Gemini API 接続テスト</p>
          {savedKeys.geminiApiKey && (
            <button
              onClick={handleClearGemini}
              className="text-[10px] text-red-400 hover:text-red-600 transition-colors"
            >
              キーを削除
            </button>
          )}
        </div>
        <button
          onClick={handleTestGemini}
          disabled={testStatus === 'testing'}
          className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-white disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {testStatus === 'testing' ? (
            <><Loader size={12} className="animate-spin" />テスト中...</>
          ) : (
            <><Wifi size={12} />接続テストを実行</>
          )}
        </button>
        {testStatus === 'ok' && (
          <div className="flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
            <Wifi size={12} className="text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-emerald-700 leading-relaxed whitespace-pre-wrap">{testMessage}</p>
          </div>
        )}
        {testStatus === 'error' && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
            <WifiOff size={12} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-red-600 leading-relaxed whitespace-pre-wrap">{testMessage}</p>
          </div>
        )}
      </div>

      <p className="text-[10px] text-gray-400 leading-relaxed bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
        APIキーはブラウザのセッション中のみ保存されます（sessionStorage）。ブラウザを閉じると自動削除されます。空欄のフィールドは保存済みキーを上書きしません。
      </p>
    </div>
  );
}
