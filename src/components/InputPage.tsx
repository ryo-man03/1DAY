import { useState } from 'react';
import { Search, Tag, DollarSign, Zap, ChevronRight, BookmarkIcon } from 'lucide-react';
import { AnalysisInput, PreferenceTag } from '../types';
import { DEMO_SNEAKERS, PREFERENCE_TAGS } from '../data/sneakers';

interface InputPageProps {
  onAnalyze: (input: AnalysisInput) => void;
  onViewWishlist: () => void;
}

export function InputPage({ onAnalyze, onViewWishlist }: InputPageProps) {
  const [sneakerName, setSneakerName] = useState('');
  const [selectedTags, setSelectedTags] = useState<PreferenceTag[]>([]);
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState<{ sneakerName?: string; budget?: string }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function toggleTag(tag: PreferenceTag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function loadDemo(index: number) {
    const model = DEMO_SNEAKERS[index];
    setSneakerName(model.sneakerName);
    setSelectedTags([...model.styleTags]);
    setBudget(String(model.referencePrice));
    setErrors({});
  }

  function validate(): boolean {
    const newErrors: { sneakerName?: string; budget?: string } = {};
    if (!sneakerName.trim()) {
      newErrors.sneakerName = 'スニーカー名を入力してください';
    }
    if (budget && isNaN(Number(budget))) {
      newErrors.budget = '予算は数値で入力してください';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleAnalyze() {
    if (!validate()) return;
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const matchedModel = DEMO_SNEAKERS.find((m) => m.sneakerName === sneakerName) ?? undefined;
    onAnalyze({
      sneakerName: sneakerName.trim(),
      preferenceTags: selectedTags,
      budget: budget ? Number(budget) : undefined,
      matchedModel,
    });
    setIsAnalyzing(false);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">SOLE//MATRIX</h1>
            <p className="text-xs text-gray-400 mt-0.5">1day MVP 購入判断支援</p>
          </div>
          <button
            onClick={onViewWishlist}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            <BookmarkIcon size={15} />
            Wishlist
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 mb-5">
            <Zap size={12} className="text-amber-500" />
            <span className="text-xs text-gray-500 font-medium">サンプル分析データ使用</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight mb-3">
            そのスニーカー、<br />
            本当に買うべき？
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            好み・予算・モデル特性から整理して、<br />
            <strong className="text-gray-700">BUY / WAIT / SKIP</strong> で購入判断を支援します。
          </p>
        </div>

        {/* Demo buttons */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">デモ用サンプルを選ぶ</p>
          <div className="flex flex-col gap-2">
            {DEMO_SNEAKERS.map((model, i) => (
              <button
                key={model.sneakerName}
                onClick={() => loadDemo(i)}
                className="flex items-center justify-between w-full text-left px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-200 transition-all group"
              >
                <div>
                  <span className="text-sm font-medium text-gray-800">{model.sneakerName}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    ¥{model.referencePrice.toLocaleString()}
                  </span>
                </div>
                <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Sneaker name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Search size={14} />
              スニーカー名
            </label>
            <input
              type="text"
              value={sneakerName}
              onChange={(e) => {
                setSneakerName(e.target.value);
                if (errors.sneakerName) setErrors((p) => ({ ...p, sneakerName: undefined }));
              }}
              placeholder="例: adidas Samba OG"
              className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.sneakerName
                  ? 'border-red-300 focus:ring-red-100'
                  : 'border-gray-200 focus:ring-gray-100 focus:border-gray-400'
              }`}
            />
            {errors.sneakerName && (
              <p className="mt-1.5 text-xs text-red-500">{errors.sneakerName}</p>
            )}
          </div>

          {/* Preference tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Tag size={14} />
              好みタグ（複数選択可）
            </label>
            <div className="flex flex-wrap gap-2">
              {PREFERENCE_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <DollarSign size={14} />
              予算（任意）
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
              <input
                type="text"
                inputMode="numeric"
                value={budget}
                onChange={(e) => {
                  setBudget(e.target.value);
                  if (errors.budget) setErrors((p) => ({ ...p, budget: undefined }));
                }}
                placeholder="例: 20000"
                className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.budget
                    ? 'border-red-300 focus:ring-red-100'
                    : 'border-gray-200 focus:ring-gray-100 focus:border-gray-400'
                }`}
              />
            </div>
            {errors.budget && (
              <p className="mt-1.5 text-xs text-red-500">{errors.budget}</p>
            )}
          </div>

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-4 rounded-xl font-semibold text-base transition-all bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <Zap size={16} />
                Analyze
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
