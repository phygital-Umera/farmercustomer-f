import { useMutation, useQuery } from "@tanstack/react-query"
import { getAllProduct, submitFeedback } from "./productApi"
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
            toast.success("Feedback submitted successfully")
        },
        onError:(error)=>{
            toast.error("Feedback not submitted")
        },

    })
}