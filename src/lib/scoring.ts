import {
  AnalysisResult,
  AnalysisReasons,
  FinalDecision,
  PreferenceTag,
  SneakerInput,
  AiContext,
} from '../types';
import { SEED_SNEAKERS, INFERRED_USER_PREFERENCE } from '../data/sneakers';

// ─── Sneaker characteristic database ─────────────────────────────────────────

interface SneakerProfile {
  naturalTags: PreferenceTag[];
  baseVersatility: number;
  baseCulture: number;
  baseTrend: number;
  colorProfile: 'neutral' | 'bold' | 'monochrome';
  silhouette: 'slim' | 'chunky' | 'mid' | 'high';
}

const SNEAKER_DB: Record<string, SneakerProfile> = {
  'air jordan 1 high og bred': {
    naturalTags: ['レトロ', 'ストリート', '文化的背景', '派手め'],
    baseVersatility: 68,
    baseCulture: 96,
    baseTrend: 85,
    colorProfile: 'bold',
    silhouette: 'high',
  },
  'air jordan 1': {
    naturalTags: ['レトロ', 'ストリート', '文化的背景'],
    baseVersatility: 70,
    baseCulture: 93,
    baseTrend: 82,
    colorProfile: 'bold',
    silhouette: 'high',
  },
  'dunk low panda': {
    naturalTags: ['シンプル', '合わせやすさ', '落ち着いた色'],
    baseVersatility: 88,
    baseCulture: 70,
    baseTrend: 72,
    colorProfile: 'monochrome',
    silhouette: 'mid',
  },
  'dunk low': {
    naturalTags: ['レトロ', 'ストリート', '合わせやすさ'],
    baseVersatility: 80,
    baseCulture: 72,
    baseTrend: 74,
    colorProfile: 'neutral',
    silhouette: 'mid',
  },
  'samba og': {
    naturalTags: ['レトロ', 'クラシック', '合わせやすさ', '細身シルエット'],
    baseVersatility: 90,
    baseCulture: 84,
    baseTrend: 92,
    colorProfile: 'neutral',
    silhouette: 'slim',
  },
  'superstar': {
    naturalTags: ['クラシック', '合わせやすさ', '落ち着いた色'],
    baseVersatility: 85,
    baseCulture: 86,
    baseTrend: 65,
    colorProfile: 'monochrome',
    silhouette: 'slim',
  },
  '990v3': {
    naturalTags: ['クラシック', 'アメカジ', '落ち着いた色', '合わせやすさ'],
    baseVersatility: 88,
    baseCulture: 88,
    baseTrend: 76,
    colorProfile: 'neutral',
    silhouette: 'chunky',
  },
  '2002': {
    naturalTags: ['レトロ', 'クラシック', '落ち着いた色'],
    baseVersatility: 82,
    baseCulture: 80,
    baseTrend: 72,
    colorProfile: 'neutral',
    silhouette: 'chunky',
  },
  'suede vtg': {
    naturalTags: ['レトロ', 'ストリート', '文化的背景'],
    baseVersatility: 78,
    baseCulture: 82,
    baseTrend: 68,
    colorProfile: 'neutral',
    silhouette: 'slim',
  },
  'speedcat': {
    naturalTags: ['レトロ', '文化的背景', '細身シルエット'],
    baseVersatility: 72,
    baseCulture: 78,
    baseTrend: 84,
    colorProfile: 'bold',
    silhouette: 'slim',
  },
  'all star': {
    naturalTags: ['クラシック', 'シンプル', 'アメカジ', '合わせやすさ'],
    baseVersatility: 88,
    baseCulture: 90,
    baseTrend: 62,
    colorProfile: 'neutral',
    silhouette: 'high',
  },
  'one star': {
    naturalTags: ['クラシック', 'ストリート', 'シンプル'],
    baseVersatility: 82,
    baseCulture: 85,
    baseTrend: 68,
    colorProfile: 'neutral',
    silhouette: 'slim',
  },
  'authentic': {
    naturalTags: ['シンプル', 'アメカジ', '合わせやすさ', '落ち着いた色'],
    baseVersatility: 90,
    baseCulture: 80,
    baseTrend: 60,
    colorProfile: 'neutral',
    silhouette: 'slim',
  },
  'half cab': {
    naturalTags: ['ストリート', 'アメカジ', 'クラシック', '文化的背景'],
    baseVersatility: 80,
    baseCulture: 88,
    baseTrend: 65,
    colorProfile: 'neutral',
    silhouette: 'mid',
  },
};

