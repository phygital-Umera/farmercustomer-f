import {useMutation, useQueryClient} from '@tanstack/react-query';
import i18n from '@/i18n'
import toast from 'react-hot-toast';
import {CreatePreorderInput} from '@/types/OrderType';
import {createPreorder} from './preorderApi';

export const useCreatePreorder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePreorderInput) => createPreorder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['order']});
      toast.success(i18n.t('toast.preorderSaved'));
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          i18n.t('toast.preorderFailed'),
      );
    },
  });
};
