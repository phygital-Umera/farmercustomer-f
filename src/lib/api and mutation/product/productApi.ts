import { api } from "@/utils/axios"



export const getAllProduct = async () => {
    try {
        const res = await api.get("customer/products")
        return res.data
    } catch (error) {
        throw error
    }
}

export const submitFeedback = async (data: any) => {
    try {
        const res = await api.post("customer/feedbacks", data)
        return res.data
    } catch (error) {
        throw error
    }
}