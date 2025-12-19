import { create } from "zustand";
import axiosInstance from "../lib/axios";

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    checkAuth: async () => {
        set({ loading: true });
        try {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                set({ user: JSON.parse(storedUser) });
            } else {
                set({ user: null });
            }
        } catch (error) {
            console.error("Failed to parse stored user", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },

    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post("/auth/login", {
                email,
                password,
                device: "web",
            });

            const { user, token } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            set({ user, loading: false });
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            set({ loading: false });
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    },

    signup: async (name, email, password, confirmPassword) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.post("/auth/register", {
                name,
                email,
                password,
                confirmPassword,
                device: "web",
            });

            const { user, token } = res.data;

            if (token) localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            set({ user, loading: false });
            console.log("Signup successful", user);
            return { success: true };
        } catch (error) {
            console.error("Signup error:", error);
            set({ loading: false });
            return { success: false, message: error.response?.data?.message || "Signup failed" };
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout", { device: "web" });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            set({ user: null });
        }
    },
}));
