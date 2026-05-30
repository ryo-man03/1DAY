export type PreferenceTag =
  | 'レトロ'
  | 'シンプル'
  | 'ストリート'
  | 'アメカジ'
  | '合わせやすさ'
  | 'クラシック'
  | 'スポーティー'
  | 'ボリューム感'
  | '細身シルエット'
  | '派手め'
  | '落ち着いた色'
  | '文化的背景';

export const ALL_PREFERENCE_TAGS: PreferenceTag[] = [
  'レトロ',
  'シンプル',
  'ストリート',
  'アメカジ',
  '合わせやすさ',
  'クラシック',
  'スポーティー',
  'ボリューム感',
  '細身シルエット',
  '派手め',
  '落ち着いた色',
  '文化的背景',
];

export const TAG_DESCRIPTIONS: Record<PreferenceTag, string> = {
  レトロ: '復刻・ヴィンテージ感',
  シンプル: '装飾少なめ・日常使い',
  ストリート: 'スケート・HipHop系',
  アメカジ: 'デニム・古着との相性',
  合わせやすさ: '多ジャンルに対応',
  クラシック: '長く愛される定番性',
  スポーティー: '機能性・軽快さ',
  ボリューム感: '足元の存在感・厚み',
  細身シルエット: 'すっきり・きれいめ',
  派手め: '色・デザインの主張',
  落ち着いた色: 'モノトーン・定番色',
  文化的背景: '歴史・音楽・映画の文脈',
};

export interface SeedSneaker {
  brand: string;
  models: string[];
  inferredTags: PreferenceTag[];
}

export interface SneakerInput {
  brand: string;
  model: string;
  color: string;
  price: number;
  purpose: string;
  reason: string;
  imageUrl?: string;
  memo?: string;
}

export interface AnalysisReasons {
  preference: string;
  versatility: string;
  culture: string;
  trend: string;
  satisfaction: string;
  price: string;
}

export interface AnalysisResult {
  totalRecommendation: number;
  preferenceScore: number;
  versatilityScore: number;
  cultureScore: number;
  trendScore: number;
  satisfactionScore: number;
  priceScore: number;
  finalDecision: FinalDecision;
  reasons: AnalysisReasons;
  cautions: string[];
}

export type FinalDecision =
  | '今買ってよい'
  | '価格次第で買ってよい'
  | 'セール待ち'
  | '似たモデルと比較した方がよい'
  | '今は買わなくてよい';

export interface SampleSneaker extends SneakerInput {
  displayName: string;
  emoji?: string;
}

// Future AI API context shape
export interface AiContext {
  selectedTags: PreferenceTag[];
  seedSneakers: SeedSneaker[];
  inferredUserPreference: PreferenceTag[];
  sneakerInput: SneakerInput;
}
