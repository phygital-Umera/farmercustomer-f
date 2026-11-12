import React, { useState } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onVoiceSearch?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
  onVoiceSearch,
}) => {
  const [isListening, setIsListening] = useState(false);
  const { t, i18n } = useTranslation();

  const handleVoiceToggle = () => {
    if (onVoiceSearch) {
      onVoiceSearch();
      return;
    }

    // Interactive speech simulation or Web Speech API if supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition =
          (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = `${i18n.language || 'en'}-IN`;
        recognition.continuous = false;
        setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onChange(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
        return;
      } catch (err) {
        console.error(err);
      }
    }

    // Fallback simulation
    setIsListening(true);
    setTimeout(() => {
      onChange('Tomato');
      setIsListening(false);
    }, 1200);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center w-full bg-white rounded-xl sm:rounded-2xl border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.03)] px-3.5 py-2.5 transition-all focus-within:border-[#1b5e20] focus-within:ring-2 focus-within:ring-[#1b5e20]/10">
        <Search size={18} className="text-[#41493e] shrink-0 mr-2.5" />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? t('search.placeholder')}
          className="w-full bg-transparent text-sm text-[#1b1c1c] placeholder:text-[#717a6d] outline-none font-medium"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-[#717a6d] hover:text-[#1b1c1c] mr-1"
            aria-label={t('search.clear')}
          >
            <X size={15} />
          </button>
        )}

        <button
          type="button"
          onClick={handleVoiceToggle}
          className={`p-1 text-[#1b5e20] hover:text-[#00450d] transition-colors rounded-full ${
            isListening ? 'animate-pulse bg-emerald-100 text-emerald-800 p-1.5' : ''
          }`}
          title={isListening ? t('search.listening') : t('search.voice')}
          aria-label={t('search.voice')}
        >
          <Mic size={18} className={isListening ? 'text-emerald-700' : 'text-[#1b5e20]'} />
        </button>
      </div>
    </div>
  );
};