function findSneakerProfile(brand: string, model: string): SneakerProfile | null {
  const key = `${model}`.toLowerCase();
  for (const [dbKey, profile] of Object.entries(SNEAKER_DB)) {
    if (key.includes(dbKey)) return profile;
  }
  return null;
}

// ─── Tag weight system ────────────────────────────────────────────────────────

interface TagWeights {
  preference: number;
  versatility: number;
  culture: number;
  trend: number;
  satisfaction: number;
}

function computeTagWeights(tags: PreferenceTag[]): TagWeights {
  const weights: TagWeights = { preference: 1, versatility: 1, culture: 1, trend: 1, satisfaction: 1 };

  for (const tag of tags) {
    switch (tag) {
      case 'レトロ':
        weights.culture *= 1.25;
        weights.trend *= 0.9;
        break;
      case 'シンプル':
        weights.versatility *= 1.3;
        weights.preference *= 1.1;
        break;
      case 'ストリート':
        weights.culture *= 1.2;
        weights.trend *= 1.15;
        break;
      case 'アメカジ':
        weights.versatility *= 1.15;
        weights.culture *= 1.1;
        break;
      case '合わせやすさ':
        weights.versatility *= 1.35;
        weights.satisfaction *= 1.1;
        break;
      case 'クラシック':
        weights.culture *= 1.25;
        weights.trend *= 0.85;
        weights.satisfaction *= 1.1;
        break;
      case 'スポーティー':
        weights.trend *= 1.1;
        weights.versatility *= 1.1;
        break;
      case 'ボリューム感':
        weights.trend *= 1.15;
        weights.preference *= 1.1;
        break;
      case '細身シルエット':
        weights.versatility *= 1.2;
        weights.preference *= 1.1;
        break;
      case '派手め':
        weights.trend *= 1.2;
        weights.preference *= 1.15;
        break;
      case '落ち着いた色':
        weights.versatility *= 1.25;
        weights.satisfaction *= 1.15;
        break;
      case '文化的背景':
        weights.culture *= 1.35;
        weights.satisfaction *= 1.1;
        break;
    }
  }

  return weights;
}

// ─── Individual score calculators ────────────────────────────────────────────

export function calculatePreferenceScore(
  selectedTags: PreferenceTag[],
  profile: SneakerProfile | null,
  inferredPrefs: PreferenceTag[]
): number {
  if (!profile) {
    const overlap = selectedTags.filter((t) => inferredPrefs.includes(t)).length;
    return Math.min(70, 45 + overlap * 8);
  }

  const allUserTags = Array.from(new Set([...selectedTags, ...inferredPrefs.slice(0, 4)]));
  const matched = allUserTags.filter((t) => profile.naturalTags.includes(t));
  const base = profile.naturalTags.length > 0
    ? (matched.length / profile.naturalTags.length) * 100
    : 50;
  return Math.round(Math.min(98, Math.max(30, base)));
}

export function calculateVersatilityScore(
  selectedTags: PreferenceTag[],
  profile: SneakerProfile | null,
  color: string
): number {
  let base = profile ? profile.baseVersatility : 65;

  const colorLower = color.toLowerCase();
  const isNeutralColor =
    colorLower.includes('black') ||
    colorLower.includes('white') ||
    colorLower.includes('grey') ||
    colorLower.includes('gray') ||
    colorLower.includes('navy') ||
    colorLower.includes('brown') ||
    colorLower.includes('ブラック') ||
    colorLower.includes('ホワイト') ||
    colorLower.includes('グレー') ||
    colorLower.includes('黒') ||
    colorLower.includes('白');

  if (isNeutralColor) base = Math.min(100, base + 6);
  else base = Math.max(30, base - 5);

  if (selectedTags.includes('合わせやすさ') && profile?.colorProfile === 'neutral') base += 5;
  if (selectedTags.includes('落ち着いた色') && !isNeutralColor) base -= 8;
  if (selectedTags.includes('派手め') && profile?.colorProfile === 'bold') base += 6;

  return Math.round(Math.min(98, Math.max(25, base)));
}

export function calculateCultureScore(
  selectedTags: PreferenceTag[],
  profile: SneakerProfile | null
): number {
  let base = profile ? profile.baseCulture : 55;

  if (selectedTags.includes('文化的背景')) base = Math.min(100, base + 8);
  if (selectedTags.includes('クラシック')) base = Math.min(100, base + 5);
  if (selectedTags.includes('レトロ') && profile?.naturalTags.includes('レトロ')) base += 4;

  return Math.round(Math.min(98, Math.max(25, base)));
}

