import React from 'react';
import { LogIn } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { PreorderHeader } from './PreorderHeader';

interface PreorderLoginPromptProps {
  onBack: () => void;
}

export const PreorderLoginPrompt: React.FC<PreorderLoginPromptProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-[#fcf9f8]">
      <PreorderHeader onBack={onBack} />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4 rounded-3xl border border-[#e0e6e0] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5e9] text-[#1b5e20]">
            <LogIn size={30} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-extrabold text-[#1b1c1c]">
              {t('orders.loginTitle')}
            </h2>
            <p className="text-xs text-[#525e54]">
              {t('preorder.loginDesc')}
            </p>
          </div>
          <Link
            to="/signin"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00450d] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#1b5e20]"
          >
            <LogIn size={16} />
            <span>{t('orders.loginButton')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
