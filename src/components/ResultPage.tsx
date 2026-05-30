import { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  TrendingUp,
  Star,
  Layers,
  Heart,
  ShoppingBag,
  Clock,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { AnalysisResult, Decision } from '../types';
import { saveToWishlist, isInWishlist } from '../lib/wishlist';

interface ResultPageProps {
  result: AnalysisResult;
  onBack: () => void;
  onReanalyze: () => void;
  onViewWishlist: () => void;
}

const SCORE_LABELS: Record<keyof AnalysisResult['scores'], string> = {
  price: '価格',
  rarity: '希少性',
  trend: 'トレンド',
  culture: '文化的価値',
  styling: 'コーデ相性',
  personalFit: '好みとの一致',
};

const SCORE_ICONS: Record<keyof AnalysisResult['scores'], typeof TrendingUp> = {
  price: ShoppingBag,
  rarity: Star,
  trend: TrendingUp,
  culture: Layers,
  styling: Heart,
  personalFit: Heart,
};

function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon: typeof TrendingUp }) {
  const color =
    score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 w-28 shrink-0">
        <Icon size={13} className="text-gray-400" />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{score}</span>
    </div>
  );
}

function DecisionBadge({ decision }: { decision: Decision }) {
  if (decision === 'BUY') {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-2xl">
          <ShoppingBag size={18} />
          <span className="text-xl font-bold tracking-widest">BUY</span>
        </div>
        <span className="text-xs text-emerald-600 font-medium">今が買い時</span>
      </div>
    );
  }
  if (decision === 'WAIT') {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 bg-amber-400 text-white px-6 py-2.5 rounded-2xl">
          <Clock size={18} />
          <span className="text-xl font-bold tracking-widest">WAIT</span>
        </div>
        <span className="text-xs text-amber-600 font-medium">タイミングを見て</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2 bg-red-400 text-white px-6 py-2.5 rounded-2xl">
        <XCircle size={18} />
        <span className="text-xl font-bold tracking-widest">SKIP</span>
      </div>
      <span className="text-xs text-red-500 font-medium">今回は見送り</span>
    </div>
  );
}

