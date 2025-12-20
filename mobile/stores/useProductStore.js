import { create } from "zustand";
import api from "../lib/axios";

export const useProductStore = create((set) => ({
    products: [],
    isLoading: false,

    getAllProducts: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get("/api/products");
            set({ products: data });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Failed to fetch products",
            };
        } finally {
            set({ isLoading: false });
        }
    },
}));