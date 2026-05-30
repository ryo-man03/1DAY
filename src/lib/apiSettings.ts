export interface ApiSettings {
  geminiApiKey?: string;
  rakutenAppId?: string;
  rakutenAccessKey?: string;
  rakutenAffiliateId?: string;
}

const KEYS = {
  gemini: 'SOLE_MATRIX_GEMINI_API_KEY',
  rakutenApp: 'SOLE_MATRIX_RAKUTEN_APP_ID',
  rakutenAccess: 'SOLE_MATRIX_RAKUTEN_ACCESS_KEY',
  rakutenAffiliate: 'SOLE_MATRIX_RAKUTEN_AFFILIATE_ID',
} as const;

export function getApiSettings(): ApiSettings {
  return {
    geminiApiKey: sessionStorage.getItem(KEYS.gemini) || undefined,
    rakutenAppId: sessionStorage.getItem(KEYS.rakutenApp) || undefined,
    rakutenAccessKey: sessionStorage.getItem(KEYS.rakutenAccess) || undefined,
    rakutenAffiliateId: sessionStorage.getItem(KEYS.rakutenAffiliate) || undefined,
  };
}

export function saveApiSettings(settings: ApiSettings): void {
  const set = (key: string, val?: string) => {
    if (val) sessionStorage.setItem(key, val);
    // Do NOT removeItem here — callers are responsible for explicit deletion
  };
  set(KEYS.gemini, settings.geminiApiKey);
  set(KEYS.rakutenApp, settings.rakutenAppId);
  set(KEYS.rakutenAccess, settings.rakutenAccessKey);
  set(KEYS.rakutenAffiliate, settings.rakutenAffiliateId);
}

export function hasGeminiKey(settings: ApiSettings): boolean {
  return Boolean(settings.geminiApiKey);
}

export function hasRakutenKeys(settings: ApiSettings): boolean {
  return Boolean(settings.rakutenAppId && settings.rakutenAccessKey);
}

export function clearApiSettings(): void {
  Object.values(KEYS).forEach((k) => sessionStorage.removeItem(k));
}
