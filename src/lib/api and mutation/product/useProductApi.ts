import { useMutation, useQuery } from "@tanstack/react-query"
import { getAllProduct, submitFeedback } from "./productApi"
import i18n from '@/i18n'
import toast from "react-hot-toast"


export const useGetAllProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: () => getAllProduct(),
    })
}

export const useSubmitFeedback = () => {
    return useMutation({
        mutationKey: ['feedback'],
        mutationFn: (data: any) => submitFeedback(data),
        onSuccess:(data)=>{
            toast.success(i18n.t("toast.feedbackSent"))
        },
        onError:(error)=>{
            toast.error(i18n.t("toast.feedbackFailed"))
        },

    })
}