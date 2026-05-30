import { useState } from 'react';
import { Lock, X } from 'lucide-react';

// NOTE: This passcode is only for 1day MVP demo.
// Do not use this as real authentication in production.
const ADMIN_PASSCODE = 'solematrix-demo';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function AdminLoginModal({ onSuccess, onClose }: AdminLoginModalProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      onSuccess();
    } else {
      setError('パスコードが正しくありません');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPasscode('');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 ${shake ? 'animate-bounce' : ''}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <Lock size={16} className="text-gray-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">管理者モード</h2>
            <p className="text-xs text-gray-400">パスコードを入力してください</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setError(''); }}
              placeholder="パスコード"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
            />
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            ログイン
          </button>
        </form>

        <p className="mt-4 text-center text-[10px] text-gray-300">
          デモ用パスコード: solematrix-demo
        </p>
      </div>
    </div>
  );
}
