import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addCart, changeCount, getCart } from "./cartApi"
import toast from "react-hot-toast"

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success("Item added to cart")
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Failed to add item to cart"
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
            toast.success("Item count changed")
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Failed to change item count"
            toast.error(message)
        }
    })
}