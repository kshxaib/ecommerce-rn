import { create } from "zustand";
import api from "../lib/axios";

export const useOrderStore = create((set) => ({
    orders: [],
    isLoading: false,
    error: null,

    getOrders: async () => {
        try {
            set({ isLoading: true, error: null });

            const { data } = await api.get("/api/orders");

            set({
                orders: data.orders,
                isLoading: false,
            });
        } catch (err) {
            set({
                error: err.response?.data?.error || "Failed to fetch orders",
                isLoading: false,
            });
        }
    },
}));