import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../lib/axios";

export const useCartStore = create((set, get) => ({
    cart: { items: [] },
    isLoading: false,
    isAddingToCart: false,
    isRemovingFromCart: false,
    isUpdating: false,
    isClearingCart: false,

    getCart: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get("/api/cart");
            set({ cart: data.cart });
        } finally {
            set({ isLoading: false });
        }
    },

    addToCart: async ({ productId, quantity = 1 }) => {
        set({ isAddingToCart: true });
        try {
            const { data } = await api.post("/api/cart", {
                productId,
                quantity,
            });

            set({ cart: data.cart });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Something went wrong",
            };
        } finally {
            set({ isAddingToCart: false });
        }
    },

    updateQuantity: async ({ productId, quantity }) => {
        set({ isUpdating: true });
        try {
            const { data } = await api.put(`/api/cart/${productId}`, {
                quantity,
            });

            set({ cart: data.cart });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Something went wrong",
            };
        } finally {
            set({ isUpdating: false });
        }
    },

    removeFromCart: async (productId) => {
        set({ isRemovingFromCart: true });
        try {
            const { data } = await api.delete(`/api/cart/${productId}`);
            set({ cart: data.cart });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Something went wrong",
            };
        } finally {
            set({ isRemovingFromCart: false });
        }
    },

    clearCart: async () => {
        set({ isClearingCart: true });
        try {
            await api.delete("/api/cart");
            set({ cart: { items: [] } });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Something went wrong",
            };
        } finally {
            set({ isClearingCart: false });
        }
    },

    cartTotal: () => {
        const cart = get().cart;
        if (!cart || !Array.isArray(cart.items)) return 0;

        return cart.items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    },

    cartItemCount: () => {
        const cart = get().cart;
        if (!cart || !Array.isArray(cart.items)) return 0;

        return cart.items.reduce(
            (total, item) => total + item.quantity,
            0
        );
    },
})) 