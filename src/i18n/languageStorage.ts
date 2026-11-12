export type LanguageCode = 'en' | 'hi' | 'mr';

export const SUPPORTED_LANGUAGES: {
  code: LanguageCode;
  label: string;
  english: string;
}[] = [
  {code: 'en', label: 'English', english: 'English'},
  {code: 'hi', label: 'हिन्दी', english: 'Hindi'},
  {code: 'mr', label: 'मराठी', english: 'Marathi'},
];

const LAST_KEY = 'app_language';
const userKey = (userId: string) => `lang_user_${userId}`;

const isSupported = (code: unknown): code is LanguageCode =>
  SUPPORTED_LANGUAGES.some((l) => l.code === code);

const safeGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — language still applies for this session */
  }
};

/** Last language used on this device (used before auth is restored, and for guests). */
export const getStoredLanguage = (): LanguageCode | null => {
  const v = safeGet(LAST_KEY);
  return isSupported(v) ? v : null;
};

/** Language saved for a specific user, or null if they never picked one. */
export const getUserLanguage = (
  userId?: string | null,
): LanguageCode | null => {
  if (!userId) return null;
  const v = safeGet(userKey(userId));
  return isSupported(v) ? v : null;
};

export const saveLanguage = (code: LanguageCode, userId?: string | null) => {
  safeSet(LAST_KEY, code);
  if (userId) safeSet(userKey(userId), code);
};

/** Same id resolution used elsewhere for the JWT user payload. */
export const getUserId = (user: unknown): string | null => {
  const u = user as any;
  return u?.id || u?.userId || u?.user?.id || u?.sub || null;
};

/** BCP-47 locale for Intl date/number formatting. */
export const toLocale = (code?: string) =>
  code === 'hi' ? 'hi-IN' : code === 'mr' ? 'mr-IN' : 'en-IN';
