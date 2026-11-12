import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createAdress, getAdress, updateAdress } from "./AdressApi"
import i18n from '@/i18n'
import toast from "react-hot-toast"

export const useCreateAdresss = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createAdress,
        onSuccess: () => {
            toast.success(i18n.t("toast.addressAdded"))
            queryClient.invalidateQueries({ queryKey: ['address'] })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || i18n.t("toast.addressAddFailed"))
        }
    })
}

export const useGetAddress = () => {
    return useQuery({
        queryKey: ['address'],
        queryFn: getAdress
    })
}

export const useUpdateAddress = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateAdress,
        onSuccess: () => {
            toast.success(i18n.t("toast.addressUpdated"))
            queryClient.invalidateQueries({ queryKey: ['address'] })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || i18n.t("toast.addressUpdateFailed"))
        }
    })
}