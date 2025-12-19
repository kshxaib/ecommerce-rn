import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isCheckingAuth: true,
    
    register: async (name, email, password, confirmPassword) => {
        set({ isLoading: true })
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, confirmPassword, device: "mobile" }),
            })
            const data = await response.json()

            if(!response.ok) throw new Error(data.message || "Something went wrong")

            set({ user: data.user, token: data.token })
            await AsyncStorage.setItem("user", JSON.stringify(data.user))
            await AsyncStorage.setItem("token", data.token)
            return {success: true}
        } catch (error) {
            return {error: error.message || "Something went wrong"}
        } finally {
            set({ isLoading: false })
        }
    },

    login: async (email, password) => {
        set({ isLoading: true })
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, device: "mobile" }),
            })
            const data = await response.json()

            if(!response.ok) throw new Error(data.message || "Something went wrong")

            set({ user: data.user, token: data.token })
            await AsyncStorage.setItem("user", JSON.stringify(data.user))
            await AsyncStorage.setItem("token", data.token)
            return {success: true}
        } catch (error) {
            return {error: error.message || "Something went wrong"}
        } finally {
            set({ isLoading: false })
        }
    },

    logout: async () => {
        set({ isLoading: true })
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ device: "mobile" }),
            })
            const data = await response.json()

            if(!response.ok) throw new Error(data.message || "Something went wrong")

            set({ user: null, token: null })
            await AsyncStorage.removeItem("user")
            await AsyncStorage.removeItem("token")
        } catch (error) {
            return {error: error.message || "Something went wrong"}
        } finally {
            set({ isLoading: false })
        }
    },

    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token")
            const user = await AsyncStorage.getItem("user")

            const userInJson = user ? JSON.parse(user) : null

            set({ user: userInJson, token })
        } catch (error) {
            return {error: error.message || "Something went wrong"}
        } finally {
            set({ isCheckingAuth: false })
        }
    },
})) 