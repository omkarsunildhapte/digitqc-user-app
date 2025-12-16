import axios, { AxiosInstance } from 'axios';
import { API_BASE, TENANT_ID } from '../config/env';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Debugging headers
        // console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const ApiClientService = {
    setAuthToken: (token: string | null) => {
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    },
    getUserbyIdentifier: async (identifier: string, type: 'email' | 'phone') => {
        try {
            if (type === 'email') {
                return await axiosInstance.get(`/api/tenant-users/email/${identifier}`, {
                    params: {
                        tenant_id: TENANT_ID
                    }
                });
            } else {
                return await axiosInstance.get(`/api/tenant-users/phone/${identifier}`, {
                    params: {
                        tenant_id: TENANT_ID
                    }
                });
            }
        } catch (error) {
            console.error("API getUserbyIdentifier Error:", JSON.stringify(error));
            throw error;
        }
    },
    login: async (payload: { phone?: string; email?: string; tenant_id: any; loginType: string }) => {
        try {
            return await axiosInstance.post(`/api/tenant-users/login`, payload);
        } catch (error) {
            console.error("API login Error:", error);
            throw error;
        }
    },
    verifyOtp: async (payload: { phone?: string; email?: string; tenant_id: any; loginType: string, otp: string }) => {
        try {
            return await axiosInstance.post(`/api/tenant-users/verify-otp`, payload);
        } catch (error) {
            console.error("API verifyOtp Error:", error);
            throw error;
        }
    },
    registerMobileToken: async (payload: any) => {
        try {
            // Header is set globally via setAuthToken
            return await axiosInstance.post(`/api/notifications/fcm/register-mobile-token`, payload);
        } catch (error: any) {
            if (error.response) {
                console.error('API registerMobileToken Response Error:', error.response.data);
                console.error('API registerMobileToken Response Status:', error.response.status);
            }
            console.error('API registerMobileToken Error:', JSON.stringify(error));
            throw error;
        }
    }
};

export default ApiClientService;