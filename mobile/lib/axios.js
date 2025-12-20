import axios from "axios";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.Authorization;
    }
};

export default api;