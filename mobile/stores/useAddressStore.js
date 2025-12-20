import { create } from "zustand";
import api from "../lib/axios"

export const useAddressStore = create((set) => ({
    addresses: [],
    isLoading: false,
    isAdding: false,
    isDeleting: false,
    isUpdating: false,

    getAddresses: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get("/api/users/addresses");
            set({ addresses: data.addresses });
        } catch (error) {
            console.log(error);
            throw new Error("Failed to fetch addresses");
        } finally {
            set({ isLoading: false });
        }
    },

    addAddress: async (address) => {
        set({ isAdding: true });
        try {
            const { data } = await api.post("/api/users/addresses", address);
            set({ addresses: data.addresses });
        } catch (error) {
            console.log(error);
            throw new Error("Failed to add address");
        } finally {
            set({ isAdding: false });
        }
    },

    updateAddress: async (addressId, addressData) => {
        set({ isUpdating: true });
        try {
            const { data } = await api.put(`/api/users/addresses/${addressId}`, addressData);
            set({ addresses: data.addresses });
        } catch (error) {
            console.log(error);
            throw new Error("Failed to update address");
        } finally {
            set({ isUpdating: false });
        }
    },

    deleteAddress: async (addressId) => {
        set({ isDeleting: true });
        try {
            const { data } = await api.delete(`/api/users/addresses/${addressId}`);
            set({ addresses: data.addresses });
        } catch (error) {
            console.log(error);
            throw new Error("Failed to delete address");
        } finally {
            set({ isDeleting: false });
        }
    },
}))
