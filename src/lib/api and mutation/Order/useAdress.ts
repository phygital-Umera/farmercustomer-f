import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createAdress, getAdress, updateAdress } from "./AdressApi"
import toast from "react-hot-toast"

export const useCreateAdresss = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createAdress,
        onSuccess: () => {
            toast.success("Address Added Successfully")
            queryClient.invalidateQueries({ queryKey: ['address'] })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to Add Address")
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
            toast.success("Address Updated Successfully")
            queryClient.invalidateQueries({ queryKey: ['address'] })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to Update Address")
        }
    })
}