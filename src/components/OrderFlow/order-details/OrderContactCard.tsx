import React from 'react';
import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface ContactNumber {
  number: string;
  label?: string;
}

export const ContactNumberList: React.FC<{ contactNumbers: ContactNumber[] }> = ({
  contactNumbers,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-1.5">
      {contactNumbers.map((c, i) => (
        <a
          key={`${c.number}-${i}`}
          href={`tel:${c.number.replace(/[^\d+]/g, '')}`}
          className="flex items-center justify-between gap-2 rounded-xl bg-[#f0eded] px-3 py-2 text-xs"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Phone size={14} className="shrink-0 text-[#1b5e20]" />
            <span className="min-w-0 text-left">
              {c.label && (
                <span className="block text-[10px] font-semibold uppercase text-[#525e54]">
                  {c.label}
                </span>
              )}
              <span className="block truncate font-bold text-[#00450d]">{c.number}</span>
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-[#00450d] px-2.5 py-0.5 text-[10px] font-bold text-white">
            {t('orderDetails.call')}
          </span>
        </a>
      ))}
    </div>
  );
};

export const OrderContactCard: React.FC<{ contactNumbers: ContactNumber[] }> = ({
  contactNumbers,
}) => {
  const { t } = useTranslation();

  if (contactNumbers.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-2xs space-y-2">
      <div className="flex items-center gap-1.5">
        <Phone size={16} className="text-[#1b5e20]" />
        <h3 className="font-extrabold text-sm text-[#1b1c1c]">
          {t('orderDetails.contactUs')}
        </h3>
      </div>
      <ContactNumberList contactNumbers={contactNumbers} />
    </div>
  );
};
