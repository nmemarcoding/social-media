import axios from "axios";
import Cookies from 'js-cookie';

const BASE_URL = "http://localhost:3231/api/";
const TOKEN_COOKIE_NAME = 'auth_token';

// Function to set auth token in cookie
export const setAuthToken = (token) => {
    if (!token) return;
    console.log('Setting auth token:', token);
    Cookies.set(TOKEN_COOKIE_NAME, token, { expires: 7 }); // Cookie expires in 7 days
};

// Function to get auth token from cookie
export const getAuthToken = () => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    return token;
};

// Function to remove auth token from cookie
export const removeAuthToken = () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
};

// Modified publicRequest to use cookie-based token
export const publicRequest = () => {
    const token = getAuthToken();
    
    const instance = axios.create({
        baseURL: BASE_URL,
        withCredentials: true, // Keep credentials
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}` })
        }
    });

    // Add request interceptor to always use the latest token
    instance.interceptors.request.use(
        (config) => {
            const currentToken = getAuthToken();
            if (currentToken && config.headers) {
                config.headers.Authorization = currentToken.startsWith('Bearer ') 
                    ? currentToken 
                    : `Bearer ${currentToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Modified response interceptor
    instance.interceptors.response.use(
        (response) => {
            // Extract token from headers (case insensitive)
            const headers = response.headers;
            const xAuthToken = 
                headers['x-auth-token'] || 
                headers['X-Auth-Token'] || 
                response.data?.token ||
                response.data?.accessToken;
                
            if (xAuthToken) {
                console.log('Received new token:', xAuthToken);
                setAuthToken(xAuthToken);
            }
            return response;
        },
        (error) => {
            console.error('Request error:', error);
            if (error.response?.status === 401) {
                removeAuthToken();
            }
            return Promise.reject(error);
        }
    );

    return instance;
};
