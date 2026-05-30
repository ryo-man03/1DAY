import { Decision, PersonalFitLabel, PreferenceTag, WishlistItem } from '../types';

const STORAGE_KEY = 'sole_matrix_wishlist';

export function getWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function saveToWishlist(item: Omit<WishlistItem, 'id' | 'createdAt'>): WishlistItem {
  const newItem: WishlistItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const current = getWishlist();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newItem, ...current]));
  return newItem;
}

export function removeFromWishlist(id: string): void {
  const updated = getWishlist().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function isInWishlist(sneakerName: string): boolean {
  return getWishlist().some((item) => item.sneakerName === sneakerName);
}

export function formatDecisionLabel(decision: Decision): string {
  return decision;
}

export function formatPersonalFitLabel(label: PersonalFitLabel): string {
  return label;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Extension point: replace LocalStorage with Supabase in the future
// async function saveWishlistToSupabase(item: WishlistItem, userId: string): Promise<void>
// async function fetchWishlistFromSupabase(userId: string): Promise<WishlistItem[]>
