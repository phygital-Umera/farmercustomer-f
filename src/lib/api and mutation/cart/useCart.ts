import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addCart, changeCount, getCart } from "./cartApi"
import i18n from '@/i18n'
import toast from "react-hot-toast"

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success(i18n.t("toast.addedToCart"))
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || i18n.t("toast.addToCartFailed")
            toast.error(message)
        }
    })
}

export const useGetCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: getCart
    })
}

export const useChangeCount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => changeCount(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success(i18n.t("toast.countChanged"))
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || i18n.t("toast.countFailed")
            toast.error(message)
        }
    })
}