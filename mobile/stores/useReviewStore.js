import { create } from "zustand";
import api from "../lib/axios";

export const useReviewStore = create((set) => ({
    isCreatingReview: false,
    error: null,

    createReview: async ({ productId, orderId, rating }) => {
        set({ isCreatingReview: true, error: null });
        try {
            const { data } = await api.post("/api/reviews", { productId, orderId, rating });
            return data;
        } catch (error) {
            const message = error.response?.data?.error || "Failed to create review";
            set({ error: message });
            throw new Error(message);
        } finally {
            set({ isCreatingReview: false });
        }
    }
}));
