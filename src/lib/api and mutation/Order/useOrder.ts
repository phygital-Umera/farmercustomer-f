import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getOrderItem, orderItem } from "./orderApi"
import i18n from '@/i18n'
import toast from "react-hot-toast"

export const useOrderItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { addressId: string }) => orderItem(data),
        onSuccess: () => {
            toast.success(i18n.t("toast.orderPlaced"))
            queryClient.invalidateQueries({ queryKey: ["cart"] })
            queryClient.invalidateQueries({ queryKey: ["order"] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || i18n.t("toast.orderFailed"))
        }
    })
}

export const useGetOrder=()=>{
    return useQuery({
        queryKey:["order"],
        queryFn:getOrderItem,
        
    })
}