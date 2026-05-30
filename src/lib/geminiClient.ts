import { AnalysisResult, SneakerInput, PreferenceTag } from '../types';
import { getApiSettings } from './apiSettings';

export interface GeminiEnhancement {
  enhancedSummary: string;
  enhancedReasons: {
    preference: string;
    versatility: string;
    culture: string;
    trend: string;
    satisfaction: string;
    price: string;
  };
  enhancedCautions: string[];
}

function buildPrompt(
  input: SneakerInput,
  tags: PreferenceTag[],
  localResult: AnalysisResult
): string {
  return `あなたはスニーカーの購入判断を支援するAIアシスタントです。
以下の情報をもとに、購入判断の補強テキストをJSON形式で生成してください。

【スニーカー情報】
- ブランド: ${input.brand}
- モデル: ${input.model}
- カラー: ${input.color}
- 価格: ¥${input.price.toLocaleString()}
- 用途: ${input.purpose}
- 購入理由: ${input.reason}

【ユーザーの好みタグ】
${tags.length > 0 ? tags.join('、') : '未選択'}

【ローカル分析スコア】
- 総合推奨度: ${localResult.totalRecommendation}/100
- 好みとの相性: ${localResult.preferenceScore}
- 合わせやすさ: ${localResult.versatilityScore}
- 文化的価値: ${localResult.cultureScore}
- トレンド性: ${localResult.trendScore}
- 所有満足度: ${localResult.satisfactionScore}
- 価格納得度: ${localResult.priceScore}
- 最終判断: ${localResult.finalDecision}

以下のJSON形式のみで出力してください（前後に余分なテキストや\`\`\`は不要）:
{
  "enhancedSummary": "総合的な説明（2〜3文、日本語）",
  "enhancedReasons": {
    "preference": "好みとの相性の補強説明（1〜2文、日本語）",
    "versatility": "合わせやすさの補強説明（1〜2文、日本語）",
    "culture": "文化的背景の補強説明（1〜2文、日本語）",
    "trend": "トレンド性の補強説明（1〜2文、日本語）",
    "satisfaction": "所有満足度の補強説明（1〜2文、日本語）",
    "price": "価格納得度の補強説明（1〜2文、日本語）"
  },
  "enhancedCautions": [
    "注意点1（日本語）",
    "注意点2（日本語）",
    "注意点3（日本語）"
  ]
}`;
}

function resolveApiKey(): string | null {
  return getApiSettings().geminiApiKey ?? null;
}

function parseGeminiResponse(text: string): GeminiEnhancement {
  // Strip markdown code fences if present
  const stripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON object found in response. Raw: ${text.slice(0, 200)}`);
  return JSON.parse(jsonMatch[0]) as GeminiEnhancement;
}

const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-proxy`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function generateGeminiSneakerAnalysis(
  input: SneakerInput,
  tags: PreferenceTag[],
  localResult: AnalysisResult
): Promise<GeminiEnhancement> {
  const apiKey = resolveApiKey();

  if (!apiKey) {
    console.error('[geminiClient] No API key found (sessionStorage key: SOLE_MATRIX_GEMINI_API_KEY)');
    throw new Error('Gemini API key not set');
  }

  console.log('[geminiClient] Calling proxy:', PROXY_URL);

  const prompt = buildPrompt(input, tags, localResult);

  let res: Response;
  try {
    res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ apiKey, prompt }),
    });
  } catch (networkErr) {
    console.error('[geminiClient] Network error reaching proxy:', networkErr);
    throw new Error(`Network error: ${networkErr}`);
  }

  const rawText = await res.text();
  console.log(`[geminiClient] Proxy response status=${res.status}, body=${rawText.slice(0, 300)}`);

  if (!res.ok) {
    console.error(`[geminiClient] Proxy returned ${res.status}:`, rawText);
    throw new Error(`Proxy error ${res.status}: ${rawText}`);
  }

  let data: { text?: string; error?: string; detail?: unknown };
  try {
    data = JSON.parse(rawText);
  } catch {
    console.error('[geminiClient] Failed to parse proxy response as JSON:', rawText);
    throw new Error('Proxy returned invalid JSON');
  }

  if (data.error) {
    console.error('[geminiClient] Proxy reported error:', data.error, data.detail);
    throw new Error(`Proxy error: ${data.error}`);
  }

  if (!data.text) {
    console.error('[geminiClient] Proxy returned no text field:', data);
    throw new Error('Proxy returned empty text');
  }

  console.log('[geminiClient] Raw Gemini text:', data.text.slice(0, 300));

  return parseGeminiResponse(data.text);
}

export function applyGeminiEnhancement(
  base: AnalysisResult,
  enhancement: GeminiEnhancement
): AnalysisResult {
  return {
    ...base,
    reasons: {
      preference: enhancement.enhancedReasons?.preference || base.reasons.preference,
      versatility: enhancement.enhancedReasons?.versatility || base.reasons.versatility,
      culture: enhancement.enhancedReasons?.culture || base.reasons.culture,
      trend: enhancement.enhancedReasons?.trend || base.reasons.trend,
      satisfaction: enhancement.enhancedReasons?.satisfaction || base.reasons.satisfaction,
      price: enhancement.enhancedReasons?.price || base.reasons.price,
    },
    cautions:
      enhancement.enhancedCautions?.length > 0
        ? enhancement.enhancedCautions
        : base.cautions,
  };
}
