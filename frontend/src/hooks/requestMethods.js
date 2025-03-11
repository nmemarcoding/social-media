import axios from "axios";
import Cookies from 'js-cookie';

const BASE_URL = "http://localhost:3231/api/";
const TOKEN_COOKIE_NAME = 'auth_token';

// Function to set auth token in cookie
export const setAuthToken = (token) => {
    if (!token) return;

    Cookies.set(TOKEN_COOKIE_NAME, token, { expires: 7 }); // Cookie expires in 7 days
};

// Function to store user information in localStorage
export const setUserInfo = (userData) => {
    if (!userData) return;
  
    localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePicture: userData.profilePicture,
        coverPhoto: userData.coverPhoto,
        bio: userData.bio
    }));
};

// Function to get user information from localStorage
export const getUserInfo = () => {
    const userInfo = localStorage.getItem('user');
    return userInfo ? JSON.parse(userInfo) : null;
};

// Function to remove user information from localStorage
export const removeUserInfo = () => {
    localStorage.removeItem('user');
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
