import { AnalysisResult, SneakerInput } from '../types';
import { ApiMode, API_MODE_LABELS } from '../lib/analyzeWithMode';
import { ScoreBar } from './ScoreBar';
import { FinalDecisionBadge } from './FinalDecisionBadge';
import { CautionList } from './CautionList';

interface AnalysisResultCardProps {
  result: AnalysisResult;
  input: SneakerInput;
  onReanalyze: () => void;
  actualMode?: ApiMode;
  usedFallback?: boolean;
  geminiEnhanced?: boolean;
  fallbackReason?: string;
}

const TOTAL_LABEL: Record<string, string> = {
  high: 'かなりおすすめ',
  good: 'おすすめ',
  conditional: '条件付きであり',
  careful: '慎重に検討',
  pass: '今は買わなくてよい',
};

function getTotalLabel(score: number): string {
  if (score >= 85) return TOTAL_LABEL.high;
  if (score >= 70) return TOTAL_LABEL.good;
  if (score >= 50) return TOTAL_LABEL.conditional;
  if (score >= 30) return TOTAL_LABEL.careful;
  return TOTAL_LABEL.pass;
}

function getTotalColor(score: number) {
  if (score >= 85) return { ring: 'ring-emerald-300', text: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (score >= 70) return { ring: 'ring-sky-300', text: 'text-sky-600', bg: 'bg-sky-50' };
  if (score >= 50) return { ring: 'ring-amber-300', text: 'text-amber-600', bg: 'bg-amber-50' };
  if (score >= 30) return { ring: 'ring-orange-300', text: 'text-orange-600', bg: 'bg-orange-50' };
  return { ring: 'ring-red-300', text: 'text-red-600', bg: 'bg-red-50' };
}

const SCORE_ITEMS: { key: keyof Pick<AnalysisResult, 'preferenceScore' | 'versatilityScore' | 'cultureScore' | 'trendScore' | 'satisfactionScore' | 'priceScore'>; label: string; reasonKey: keyof AnalysisResult['reasons'] }[] = [
  { key: 'preferenceScore', label: '好みとの相性', reasonKey: 'preference' },
  { key: 'versatilityScore', label: '合わせやすさ', reasonKey: 'versatility' },
  { key: 'cultureScore', label: '文化的価値', reasonKey: 'culture' },
  { key: 'trendScore', label: 'トレンド性', reasonKey: 'trend' },
  { key: 'satisfactionScore', label: '所有満足度', reasonKey: 'satisfaction' },
  { key: 'priceScore', label: '価格納得度', reasonKey: 'price' },
];

export function AnalysisResultCard({ result, input, onReanalyze, actualMode = 'demo', usedFallback = false, geminiEnhanced = false, fallbackReason }: AnalysisResultCardProps) {
  const c = getTotalColor(result.totalRecommendation);

  return (
    <div className="space-y-5 pb-10">
      {/* Header: sneaker info */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">分析対象</p>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          {input.brand} {input.model}
        </h2>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="text-xs text-gray-500">{input.color}</span>
          <span className="text-xs font-semibold text-gray-700">¥{input.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
            {input.purpose}
          </span>
        </div>
        {input.imageUrl && (
          <img
            src={input.imageUrl}
            alt={input.model}
            className="mt-3 w-full max-h-48 object-contain rounded-xl bg-gray-50 border border-gray-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
      </div>

      {/* Analysis mode badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          分析モード: {API_MODE_LABELS[actualMode]}
        </span>
        {geminiEnhanced && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Gemini APIにより理由文を補強しました
          </span>
        )}
        {usedFallback && (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
            Gemini APIに接続できなかったため、デモモードで分析しました
          </span>
        )}
        {usedFallback && fallbackReason && (
          <div className="w-full mt-1 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
            <p className="text-[11px] text-amber-700 leading-relaxed break-all">原因: {fallbackReason}</p>
          </div>
        )}
      </div>

      {/* Total recommendation */}
      <div className={`rounded-2xl ${c.bg} ring-1 ${c.ring} p-6 flex items-center gap-5`}>
        <div className="text-center shrink-0">
          <p className={`text-5xl font-bold leading-none ${c.text}`}>{result.totalRecommendation}</p>
          <p className="text-xs text-gray-400 mt-1">/ 100</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">総合購入推奨度</p>
          <p className={`text-lg font-bold ${c.text}`}>{getTotalLabel(result.totalRecommendation)}</p>
          <p className="text-xs text-gray-500 mt-1 leading-snug">
            好みタグ・文化的価値・価格などを総合的に評価
          </p>
        </div>
      </div>

      {/* Final decision */}
      <FinalDecisionBadge decision={result.finalDecision} />

      {/* Individual scores */}
      <div className="rounded-2xl border border-gray-100 p-5 space-y-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">個別スコアと理由</p>
        {SCORE_ITEMS.map(({ key, label, reasonKey }) => (
          <div key={key}>
            <ScoreBar
              label={label}
              score={result[key]}
              description={result.reasons[reasonKey]}
            />
          </div>
        ))}
      </div>

      {/* Cautions */}
      <CautionList cautions={result.cautions} />

      {/* Disclaimer */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 flex gap-2.5">
        <svg className="shrink-0 mt-0.5 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-xs text-gray-400 leading-relaxed">
          この分析はサンプル分析データをもとにした購入判断支援です。実際の市場価格・在庫・最新トレンドを保証するものではありません。今後、Gemini APIや楽天APIと接続することでより実データに近い分析へ拡張予定です。
        </p>
      </div>

      {/* Re-analyze */}
      <button
        onClick={onReanalyze}
        className="w-full py-3.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        別のスニーカーを分析する
      </button>
    </div>
  );
}
