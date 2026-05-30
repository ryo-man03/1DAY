interface CautionListProps {
  cautions: string[];
}

export function CautionList({ cautions }: CautionListProps) {
  if (cautions.length === 0) return null;
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
      <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3">注意点</p>
      <ul className="space-y-2.5">
        {cautions.map((c, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <svg className="shrink-0 mt-0.5 text-amber-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-xs text-amber-800 leading-relaxed">{c}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
