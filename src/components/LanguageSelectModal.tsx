import React, {useState} from 'react';
import {Check, Languages} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {LanguageCode, SUPPORTED_LANGUAGES} from '@/i18n';

interface LanguageSelectModalProps {
  onSelect: (code: LanguageCode) => void;
}

/** Shown once after login when the user has not picked a language yet. */
export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  onSelect,
}) => {
  const {t, i18n} = useTranslation();
  const [choice, setChoice] = useState<LanguageCode>(
    (SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language)?.code ||
      'en') as LanguageCode,
  );

  return (
    <div className="backdrop-blur-2xs fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-5 shadow-xl">
        <div className="space-y-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f5e9] text-[#1b5e20]">
            <Languages size={22} />
          </div>
          <h3 className="text-base font-bold text-[#1b1c1c]">
            {t('language.chooseTitle')}
          </h3>
          <p className="text-xs text-[#525e54]">
            {t('language.chooseSubtitle')}
          </p>
        </div>

        <div className="space-y-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = choice === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setChoice(lang.code)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-3 text-left transition-colors ${
                  active
                    ? 'border-[#00450d] bg-[#e8f5e9]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>
                  <span className="block text-sm font-bold text-[#1b1c1c]">
                    {lang.label}
                  </span>
                  {lang.label !== lang.english && (
                    <span className="block text-[11px] text-[#525e54]">
                      {lang.english}
                    </span>
                  )}
                </span>
                {active && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00450d] text-white">
                    <Check size={13} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onSelect(choice)}
          className="w-full cursor-pointer rounded-xl bg-[#00450d] py-2.5 text-xs font-bold text-white"
        >
          {t('common.continue')}
        </button>
      </div>
    </div>
  );
};
