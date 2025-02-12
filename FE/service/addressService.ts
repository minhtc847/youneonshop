import axios from '../setup/axios';

export interface Address{
    id: string;
    user_id: string;
    city: string;
    district: string;
    ward: string;
    detail: string;
    telephone: string;
    receiver: string;
    description: string;
}

export interface AddressesResponse {
    addresses: Address[];
}

export const getAllAddresses = async (token: string): Promise<AddressesResponse> => {
    try {
        const response = await axios.get<AddressesResponse>("/addresses", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}
export const addAddress = async (token: string, address: Address) => {
    try {
        const response = await axios.post("/addresses", address, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}
export const updateAddress = async (token: string, address: Address) => {
    try {
        const response = await axios.put(`/addresses/${address.id}`, address, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}
export const deleteAddress = async (token: string, addressId: string) => {
    try {
        const response = await axios.delete(`/addresses/${addressId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        throw error
    }
}