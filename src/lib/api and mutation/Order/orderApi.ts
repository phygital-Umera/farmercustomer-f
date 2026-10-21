import { api } from "@/utils/axios"

export const orderItem = async (data: { addressId: string }) => {
    try {
        const res = await api.post("/customer/orders", data)
        return res
    } catch (error) {
        throw error
    }
}



export const getOrderItem=()=>{
    try {
        const res = api.get("/customer/orders")
        return res
    } catch (error) {
        throw error
    }
}

