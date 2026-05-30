import { AdminButton } from './AdminButton';

interface HeaderProps {
  onLogoClick: () => void;
  currentPage: 'landing' | 'form' | 'result';
  onBack?: () => void;
  onAdminClick: () => void;
}

export function Header({ onLogoClick, currentPage, onBack, onAdminClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
        <button onClick={onLogoClick} className="text-left group">
          <div className="text-base font-bold tracking-tight text-gray-900 leading-none">
            SOLE MATRIX
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5 tracking-widest uppercase">
            AI Sneaker Preference Analyzer
          </div>
        </button>

        <div className="flex items-center gap-2">
          {currentPage === 'landing' && (
            <div className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full hidden sm:block">
              サンプル分析データ使用
            </div>
          )}

          {currentPage !== 'landing' && onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              戻る
            </button>
          )}

          <AdminButton onClick={onAdminClick} />
        </div>
      </div>
    </header>
  );
}
