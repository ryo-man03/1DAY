import { FinalDecision } from '../types';

interface FinalDecisionBadgeProps {
  decision: FinalDecision;
}

const CONFIG: Record<FinalDecision, { bg: string; text: string; border: string; dot: string; sub: string }> = {
  '今買ってよい': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
    sub: '好みとの相性・価格・文化的価値すべてにおいて購入を推奨できます。',
  },
  '価格次第で買ってよい': {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-400',
    sub: '魅力は高いですが、価格に注意。定価や適正価格での購入をおすすめします。',
  },
  'セール待ち': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
    sub: '今すぐ買わずに、セールや価格下落のタイミングを待つのがベターです。',
  },
  '似たモデルと比較した方がよい': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-400',
    sub: '他の選択肢も含めて、より好みに近いモデルを比較検討してみてください。',
  },
  '今は買わなくてよい': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-400',
    sub: '現時点での購入は見送りを推奨。好みや用途との乖離が大きい可能性があります。',
  },
};

export function FinalDecisionBadge({ decision }: FinalDecisionBadgeProps) {
  const c = CONFIG[decision];
  return (
    <div className={`rounded-2xl border ${c.bg} ${c.border} p-5`}>
      <div className="flex items-center gap-2.5 mb-2">
        <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">最終判断</p>
      </div>
      <p className={`text-xl font-bold ${c.text} mb-1.5`}>{decision}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{c.sub}</p>
    </div>
  );
}
