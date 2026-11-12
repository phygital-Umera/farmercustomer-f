import React from 'react';
import {MessageSquareHeart, X} from 'lucide-react';
import z from 'zod';
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useSubmitFeedback} from '@/lib/api and mutation/product/useProductApi';
import {useTranslation} from 'react-i18next';

const feedbackschema = z.object({
  quality: z.string().min(1, 'validation.qualityRequired'),
  service: z.string().min(1, 'validation.serviceRequired'),
  staffRegard: z.string().min(1, 'validation.staffRequired'),
  note: z.string().optional().default(''),
  GOOD: z.string().optional(),
  POOR: z.string().optional(),
  EXCELLENT: z.string().optional(),
});

type feedbacktype = z.infer<typeof feedbackschema>;

interface FeedbackModalProps {
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({onClose}) => {
  const {mutate: submitFeedback} = useSubmitFeedback();
  const {t} = useTranslation();

  // Rendered only while open, so the form always starts blank.
  const method = useForm<feedbacktype>({
    resolver: zodResolver(feedbackschema),
    defaultValues: {
      quality: '',
      service: '',
      staffRegard: '',
      note: '',
      GOOD: '',
      POOR: '',
      EXCELLENT: '',
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: {errors},
  } = method;

  const currentQuality = watch('quality');
  const currentService = watch('service');
  const currentStaffRegard = watch('staffRegard');

  const onFeedBackSubmit = (data: feedbacktype) => {
    submitFeedback(data);
    onClose();
  };

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200"
      onClick={onClose}
    >
      <div
        className="animate-in zoom-in-95 w-full max-w-sm space-y-4 overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="border-gray-100 flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <MessageSquareHeart size={16} />
            </div>
            <div>
              <h3 className="text-gray-900 text-sm font-bold">
                {t('feedback.title')}
              </h3>
              <p className="text-gray-500 text-[10px]">
                {t('feedback.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onFeedBackSubmit)} className="space-y-3">
            {/* Rating Section Helper */}
            {[
              {
                id: 'quality' as const,
                title: t('feedback.quality'),
                value: currentQuality,
              },
              {
                id: 'service' as const,
                title: t('feedback.service'),
                value: currentService,
              },
              {
                id: 'staffRegard' as const,
                title: t('feedback.staff'),
                value: currentStaffRegard,
              },
            ].map((field) => (
              <div key={field.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-gray-800 text-xs font-semibold">
                    {field.title}
                  </label>
                </div>
                <div className="flex gap-2">
                  {[
                    {key: 'EXCELLENT', label: t('feedback.excellent')},
                    {key: 'GOOD', label: t('feedback.good')},
                    {key: 'POOR', label: t('feedback.poor')},
                  ].map((opt) => {
                    const isSelected = Boolean(
                      field.value && field.value === opt.key,
                    );
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setValue(field.id, isSelected ? '' : opt.key, {
                            shouldValidate: true,
                          });
                        }}
                        className={`flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg border px-1 py-1.5 text-xs transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-800 shadow-sm ring-1 ring-emerald-600'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50 bg-white'
                        }`}
                      >
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors[field.id] && (
                  <p className="text-[10px] font-medium text-red-500">
                    {t(errors[field.id]?.message || '')}
                  </p>
                )}
              </div>
            ))}

            {/* Suggestion / Note */}
            <div className="space-y-1">
              <label className="text-gray-800 text-xs font-semibold">
                {t('feedback.suggestion')}
              </label>
              <textarea
                {...register('note')}
                rows={2}
                placeholder={t('feedback.suggestionPlaceholder')}
                className="border-gray-200 placeholder:text-gray-400 w-full resize-none rounded-lg border p-2.5 text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="border-gray-200 text-gray-600 hover:bg-gray-50 flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors"
              >
                {t('feedback.later')}
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-emerald-800 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:bg-emerald-900 active:scale-95"
              >
                {t('feedback.submit')}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
