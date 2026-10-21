import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getOrderItem, orderItem } from "./orderApi"
import toast from "react-hot-toast"

export const useOrderItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { addressId: string }) => orderItem(data),
        onSuccess: () => {
            toast.success("Order placed successfully")
            queryClient.invalidateQueries({ queryKey: ["cart"] })
            queryClient.invalidateQueries({ queryKey: ["order"] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || "Failed to place order")
        }
    })
}

export const useGetOrder=()=>{
    return useQuery({
        queryKey:["order"],
        queryFn:getOrderItem,
        
    })
}