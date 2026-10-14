import { useMutation, useQuery } from "@tanstack/react-query"
import { getAllProduct } from "./productApi"


export const useGetAllProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: () => getAllProduct(),
    })
}