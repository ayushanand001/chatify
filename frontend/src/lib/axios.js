import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, "")}/api`
    : (import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api");

export const axiosInstance = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("chatify_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


