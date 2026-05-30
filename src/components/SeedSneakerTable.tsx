import { SEED_SNEAKERS } from '../data/sneakers';

export function SeedSneakerTable() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">初期好みモデル</h3>
        <span className="text-xs text-gray-400">好み傾向の推定データ</span>
      </div>
      <div className="rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5 w-24">ブランド</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">代表モデル</th>
            </tr>
          </thead>
          <tbody>
            {SEED_SNEAKERS.map((seed, i) => (
              <tr
                key={seed.brand}
                className={i < SEED_SNEAKERS.length - 1 ? 'border-b border-gray-50' : ''}
              >
                <td className="px-4 py-3 text-xs font-semibold text-gray-700 whitespace-nowrap">
                  {seed.brand}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {seed.models.map((m) => (
                      <span key={m} className="text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                        {m}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
        このモデル群から、レトロ・クラシック・合わせやすさ・文化的背景を重視する傾向を推定しています。
      </p>
    </div>
  );
}
