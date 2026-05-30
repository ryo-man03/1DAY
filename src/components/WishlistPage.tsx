import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, ShoppingBag, Clock, XCircle, BookmarkX } from 'lucide-react';
import { WishlistItem, Decision } from '../types';
import { getWishlist, removeFromWishlist, formatDate } from '../lib/wishlist';

interface WishlistPageProps {
  onBack: () => void;
}

function DecisionChip({ decision }: { decision: Decision }) {
  if (decision === 'BUY')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        <ShoppingBag size={10} />
        BUY
      </span>
    );
  if (decision === 'WAIT')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        <Clock size={10} />
        WAIT
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
      <XCircle size={10} />
      SKIP
    </span>
  );
}

export function WishlistPage({ onBack }: WishlistPageProps) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(getWishlist());
  }, []);

  function handleRemove(id: string) {
    removeFromWishlist(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="min-h-screen bg-white">
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
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Wishlist</h2>
          <p className="text-sm text-gray-400 mt-1">{items.length}件保存済み</p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookmarkX size={40} className="text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm">まだ保存されていません</p>
            <p className="text-gray-300 text-xs mt-1">分析結果からWishlistに追加できます</p>
            <button
              onClick={onBack}
              className="mt-6 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              分析を始める
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-100 p-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <DecisionChip decision={item.decision} />
                    <span className="text-xs font-bold text-gray-500">
                      {item.buyScore}
                      <span className="font-normal text-gray-300"> / 100</span>
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 truncate leading-snug">
                    {item.sneakerName}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-gray-400">相性: {item.personalFitLabel}</span>
                    {item.budget && (
                      <span className="text-xs text-gray-400">
                        予算 ¥{item.budget.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-1">{formatDate(item.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all shrink-0"
                  aria-label="削除"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