export function calculateTrendScore(
  selectedTags: PreferenceTag[],
  profile: SneakerProfile | null
): number {
  let base = profile ? profile.baseTrend : 60;

  if (selectedTags.includes('クラシック')) base = Math.min(100, base * 0.9);
  if (selectedTags.includes('ストリート') && profile?.naturalTags.includes('ストリート')) base += 6;
  if (selectedTags.includes('スポーティー')) base = Math.min(100, base + 5);
  if (selectedTags.includes('派手め') && profile?.colorProfile === 'bold') base += 5;

  return Math.round(Math.min(98, Math.max(20, base)));
}

export function calculateSatisfactionScore(
  totalScore: number,
  preferenceScore: number,
  purpose: string,
  profile: SneakerProfile | null
): number {
  let base = Math.round((totalScore * 0.5 + preferenceScore * 0.5));

  if (purpose === 'コレクション' && profile?.baseCulture && profile.baseCulture >= 80) base += 8;
  if ((purpose === 'アメカジ' || purpose.includes('アメカジ')) && profile?.naturalTags.includes('アメカジ')) base += 6;
  if ((purpose === 'ストリート' || purpose.includes('ストリート')) && profile?.naturalTags.includes('ストリート')) base += 6;
  if (purpose === '普段履き' && profile?.baseVersatility && profile.baseVersatility >= 80) base += 5;

  return Math.round(Math.min(98, Math.max(20, base)));
}

export function calculatePriceScore(price: number): number {
  if (price <= 0) return 65;
  if (price <= 10000) return 92;
  if (price <= 15000) return 84;
  if (price <= 20000) return 78;
  if (price <= 30000) return 68;
  if (price <= 40000) return 56;
  if (price <= 55000) return 44;
  return 30;
}

// ─── Reason text generator ────────────────────────────────────────────────────

function makePreferenceReason(score: number, tags: PreferenceTag[], profile: SneakerProfile | null): string {
  const tagStr = tags.slice(0, 3).join('・');
  if (score >= 80) {
    return `選択された「${tagStr}」などのタグとの一致度が非常に高いです。${profile ? `このモデルは${profile.naturalTags.slice(0, 2).join('・')}の要素を体現しており、` : ''}あなたのスタイルにぴったりフィットするでしょう。普段の服装や好みの方向性とも自然に調和します。`;
  }
  if (score >= 60) {
    return `「${tagStr}」との相性はまずまずです。いくつかの観点では好みに合いますが、すべてのタグが完全にマッチするわけではありません。気になる点を重点的に確認してみてください。`;
  }
  if (score >= 40) {
    return `好みタグとの一致は中程度です。このモデルはあなたの主要な好みとは少し方向性が異なる部分もあります。購入前に実際に試着して確認することをおすすめします。`;
  }
  return `選択されたタグとの一致度は低めです。このスニーカーのスタイルや特性は、現在の好みとは方向性が異なる可能性があります。より好みに合ったモデルも検討してみてください。`;
}

function makeVersatilityReason(score: number, color: string, profile: SneakerProfile | null): string {
  if (score >= 80) {
    return `カラーリング（${color}）とシルエットのバランスが良く、幅広いコーディネートに対応できます。デニム、チノパン、スウェット系など多様なスタイルと合わせやすく、日常的に活躍してくれるでしょう。`;
  }
  if (score >= 60) {
    return `一定の合わせやすさがあり、多くのスタイルに対応できます。ただし、カラーが個性的な場合は服装を選ぶ場面もあるかもしれません。手持ちのアイテムとの相性を確認してみてください。`;
  }
  if (score >= 40) {
    return `合わせやすさはやや限定的です。特定のスタイル（ストリートやカジュアル系など）では活躍しますが、きれいめコーデや汎用的な使い方には工夫が必要かもしれません。`;
  }
  return `このモデルはコーディネートを選ぶ傾向があります。スタイルが強めで、特定のテイストのファッションとは相性が良い反面、汎用性はやや低めです。着用シーンをあらかじめ想定しておくと良いでしょう。`;
}

