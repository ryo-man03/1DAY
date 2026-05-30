import { useState, useEffect } from 'react';
import { PreferenceTag, SneakerInput } from './types';
import { AnalysisOutput, ApiMode, analyzeSneakerWithMode } from './lib/analyzeWithMode';
import { Header } from './components/Header';
import { PreferenceTagSelector } from './components/PreferenceTagSelector';
import { SeedSneakerTable } from './components/SeedSneakerTable';
import { SampleSneakerCards } from './components/SampleSneakerCards';
import { SneakerForm } from './components/SneakerForm';
import { AnalysisResultCard } from './components/AnalysisResultCard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';

type Page = 'landing' | 'form' | 'result';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [selectedTags, setSelectedTags] = useState<PreferenceTag[]>([]);
  const [formInitial, setFormInitial] = useState<SneakerInput | undefined>(undefined);
  const [lastInput, setLastInput] = useState<SneakerInput | null>(null);
  const [analysisOutput, setAnalysisOutput] = useState<AnalysisOutput | null>(null);
  const [apiMode, setApiMode] = useState<ApiMode>('demo');

  // Admin state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  function handleSampleSelect(input: SneakerInput) {
    setFormInitial(input);
    setPage('form');
  }

  async function handleAnalyze(input: SneakerInput) {
    const output = await analyzeSneakerWithMode(input, selectedTags, apiMode);
    setLastInput(input);
    setAnalysisOutput(output);
    setPage('result');
  }

  function handleStartAnalyze() {
    setFormInitial(undefined);
    setPage('form');
  }

  function handleBack() {
    if (page === 'result') setPage('form');
    else setPage('landing');
  }

  function handleReanalyze() {
    setPage('landing');
    setAnalysisOutput(null);
  }

  function handleAdminClick() {
    if (adminAuthenticated) {
      setShowAdminPanel(true);
    } else {
      setShowAdminLogin(true);
    }
  }

  function handleAdminLoginSuccess() {
    setShowAdminLogin(false);
    setAdminAuthenticated(true);
    setShowAdminPanel(true);
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        onLogoClick={() => setPage('landing')}
        currentPage={page}
        onBack={page !== 'landing' ? handleBack : undefined}
        onAdminClick={handleAdminClick}
      />

      {/* ── Landing page ──────────────────────────────────────────── */}
      {page === 'landing' && (
        <main className="max-w-2xl mx-auto px-5 py-10 space-y-10">
          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                そのスニーカー、<br />
                本当に自分に合う？
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                SOLE MATRIXは、あなたのスニーカーの好み、所有傾向、文化的背景への関心をもとに、気になる一足が本当に買うべきモデルかを分析します。
              </p>
            </div>
            <button
              onClick={handleStartAnalyze}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              スニーカーを分析する
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <PreferenceTagSelector selected={selectedTags} onChange={setSelectedTags} />
          </section>

          <section>
            <SeedSneakerTable />
          </section>

          <section>
            <SampleSneakerCards onSelect={handleSampleSelect} />
          </section>

          <section className="pb-6">
            <button
              onClick={handleStartAnalyze}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-semibold text-base hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              スニーカーを分析する
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              外部API不要・サンプル分析データで即時結果表示
            </p>
          </section>
        </main>
      )}

      {/* ── Form page ─────────────────────────────────────────────── */}
      {page === 'form' && (
        <main className="max-w-2xl mx-auto px-5 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">スニーカーを入力</h2>
            <p className="text-sm text-gray-400 mt-1">
              分析したいスニーカーの情報を入力してください
            </p>
          </div>

          {selectedTags.length > 0 ? (
            <div className="mb-5 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 mb-2 font-medium">選択中の好みタグ</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-900 text-white px-2.5 py-0.5 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-xs text-amber-700 leading-relaxed">
                好みタグが未選択です。トップ画面でタグを選択すると、より精度の高い分析が行えます。
              </p>
            </div>
          )}

          <div className="mb-6">
            <SampleSneakerCards onSelect={(input) => setFormInitial(input)} />
          </div>

          <SneakerForm
            key={JSON.stringify(formInitial)}
            initialValues={formInitial}
            onSubmit={handleAnalyze}
          />
        </main>
      )}

      {/* ── Result page ───────────────────────────────────────────── */}
      {page === 'result' && analysisOutput && lastInput && (
        <main className="max-w-2xl mx-auto px-5 py-8">
          <AnalysisResultCard
            result={analysisOutput.result}
            input={lastInput}
            onReanalyze={handleReanalyze}
            actualMode={analysisOutput.actualMode}
            usedFallback={analysisOutput.usedFallback}
            geminiEnhanced={analysisOutput.geminiEnhanced}
            fallbackReason={analysisOutput.fallbackReason}
          />
        </main>
      )}

      {/* ── Admin overlays ─────────────────────────────────────────── */}
      {showAdminLogin && (
        <AdminLoginModal
          onSuccess={handleAdminLoginSuccess}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {showAdminPanel && (
        <AdminPanel
          apiMode={apiMode}
          onModeChange={setApiMode}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
}
