import {useCallback, useEffect, useState} from 'react';
import {useAuthContext} from '@/context/AuthContext';
import {LanguageCode, setLanguage} from '@/i18n';
import {getUserId, getUserLanguage} from './languageStorage';

/**
 * Keeps the active language in sync with the logged-in user:
 * - user has a saved language  -> apply it (restores after refresh / re-login)
 * - user has none yet          -> ask once via the language popup
 */
export const useLanguageSync = () => {
  const {isAuthenticated, isLoading, user} = useAuthContext() as any;
  const userId = getUserId(user);
  const [needsChoice, setNeedsChoice] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setNeedsChoice(false);
      return;
    }
    const saved = getUserLanguage(userId || 'customer');
    if (saved) {
      setLanguage(saved, userId || 'customer');
      setNeedsChoice(false);
    } else {
      setNeedsChoice(true);
    }
  }, [isAuthenticated, isLoading, userId]);

  const choose = useCallback(
    (code: LanguageCode) => {
      setLanguage(code, userId || 'customer');
      setNeedsChoice(false);
    },
    [userId],
  );

  /** Change language from settings — persisted for the current user. */
  const change = useCallback(
    (code: LanguageCode) =>
      setLanguage(code, isAuthenticated ? userId || 'customer' : null),
    [isAuthenticated, userId],
  );

  return {needsChoice, choose, change};
};