function makeCultureReason(score: number, brand: string, model: string): string {
  if (score >= 85) {
    return `${brand} ${model}は非常に高い文化的価値を持つモデルです。スポーツ・音楽・ストリートカルチャーの歴史の中で重要な位置を占めており、スニーカー文化を知るうえでも意義のある一足です。長期的な価値も期待できます。`;
  }
  if (score >= 65) {
    return `文化的背景はしっかりしており、${brand}のヘリテージを感じさせるモデルです。ブランドの歴史や着用アーティスト・選手など、背景を知ることでより深く楽しめるでしょう。`;
  }
  if (score >= 45) {
    return `文化的な背景は中程度です。ブランドとしての認知度は高いですが、このモデル自体の歴史的価値はやや限定的かもしれません。デザイン面での魅力と合わせて判断してください。`;
  }
  return `このモデルは文化的価値よりも機能性やデザイン面での魅力が強いタイプです。歴史的背景への関心が高い方には、より文化的意義の深いモデルも検討する価値があります。`;
}

function makeTrendReason(score: number, model: string): string {
  if (score >= 80) {
    return `現在、${model}は非常に高いトレンド評価を受けています。SNSでの露出も多く、ファッション誌や街中でも目にする機会が増えています。ただし、人気が高い分、価格高騰や入手困難にも注意が必要です。`;
  }
  if (score >= 60) {
    return `トレンド的には安定した人気を維持しています。流行の中心というよりも、時代を問わず評価され続けるモデルに近いため、長く使える安心感があります。`;
  }
  if (score >= 40) {
    return `トレンド性はやや控えめですが、それが逆に「人と被りにくい」という魅力にもなります。流行を気にしすぎず、自分のスタイルに合うかどうかを基準に判断してください。`;
  }
  return `現時点ではトレンドから少し距離があるモデルです。クラシックな価値観や個人の好みを優先するなら問題ありませんが、流行感を重視するなら他のモデルも比較してみてください。`;
}

function makeSatisfactionReason(score: number, purpose: string): string {
  if (score >= 80) {
    return `「${purpose}」という用途と好みタグを総合的に考えると、購入後の満足度は高い水準が期待できます。デイリーユースでもコレクションとしても、しっかりと価値を感じられるモデルでしょう。`;
  }
  if (score >= 60) {
    return `「${purpose}」での使用を想定すると、概ね満足できる選択肢です。ただし、類似の役割を持つモデルが手持ちにある場合は、追加購入の必要性を再考してみてください。`;
  }
  if (score >= 40) {
    return `満足度はケースバイケースです。「${purpose}」として使う頻度や、他のスニーカーとのバランスを考えてから判断することをおすすめします。`;
  }
  return `購入後の満足度はやや不確定です。用途と好みのギャップがある可能性があるため、試着や詳細なレビューの確認を強くおすすめします。`;
}

function makePriceReason(score: number, price: number): string {
  const priceStr = `¥${price.toLocaleString()}`;
  if (score >= 80) {
    return `${priceStr}という価格は、このジャンルのスニーカーとして非常にコストパフォーマンスが高いです。品質・デザイン・文化的価値を考慮しても、納得できる価格帯と言えるでしょう。`;
  }
  if (score >= 60) {
    return `${priceStr}は適正価格の範囲内です。ブランドとモデルの価値を考えると妥当ですが、セールや定価での購入タイミングを見極めることで、さらにお得に入手できる可能性もあります。`;
  }
  if (score >= 40) {
    return `${priceStr}はやや高めに感じる水準です。定価なのかプレミア価格なのかを確認し、他の販路での価格比較もしてみてください。コレクション目的でなければ、セール時を狙うのもひとつの手です。`;
  }
  return `${priceStr}はこのモデルに対してかなり高い水準です。プレミア価格がついている可能性が高く、価格が落ち着くのを待つか、別の購入手段を探すことを強くおすすめします。`;
}

// ─── Caution generator ───────────────────────────────────────────────────────

function generateCautions(
  input: SneakerInput,
  profile: SneakerProfile | null,
  selectedTags: PreferenceTag[],
  scores: { versatility: number; culture: number; trend: number; price: number }
): string[] {
  const cautions: string[] = [];

  if (scores.versatility < 65) {
    cautions.push('服装との相性を選ぶモデルです。手持ちのアイテムと実際に合わせてから判断することをおすすめします。');
  }

  if (scores.trend >= 85) {
    cautions.push('現在トレンドが高く、プレミア価格がついている可能性があります。価格推移を確認してください。');
  }

  if (scores.price < 50) {
    cautions.push('価格が高めです。セール時や定価販売のタイミングを待つことも検討してください。');
  }

  if (profile && profile.colorProfile === 'bold' && selectedTags.includes('落ち着いた色')) {
    cautions.push('カラーが派手めで、落ち着いた色を好む傾向とやや相性が合わない可能性があります。');
  }

  if (profile && profile.silhouette === 'high' && selectedTags.includes('細身シルエット')) {
    cautions.push('ハイカットのシルエットは、細身のコーデとバランスを取るのにコツが必要な場合があります。');
  }

  if (scores.trend < 50) {
    cautions.push('流行の旬は過ぎている可能性があります。ただし、クラシックな価値として長く使えるモデルである可能性もあります。');
  }

  if (input.purpose === 'コレクション' && scores.culture < 60) {
    cautions.push('コレクション目的には、より文化的価値が高いモデルも検討する価値があります。');
  }

  if (cautions.length === 0) {
    cautions.push('特に大きな注意点はありませんが、サイズ感は試着や購入者レビューで事前に確認しておくと安心です。');
  }

  return cautions.slice(0, 4);
}

