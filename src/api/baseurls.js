// src/api/baseurls.js (Modified)
import axios from 'axios';

// Base URL for API requests
export const BASE_URL = 'https://admin.easyexam.online/api';

// TokenManager to handle JWT access and refresh tokens
export const TokenManager = {
    // ... (setToken and getToken functions same rahenge)
    setToken: (accessToken) => {
        if (accessToken) {
            localStorage.setItem('access_token', accessToken);
            console.log("Access token saved.");
        }
    },
    getToken: () => {
        return localStorage.getItem('access_token');
    },
};

// ----------------------------------------------------
// 🎯 Axios Instance with Interceptor (Zaroori Kadam)

const api = axios.create({
    baseURL: BASE_URL,
});

// Request Interceptor: Har outgoing request mein token add karega
api.interceptors.request.use(
    (config) => {
        const token = TokenManager.getToken();
        if (token) {
            // Header ko har request mein automatically add karein
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Ab aap sirf 'api' ko export karein aur isse use karein
export default api;