import { api } from "@/utils/axios"

export const addCart=async(data:any)=>{
    try {
        const res = await api.post('customer/cart', data)
        return res?.data
    } catch (error) {
        throw error
    }
}

export const getCart=async()=>{
    try {
        const res = await api.get('customer/cart')
        return res?.data
    } catch (error) {
        throw error
    }
}

export const changeCount=async(id:string,data:any)=>{
    try {
        const res = await api.patch(`customer/cart/items/${id}`, data)
        return res?.data
    } catch (error) {
        throw error
    }
}