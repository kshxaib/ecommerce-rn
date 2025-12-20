import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCartStore = create((set, get) => ({
    cart: [],
    isLoading: false,
    isAddingToCart: false,
    isRemovingFromCart: false,
    isUpdating: false,
    isClearingCart: false,
    cartTotal: 0,
    cartItemCount: 0,

    addToCart: async ({ productId, quantity = 1 }) => {
        console.log("addToCart", productId, quantity)
        set({ isAddingToCart: true })
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId, quantity }),
                method: "POST",
            });
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong")
            }
            set({ cart: data.cart })
            return { success: true }
        } catch (error) {
            return { error: error.message || "Something went wrong" }
        } finally {
            set({ isAddingToCart: false })
        }
    },

    updateQuantity: async ({ productId, quantity }) => {
        set({ isUpdating: true })
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/api/cart/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity }),
                method: "PUT",
            });
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong")
            }
            set({ cart: data.cart })
            return { success: true }
        } catch (error) {
            return { error: error.message || "Something went wrong" }
        } finally {
            set({ isUpdating: false })
        }
    },

    removeFromCart: async (productId) => {
        set({ isRemovingFromCart: true })
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/api/cart/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "DELETE",
            });
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong")
            }
            set({ cart: data.cart })
            return { success: true }
        } catch (error) {
            return { error: error.message || "Something went wrong" }
        } finally {
            set({ isRemovingFromCart: false })
        }
    },

    clearCart: async () => {
        set({ isClearingCart: true })
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + `/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "DELETE",
            });
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong")
            }
            set({ cart: [] })
            return { success: true }
        } catch (error) {
            return { error: error.message || "Something went wrong" }
        } finally {
            set({ isClearingCart: false })
        }
    },

    cartTotal: () => {
        const { cart } = get()
        return cart?.items.reduce((total, item) => total + item.product.price * item.quantity, 0) ?? 0
    },

    cartItemCount: () => {
        const { cart } = get()
        return cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0
    }
})) 