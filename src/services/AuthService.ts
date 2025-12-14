
let token: string | null = null;
let user: any | null = null;

const MOCK_USER = {
    id: 'user_123',
    name: 'John Doe',
    role: 'Site Engineer',
    token: 'mock-jwt-token-xyz'
};

export const AuthService = {
    // Sets the authentication token and user data
    setSession: (newToken: string, newUser?: any) => {
        token = newToken;
        if (newUser) {
            user = newUser;
        }
        // TODO: Persist token using SecureStore if needed
    },

    // Gets the current authentication token
    getToken: () => {
        return token;
    },

    /**
     * Helper to decode JWT (basic implementation) usually usage jwt-decode
     */
    // decodeToken: (token: string) => { ... }

    // Validates email format
    validateEmail: (email: string) => {
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim());
    },

    // Validates phone number based on country code
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

    // Sends OTP to the provided identifier (Phone or Email)
    sendOtp: async (identifier: string) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: "OTP sent successfully" });
            }, 1000);
        });
    },

    // Verifies the OTP
    verifyOtp: async (identifier: string, otp: string) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                if (otp === '1234') {
                    // For legacy/mock flow, we set the mock user
                    const mockToken = MOCK_USER.token;
                    AuthService.setSession(mockToken, MOCK_USER);
                    resolve({ success: true, token: mockToken, user: MOCK_USER });
                } else {
                    resolve({ success: false, error: 'Invalid OTP' });
                }
            }, 1000);
        });
    },

    // Original login method kept for compatibility, mapping to sendOtp
    login: async (identifier: string) => {
        return AuthService.sendOtp(identifier);
    },

    logout: async () => {
        token = null;
        user = null;
        return Promise.resolve(true);
    },

    getUser: () => {
        return user || MOCK_USER; // Fallback for now to keep app running
    },

    isAuthenticated: () => {
        return !!token;
    }
};
