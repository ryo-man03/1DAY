import { useState } from 'react';
import { SneakerInput } from '../types';
import { PURPOSE_OPTIONS } from '../data/sneakers';

interface SneakerFormProps {
  initialValues?: SneakerInput;
  onSubmit: (input: SneakerInput) => void;
}

type FormErrors = Partial<Record<keyof SneakerInput, string>>;

const EMPTY_FORM: SneakerInput = {
  brand: '',
  model: '',
  color: '',
  price: 0,
  purpose: '普段履き',
  reason: '',
  imageUrl: '',
  memo: '',
};

export function SneakerForm({ initialValues, onSubmit }: SneakerFormProps) {
  const [form, setForm] = useState<SneakerInput>(initialValues ?? EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function set<K extends keyof SneakerInput>(key: K, value: SneakerInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.brand.trim()) e.brand = 'ブランド名を入力してください';
    if (!form.model.trim()) e.model = 'モデル名を入力してください';
    if (!form.color.trim()) e.color = 'カラーを入力してください';
    if (!form.price || form.price <= 0) e.price = '価格を入力してください';
    if (!form.reason.trim()) e.reason = '気になっている理由を入力してください';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1400));
    onSubmit(form);
    setIsAnalyzing(false);
  }

  // Re-sync if initialValues change (sample selection)
  useState(() => {
    if (initialValues) setForm(initialValues);
  });

  const inputCls = (err?: string) =>
    `w-full px-3.5 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 transition-all ${
      err
        ? 'border-red-300 focus:ring-red-100'
        : 'border-gray-200 focus:ring-gray-100 focus:border-gray-400'
    }`;

  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5';

  return (
    <div className="space-y-5">
      {/* Brand + Model */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>ブランド名 *</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => set('brand', e.target.value)}
            placeholder="Nike"
            className={inputCls(errors.brand)}
          />
          {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand}</p>}
        </div>
        <div>
          <label className={labelCls}>モデル名 *</label>
          <input
            type="text"
            value={form.model}
            onChange={(e) => set('model', e.target.value)}
            placeholder="Air Jordan 1 High OG"
            className={inputCls(errors.model)}
          />
          {errors.model && <p className="mt-1 text-xs text-red-500">{errors.model}</p>}
        </div>
      </div>

      {/* Color + Price */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>カラー *</label>
          <input
            type="text"
            value={form.color}
            onChange={(e) => set('color', e.target.value)}
            placeholder="Black / White"
            className={inputCls(errors.color)}
          />
          {errors.color && <p className="mt-1 text-xs text-red-500">{errors.color}</p>}
        </div>
        <div>
          <label className={labelCls}>価格 *</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={form.price || ''}
              onChange={(e) => set('price', Number(e.target.value))}
              placeholder="20000"
              className={`${inputCls(errors.price)} pl-7`}
            />
          </div>
          {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className={labelCls}>使用目的</label>
        <select
          value={form.purpose}
          onChange={(e) => set('purpose', e.target.value)}
          className={inputCls()}
        >
          {PURPOSE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Reason */}
      <div>
        <label className={labelCls}>気になっている理由 *</label>
        <textarea
          value={form.reason}
          onChange={(e) => set('reason', e.target.value)}
          placeholder="デザインが好き、コーデに合いそう、限定モデルだから、など"
          rows={3}
          className={`${inputCls(errors.reason)} resize-none`}
        />
        {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason}</p>}
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className={labelCls}>画像URL（任意）</label>
          <input
            type="url"
            value={form.imageUrl ?? ''}
            onChange={(e) => set('imageUrl', e.target.value)}
            placeholder="https://..."
            className={inputCls()}
          />
        </div>
        <div>
          <label className={labelCls}>メモ（任意）</label>
          <input
            type="text"
            value={form.memo ?? ''}
            onChange={(e) => set('memo', e.target.value)}
            placeholder="気になる点、比較したいモデルなど"
            className={inputCls()}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isAnalyzing}
        className="w-full py-4 rounded-xl font-semibold text-base bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isAnalyzing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            分析中...
          </>
        ) : (
          '分析する'
        )}
      </button>
    </div>
  );
}
