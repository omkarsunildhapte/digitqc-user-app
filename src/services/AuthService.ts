import apiClient from './ApiClientService';
import { TENANT_ID } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthService = {
    setSession: async (newToken: string, newUser?: any) => {
        apiClient.setAuthToken(newToken);
        await AsyncStorage.setItem('auth_token', newToken);
        if (newUser) {
            await AsyncStorage.setItem('auth_user', JSON.stringify(newUser));
        }
    },
    loadSession: async () => {
        const storedToken = await AsyncStorage.getItem('auth_token');
        const storedUser = await AsyncStorage.getItem('auth_user');
        if (storedToken) {
            apiClient.setAuthToken(storedToken);
        }
        if (storedUser) {
            return { user: JSON.parse(storedUser), token: storedToken };
            // Note: Updated return signature to be more useful, or keep as is?
            // Existing usage in SplashScreen: const { user } = ...
            // Wait, previous SplashScreen fix was: const user = await AuthService.loadSession(); (Step 423)
            // But verifyOtp calls setSession, doesn't use loadSession.
            // Let's look at SplashScreen usage again.
            // Step 428/429 (User edit): const user = await AuthService.loadSession();
            // Step 515 (current file): returns JSON.parse(storedUser) OR null.
            // If I change return type, I break SplashScreen.
            // User code in Step 416/428 EXPECTS user object.
        }
        return null;
    },
    getToken: async () => {
        return await AsyncStorage.getItem('auth_token');
    },
    validateEmail: (email: string) => {
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim());
    },
    validatePhone: (phone: string, countryCode: string) => {
        const digits = phone.replace(/\D/g, "");
        const lengthMap: Record<string, number> = {
            "+91": 10,
            "+1": 10,
            "+44": 10,
        };
        const requiredLength = lengthMap[countryCode];

        if (requiredLength && digits.length !== requiredLength) {
            return { valid: false, error: `Phone number for ${countryCode} must be exactly ${requiredLength} digits.` };
        }

        const regexMap: Record<string, RegExp> = {
            "+91": /^[6-9]\d{9}$/,
            "+1": /^\d{10}$/,
            "+44": /^\d{10}$/,
        };
        const pattern = regexMap[countryCode];

        if (pattern && !pattern.test(digits)) {
            return { valid: false, error: `Phone number does not match required format for ${countryCode}.` };
        }

        return { valid: true };
    },
    sendOtp: async (identifier: string, type: 'email' | 'phone' = "phone") => {
        try {
            const isEmail = type == 'email' ? true : false;
            const loginType = isEmail ? 'email' : 'phone';
            const payload = {
                phone: isEmail ? undefined : identifier,
                tenant_id: TENANT_ID,
                email: isEmail ? identifier : undefined,
                loginType: loginType,
            };
            const response = await apiClient.login(payload);
            return { success: true, message: response.data.message || "OTP sent successfully" };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || "Failed to send OTP"
            };
        }
    },
    verifyOtp: async (identifier: string, otp: string, type: 'email' | 'phone' = "phone") => {
        try {
            const isEmail = type == 'email' ? true : false;
            const loginType = type == 'email' ? 'email' : 'phone';
            const payload = {
                phone: isEmail ? undefined : identifier,
                email: isEmail ? identifier : undefined,
                tenant_id: TENANT_ID,
                loginType: loginType,
                otp: otp
            };
            const response = await apiClient.verifyOtp(payload);
            if (response.data && response.data.token) {
                const { token: newToken, user: newUser } = response.data;
                AuthService.setSession(newToken, newUser);
                return { success: true, user: newUser };
            } else {
                return { success: false, error: "Invalid response from server" };
            }
        } catch (error: any) {
            console.error("Login Error:", error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || "Login failed"
            };
        }
    },
    logout: async () => {
        apiClient.setAuthToken(null);
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('auth_user');
        return Promise.resolve(true);
    },
    getUser: async () => {
        return await AsyncStorage.getItem('auth_user');
    },
    isAuthenticated: async () => {
        const token = await AsyncStorage.getItem('auth_token');
        return !!token;
    }
}