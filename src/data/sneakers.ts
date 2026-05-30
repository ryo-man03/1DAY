import { SeedSneaker, SampleSneaker, PreferenceTag } from '../types';

export const SEED_SNEAKERS: SeedSneaker[] = [
  {
    brand: 'Nike',
    models: ['Air Jordan 1 Bred 2025', 'Dunk Low Panda'],
    inferredTags: ['レトロ', 'ストリート', '文化的背景', '落ち着いた色'],
  },
  {
    brand: 'adidas',
    models: ['Samba OG', 'Superstar 82'],
    inferredTags: ['レトロ', 'クラシック', '合わせやすさ', '細身シルエット'],
  },
  {
    brand: 'New Balance',
    models: ['990v3', '2002'],
    inferredTags: ['クラシック', '落ち着いた色', '合わせやすさ', 'アメカジ'],
  },
  {
    brand: 'Puma',
    models: ['Suede VTG', 'Speedcat'],
    inferredTags: ['レトロ', '細身シルエット', '文化的背景', 'ストリート'],
  },
  {
    brand: 'Converse',
    models: ['All Star J HI Black', 'One Star J'],
    inferredTags: ['クラシック', 'ストリート', 'シンプル', 'アメカジ'],
  },
  {
    brand: 'Vans',
    models: ['Authentic', 'Half Cab'],
    inferredTags: ['ストリート', 'アメカジ', 'シンプル', '落ち着いた色'],
  },
];

export const INFERRED_USER_PREFERENCE: PreferenceTag[] = [
  'レトロ',
  'クラシック',
  '合わせやすさ',
  '文化的背景',
  '落ち着いた色',
  'ストリート',
  'アメカジ',
  '細身シルエット',
];

export const SAMPLE_SNEAKERS: SampleSneaker[] = [
  {
    displayName: 'Jordan 1 Bred 2025',
    brand: 'Nike',
    model: 'Air Jordan 1 High OG Bred 2025',
    color: 'Black / Varsity Red / White',
    price: 33000,
    purpose: 'ストリートコーデに合わせる',
    reason: '復刻のBreedはずっと気になっていたモデル。文化的価値も高いし、一生モノとして持っておきたい。',
  },
  {
    displayName: 'adidas Samba OG',
    brand: 'adidas',
    model: 'Samba OG Black White',
    color: 'Core Black / Cloud White',
    price: 19800,
    purpose: '普段履き',
    reason: 'どんな服にも合わせやすくて、今一番気になっているモデル。デイリーユース重視。',
  },
  {
    displayName: 'Puma Speedcat Red',
    brand: 'Puma',
    model: 'Speedcat OG',
    color: 'Puma Red / Puma White',
    price: 16500,
    purpose: 'お出かけ',
    reason: 'モータースポーツ感あるデザインが好き。赤が差し色になってコーデが映えそう。',
  },
  {
    displayName: 'New Balance 990v3',
    brand: 'New Balance',
    model: '990v3',
    color: 'Grey',
    price: 35000,
    purpose: 'アメカジに合わせる',
    reason: 'Made in USAで品質が高い。アメカジコーデの定番として長く使いたい。',
  },
  {
    displayName: 'Vans Half Cab',
    brand: 'Vans',
    model: 'Half Cab',
    color: 'Black',
    price: 12000,
    purpose: 'ストリートコーデに合わせる',
    reason: 'スケートカルチャーのアイコン。シンプルな黒でコーデを選ばない。',
  },
  {
    displayName: 'Converse One Star J',
    brand: 'Converse',
    model: 'One Star J Suede',
    color: 'Black / Egret',
    price: 11000,
    purpose: '普段履き',
    reason: 'スエード素材の質感が好き。カート・コバーンのイメージもあり文化的価値も感じる。',
  },
];

export const PURPOSE_OPTIONS = [
  '普段履き',
  '通学',
  'お出かけ',
  'コレクション',
  '古着・アメカジに合わせる',
  'ストリートコーデに合わせる',
  'きれいめコーデに合わせる',
  '雨の日以外で履く',
  'まだ決めていない',
] as const;
