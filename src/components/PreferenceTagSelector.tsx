import { PreferenceTag, ALL_PREFERENCE_TAGS, TAG_DESCRIPTIONS } from '../types';

interface PreferenceTagSelectorProps {
  selected: PreferenceTag[];
  onChange: (tags: PreferenceTag[]) => void;
}

export function PreferenceTagSelector({ selected, onChange }: PreferenceTagSelectorProps) {
  const MAX = 5;

  function toggle(tag: PreferenceTag) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else if (selected.length >= MAX) {
      // soft warning handled externally via UI state
    } else {
      onChange([...selected, tag]);
    }
  }

  const atMax = selected.length >= MAX;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">好みタグ</h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          atMax ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {selected.length} / {MAX}
        </span>
      </div>

      {atMax && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
          最大5個まで選択できます。変更する場合は選択済みタグをタップして解除してください。
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {ALL_PREFERENCE_TAGS.map((tag) => {
          const isSelected = selected.includes(tag);
          const isDisabled = atMax && !isSelected;
          return (
            <button
              key={tag}
              onClick={() => toggle(tag)}
              disabled={isDisabled}
              title={TAG_DESCRIPTIONS[tag]}
              className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all border ${
                isSelected
                  ? 'bg-gray-900 text-white border-gray-900'
                  : isDisabled
                  ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              {tag}
              {isSelected && (
                <span className="ml-1 text-gray-300 text-[10px]">✕</span>
              )}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {selected.map((tag) => (
            <span key={tag} className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
              {TAG_DESCRIPTIONS[tag]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
