import { X, Settings, Shield } from 'lucide-react';
import { ApiMode } from '../lib/analyzeWithMode';
import { ApiSettingsForm } from './ApiSettingsForm';
import { ApiModeSelector } from './ApiModeSelector';

interface AdminPanelProps {
  apiMode: ApiMode;
  onModeChange: (mode: ApiMode) => void;
  onClose: () => void;
}

export function AdminPanel({ apiMode, onModeChange, onClose }: AdminPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
              <Settings size={13} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">管理者パネル</h2>
              <p className="text-[10px] text-gray-400">SOLE MATRIX 管理者設定</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-all"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-5 py-8 w-full space-y-8 pb-16">
        {/* Security warning */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 flex gap-3">
          <Shield size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-700 mb-1">セキュリティに関する注意</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              この設定は1day MVPデモ用です。入力されたAPIキーはこのブラウザのセッション中のみ使用されます。本番運用では、APIキーをフロントエンドに保存せず、サーバー側の環境変数で管理してください。
            </p>
          </div>
        </div>

        {/* API Settings */}
        <section>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900">API 設定</h3>
            <p className="text-xs text-gray-400 mt-0.5">APIキーを入力してください（sessionStorageに一時保存）</p>
          </div>
          <ApiSettingsForm />
        </section>

        {/* API Mode */}
        <section>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-900">API 接続モード</h3>
            <p className="text-xs text-gray-400 mt-0.5">分析方式を選択してください。APIキーが未設定の場合はデモモードにフォールバックします。</p>
          </div>
          <ApiModeSelector value={apiMode} onChange={onModeChange} />
        </section>

        {/* Info */}
        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
          <h4 className="text-xs font-semibold text-gray-700">拡張ポイント</h4>
          <div className="space-y-2 text-xs text-gray-500 leading-relaxed">
            <p>
              <span className="font-medium text-gray-700">Gemini API：</span>
              <code className="text-[11px] bg-white border border-gray-100 px-1.5 py-0.5 rounded">src/lib/analyzeWithMode.ts</code> の <code className="text-[11px] bg-white border border-gray-100 px-1.5 py-0.5 rounded">runGeminiMode()</code> に接続コードを追加
            </p>
            <p>
              <span className="font-medium text-gray-700">楽天API：</span>
              <code className="text-[11px] bg-white border border-gray-100 px-1.5 py-0.5 rounded">runRakutenMode()</code> に接続コードを追加。価格・在庫情報を取得可能
            </p>
            <p>
              <span className="font-medium text-gray-700">Supabase：</span>
              分析履歴・Wishlistの永続化に使用。<code className="text-[11px] bg-white border border-gray-100 px-1.5 py-0.5 rounded">src/lib/wishlist.ts</code> に接続スタブあり
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
