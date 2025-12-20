import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setAuthToken } from "../lib/axios";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isCheckingAuth: true,

    register: async (name, email, password, confirmPassword) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post("/api/auth/register", {
                name,
                email,
                password,
                confirmPassword,
                device: "mobile",
            });

            set({
                user: data.user,
                token: data.token,
            });

            setAuthToken(data.token);

            await AsyncStorage.multiSet([
                ["user", JSON.stringify(data.user)],
                ["token", data.token],
            ]);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Registration failed",
            };
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post("/api/auth/login", {
                email,
                password,
                device: "mobile",
            });

            set({
                user: data.user,
                token: data.token,
            });

            setAuthToken(data.token);

            await AsyncStorage.multiSet([
                ["user", JSON.stringify(data.user)],
                ["token", data.token],
            ]);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Login failed",
            };
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await api.post("/api/auth/logout", {
                device: "mobile",
            });

            set({ user: null, token: null });
            setAuthToken(null);

            await AsyncStorage.multiRemove(["user", "token"]);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Logout failed",
            };
        } finally {
            set({ isLoading: false });
        }
    },

    checkAuth: async () => {
        try {
            const [[, user], [, token]] = await AsyncStorage.multiGet([
                "user",
                "token",
            ]);

            if (user && token) {
                const parsedUser = JSON.parse(user);

                set({
                    user: parsedUser,
                    token,
                });

                setAuthToken(token);
            }
        } catch (error) {
            return {
                success: false,
                error: error.message || "Auth check failed",
            };
        } finally {
            set({ isCheckingAuth: false });
        }
    },
}));