// ─── Final decision ───────────────────────────────────────────────────────────

function getFinalDecision(total: number, priceScore: number): FinalDecision {
  if (total >= 82 && priceScore >= 60) return '今買ってよい';
  if (total >= 70 && priceScore < 60) return '価格次第で買ってよい';
  if (total >= 70) return '今買ってよい';
  if (total >= 58) return 'セール待ち';
  if (total >= 42) return '似たモデルと比較した方がよい';
  return '今は買わなくてよい';
}

// ─── Main analyzer ────────────────────────────────────────────────────────────

export function analyzeSneaker(
  input: SneakerInput,
  selectedTags: PreferenceTag[]
): AnalysisResult {
  const profile = findSneakerProfile(input.brand, input.model);
  const tagWeights = computeTagWeights(selectedTags);

  const rawPreference = calculatePreferenceScore(selectedTags, profile, INFERRED_USER_PREFERENCE);
  const rawVersatility = calculateVersatilityScore(selectedTags, profile, input.color);
  const rawCulture = calculateCultureScore(selectedTags, profile);
  const rawTrend = calculateTrendScore(selectedTags, profile);
  const rawPrice = calculatePriceScore(input.price);

  const preferenceScore = Math.round(Math.min(98, rawPreference * Math.min(tagWeights.preference, 1.4)));
  const versatilityScore = Math.round(Math.min(98, rawVersatility * Math.min(tagWeights.versatility, 1.4)));
  const cultureScore = Math.round(Math.min(98, rawCulture * Math.min(tagWeights.culture, 1.4)));
  const trendScore = Math.round(Math.min(98, rawTrend * Math.min(tagWeights.trend, 1.4)));
  const priceScore = rawPrice;

  const roughTotal = Math.round(
    preferenceScore * 0.22 +
    versatilityScore * 0.18 +
    cultureScore * 0.18 +
    trendScore * 0.14 +
    priceScore * 0.16 +
    60 * 0.12
  );

  const satisfactionScore = calculateSatisfactionScore(roughTotal, preferenceScore, input.purpose, profile);

  const totalRecommendation = Math.round(
    preferenceScore * 0.22 +
    versatilityScore * 0.18 +
    cultureScore * 0.18 +
    trendScore * 0.14 +
    priceScore * 0.14 +
    satisfactionScore * 0.14
  );

  const reasons: AnalysisReasons = {
    preference: makePreferenceReason(preferenceScore, selectedTags, profile),
    versatility: makeVersatilityReason(versatilityScore, input.color, profile),
    culture: makeCultureReason(cultureScore, input.brand, input.model),
    trend: makeTrendReason(trendScore, input.model),
    satisfaction: makeSatisfactionReason(satisfactionScore, input.purpose),
    price: makePriceReason(priceScore, input.price),
  };

  const cautions = generateCautions(
    input,
    profile,
    selectedTags,
    { versatility: versatilityScore, culture: cultureScore, trend: trendScore, price: priceScore }
  );

  const finalDecision = getFinalDecision(totalRecommendation, priceScore);

  return {
    totalRecommendation: Math.min(98, Math.max(10, totalRecommendation)),
    preferenceScore,
    versatilityScore,
    cultureScore,
    trendScore,
    satisfactionScore,
    priceScore,
    finalDecision,
    reasons,
    cautions,
  };
}

// Extension point: replace analyzeSneaker with Gemini/OpenAI API call
// async function analyzeSneakerWithAI(context: AiContext): Promise<AnalysisResult>

export function buildAiContext(
  selectedTags: PreferenceTag[],
  sneakerInput: SneakerInput
): AiContext {
  return {
    selectedTags,
    seedSneakers: SEED_SNEAKERS,
    inferredUserPreference: INFERRED_USER_PREFERENCE,
    sneakerInput,
  };
}
