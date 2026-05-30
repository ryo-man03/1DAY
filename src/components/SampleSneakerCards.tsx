import { SAMPLE_SNEAKERS } from '../data/sneakers';
import { SneakerInput } from '../types';

interface SampleSneakerCardsProps {
  onSelect: (input: SneakerInput) => void;
}

export function SampleSneakerCards({ onSelect }: SampleSneakerCardsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">サンプルで試す</h3>
        <span className="text-xs text-gray-400">タップで自動入力</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SAMPLE_SNEAKERS.map((s) => (
          <button
            key={s.displayName}
            onClick={() => onSelect(s)}
            className="flex flex-col items-start text-left px-3.5 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all group"
          >
            <span className="text-xs font-semibold text-gray-700 leading-snug group-hover:text-gray-900 transition-colors">
              {s.displayName}
            </span>
            <span className="text-[10px] text-gray-400 mt-1">{s.brand}</span>
            <span className="text-[10px] text-gray-500 mt-1.5 font-medium">
              ¥{s.price.toLocaleString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
