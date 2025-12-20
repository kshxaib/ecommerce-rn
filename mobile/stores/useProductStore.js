import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useProductStore = create((set) => ({
    products: [],
    isLoading: false,

    getAllProducts: async () => {
        set({ isLoading: true })
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/products", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json()
            set({ products: data })
        } catch (error) {
            return { error: error.message || "Something went wrong" };
        } finally {
            set({ isLoading: false })
        }
    }
}));