function PersonalFitMeter({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80
      ? 'text-emerald-600'
      : score >= 60
      ? 'text-amber-500'
      : score >= 40
      ? 'text-gray-600'
      : 'text-red-500';

  const bgColor =
    score >= 80
      ? 'bg-emerald-50 border-emerald-100'
      : score >= 60
      ? 'bg-amber-50 border-amber-100'
      : score >= 40
      ? 'bg-gray-50 border-gray-100'
      : 'bg-red-50 border-red-100';

  const barColor =
    score >= 80
      ? 'bg-emerald-400'
      : score >= 60
      ? 'bg-amber-400'
      : score >= 40
      ? 'bg-gray-400'
      : 'bg-red-400';

  return (
    <div className={`rounded-2xl border p-5 ${bgColor}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart size={16} className={color} />
          <span className="text-sm font-semibold text-gray-700">好みとの相性</span>
        </div>
        <span className={`text-2xl font-bold ${color}`}>{label}</span>
      </div>
      <div className="bg-white/60 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2 text-right">{score} / 100</p>
    </div>
  );
}

export function ResultPage({ result, onBack, onReanalyze, onViewWishlist }: ResultPageProps) {
  const [saved, setSaved] = useState(() => isInWishlist(result.sneakerName));
  const [saveMsg, setSaveMsg] = useState('');

  function handleSave() {
    if (saved) return;
    saveToWishlist({
      sneakerName: result.sneakerName,
      sku: 'unknown',
      buyScore: result.buyScore,
      decision: result.decision,
      personalFitLabel: result.personalFitLabel,
      preferenceTags: result.matchedTags,
      budget: result.budget,
    });
    setSaved(true);
    setSaveMsg('Wishlistに保存しました');
    setTimeout(() => setSaveMsg(''), 3000);
  }

  const scoreEntries = Object.entries(result.scores) as [keyof AnalysisResult['scores'], number][];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={15} />
            戻る
          </button>
          <h1 className="text-sm font-bold tracking-tight text-gray-900">SOLE//MATRIX</h1>
          <button
            onClick={onViewWishlist}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Bookmark size={15} />
            Wishlist
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        {/* Title */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">分析結果</p>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">{result.sneakerName}</h2>
          {result.isDemo && (
            <span className="inline-flex items-center gap-1 mt-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
              サンプル分析データ
            </span>
          )}
        </div>

        {/* 1. Personal Fit */}
        <PersonalFitMeter score={result.personalFitScore} label={result.personalFitLabel} />

        {/* 2. Decision + BuyScore */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <DecisionBadge decision={result.decision} />
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">BuyScore</p>
              <p className="text-5xl font-bold text-gray-900">{result.buyScore}</p>
              <p className="text-xs text-gray-400 mt-1">/ 100</p>
            </div>
          </div>
        </div>

        {/* 3. Price comparison */}
        {result.referencePrice !== undefined && (
          <div className="rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">価格情報</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">参考価格</p>
                <p className="text-xl font-bold text-gray-900">
                  ¥{result.referencePrice.toLocaleString()}
                </p>
              </div>
              {result.budget !== undefined && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">入力予算</p>
                  <p className="text-xl font-bold text-gray-900">
                    ¥{result.budget.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            {result.priceDiff !== undefined && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">予算との差額</p>
                <p
                  className={`text-base font-semibold ${
                    result.priceDiff >= 0 ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {result.priceDiff >= 0 ? '+' : ''}¥{result.priceDiff.toLocaleString()}
                  <span className="text-xs font-normal text-gray-400 ml-2">
                    {result.priceDiff >= 0 ? '予算内' : '予算オーバー'}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* 4. Score breakdown */}
        <div className="rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">スコア内訳</p>
          <div className="space-y-3">
            {scoreEntries.map(([key, score]) => (
              <ScoreBar
                key={key}
                label={SCORE_LABELS[key]}
                score={score}
                icon={SCORE_ICONS[key]}
              />
            ))}
          </div>
        </div>

        {/* 5. Matched tags */}
        {result.matchedTags.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">一致した好みタグ</p>
            <div className="flex flex-wrap gap-2">
              {result.matchedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-900 text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 6. Reasons */}
        <div className="rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">判断理由</p>
          <ul className="space-y-2.5">
            {result.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                <span className="text-sm text-gray-700 leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 7. Risks */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-3">購入リスク</p>
          <ul className="space-y-2.5">
            {result.risks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-sm text-amber-800 leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 8. Confidence */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-gray-400">信頼度</span>
          <span className="text-xs font-semibold text-gray-600">{result.confidence}%</span>
        </div>

        {/* 9. Disclaimer */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 flex gap-3">
          <AlertCircle size={14} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            この分析は1day MVP用のサンプル分析データをもとにした購入判断支援です。実際の市場価格、在庫、真贋、最新トレンドを保証するものではありません。今後、Gemini APIや楽天APIと接続することで、より実データに近い分析へ拡張予定です。
          </p>
        </div>

        {/* Toast */}
        {saveMsg && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg z-50 animate-fade-in">
            {saveMsg}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pb-8">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              saved
                ? 'bg-gray-100 text-gray-400 cursor-default'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
            }`}
          >
            {saved ? (
              <>
                <BookmarkCheck size={16} />
                Wishlist保存済み
              </>
            ) : (
              <>
                <Bookmark size={16} />
                Wishlistに保存
              </>
            )}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onReanalyze}
              className="py-3 rounded-xl font-medium text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={14} />
              再分析
            </button>
            <button
              onClick={onBack}
              className="py-3 rounded-xl font-medium text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} />
              入力に戻る
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
