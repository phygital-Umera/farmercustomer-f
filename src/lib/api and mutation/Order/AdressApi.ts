import { api } from "@/utils/axios"

export const createAdress = async (data: any) => {
    try {
        const res = await api.post('customer/orders/address', data)
        return res
    } catch (error) {
        throw error
    }
}

export const getAdress = async () => {
    try {
        const res = await api.get('customer/orders/address')
        return res
    } catch (error) {
        throw error
    }
}

export const updateAdress = async ({ id, data }: { id: string; data: any }) => {
    try {
        const res = await api.put(`customer/orders/address/${id}`, data)
        return res
    } catch (error) {
        throw error
    }
}