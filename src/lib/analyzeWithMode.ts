import { AnalysisResult, SneakerInput, PreferenceTag } from '../types';
import { analyzeSneaker } from './scoring';
import { getApiSettings, hasGeminiKey, hasRakutenKeys } from './apiSettings';
import { generateGeminiSneakerAnalysis, applyGeminiEnhancement } from './geminiClient';

export type ApiMode = 'demo' | 'gemini' | 'rakuten' | 'hybrid';

export interface AnalysisOutput {
  result: AnalysisResult;
  actualMode: ApiMode;
  usedFallback: boolean;
  geminiEnhanced?: boolean;
  fallbackReason?: string;
}

export const API_MODE_LABELS: Record<ApiMode, string> = {
  demo: 'デモモード',
  gemini: 'Gemini 分析モード',
  rakuten: '楽天検索モード',
  hybrid: 'ハイブリッドモード',
};

export const API_MODE_DESCRIPTIONS: Record<ApiMode, string> = {
  demo: 'APIを使わずローカルの仮ロジックで分析します。APIキー不要で常に動作します。',
  gemini: 'Gemini APIを使い、分析理由・文化的背景の文章を生成します（APIキー要）。',
  rakuten: '楽天APIで商品検索・価格情報を取得して分析精度を高めます（APIキー要）。',
  hybrid: 'ローカル分析 + Gemini + 楽天を組み合わせた最高精度モードです（APIキー要）。',
};

function demoOutput(input: SneakerInput, tags: PreferenceTag[]): AnalysisOutput {
  return { result: analyzeSneaker(input, tags), actualMode: 'demo', usedFallback: false };
}

function fallbackOutput(input: SneakerInput, tags: PreferenceTag[]): AnalysisOutput {
  return { result: analyzeSneaker(input, tags), actualMode: 'demo', usedFallback: true };
}

// Extension point: replace stub bodies with real API calls when keys are available

async function runGeminiMode(input: SneakerInput, tags: PreferenceTag[]): Promise<AnalysisOutput> {
  const settings = getApiSettings();
  if (!hasGeminiKey(settings)) {
    return { result: analyzeSneaker(input, tags), actualMode: 'demo', usedFallback: true, fallbackReason: 'Gemini APIキーが未設定です。管理パネルでキーを保存してください。' };
  }

  const localResult = analyzeSneaker(input, tags);
  try {
    const enhancement = await generateGeminiSneakerAnalysis(input, tags, localResult);
    const enhanced = applyGeminiEnhancement(localResult, enhancement);
    return { result: enhanced, actualMode: 'gemini', usedFallback: false, geminiEnhanced: true };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error('[runGeminiMode] Gemini failed, falling back to demo:', reason);
    return { result: localResult, actualMode: 'demo', usedFallback: true, geminiEnhanced: false, fallbackReason: reason };
  }
}

async function runRakutenMode(input: SneakerInput, tags: PreferenceTag[]): Promise<AnalysisOutput> {
  const settings = getApiSettings();
  if (!hasRakutenKeys(settings)) return fallbackOutput(input, tags);

  // Future implementation:
  // const rakutenData = await searchRakuten(settings.rakutenAppId!, input.brand + ' ' + input.model);
  // return { result: mergeWithRakuten(analyzeSneaker(input, tags), rakutenData), actualMode: 'rakuten', usedFallback: false };

  return fallbackOutput(input, tags);
}

async function runHybridMode(input: SneakerInput, tags: PreferenceTag[]): Promise<AnalysisOutput> {
  const settings = getApiSettings();
  const hasGemini = hasGeminiKey(settings);
  const hasRakuten = hasRakutenKeys(settings);

  if (!hasGemini && !hasRakuten) return fallbackOutput(input, tags);

  // Future: combine Gemini + Rakuten + local analysis
  return fallbackOutput(input, tags);
}

export async function analyzeSneakerWithMode(
  input: SneakerInput,
  selectedTags: PreferenceTag[],
  mode: ApiMode
): Promise<AnalysisOutput> {
  try {
    if (mode === 'demo') return demoOutput(input, selectedTags);
    if (mode === 'gemini') return await runGeminiMode(input, selectedTags);
    if (mode === 'rakuten') return await runRakutenMode(input, selectedTags);
    if (mode === 'hybrid') return await runHybridMode(input, selectedTags);
    return demoOutput(input, selectedTags);
  } catch {
    return fallbackOutput(input, selectedTags);
  }
}
