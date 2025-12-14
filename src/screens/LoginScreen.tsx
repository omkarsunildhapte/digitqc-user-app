import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, TouchableHighlight } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../components/PrimaryButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import { AuthService } from "../services/AuthService";
import { useToast } from "../context/ToastContext";

export default function LoginScreen() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const toast = useToast();

    // Mode state to switch between Email and Phone
    const [mode, setMode] = useState<"phone" | "email">("phone");

    // Separate states for inputs
    const [phone, setPhone] = useState<string>("");
    const [countryCode, setCountryCode] = useState<string>("+91");
    const [email, setEmail] = useState<string>("");

    const [loading, setLoading] = useState(false);

    // Helpers
    const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const countryCodeValid = (v: string) => /^\+\d{1,3}$/.test(v.trim());

    async function onContinue() {
        Keyboard.dismiss();
        setLoading(true);

        try {
            if (mode === "phone") {
                // Phone Validation using AuthService
                if (!countryCodeValid(countryCode)) {
                    Alert.alert("Invalid country code", "Please enter a valid country code (e.g., +91).");
                    setLoading(false);
                    return;
                }

                const digits = phone.replace(/\D/g, "");

                // Validate using AuthService (it handles length and regex based on country code)
                const validation = AuthService.validatePhone(digits, countryCode);

                if (!validation.valid) {
                    Alert.alert("Invalid phone", validation.error || "Phone number is invalid.");
                    setLoading(false);
                    return;
                }

                // Send OTP for Phone
                const fullPhoneNumber = countryCode + phone;
                const response = await AuthService.sendOtp(fullPhoneNumber);

                if (response && (response as any).success) {
                    toast.show("OTP Sent Successfully!", "success");
                    navigation.navigate("OTP", { phone: fullPhoneNumber });
                } else {
                    Alert.alert("Error", "Failed to send OTP. Please try again.");
                }

            } else {
                // Email Validation
                if (!emailValid(email)) {
                    Alert.alert("Invalid Email", "Please enter a valid email address.");
                    setLoading(false);
                    return;
                }

                if (!AuthService.validateEmail(email)) {
                    Alert.alert("Invalid Email", "Email format is incorrect.");
                    setLoading(false);
                    return;
                }

                // Send OTP for Email
                const response = await AuthService.sendOtp(email);

                if (response && (response as any).success) {
                    toast.show("OTP Sent Successfully!", "success");
                    navigation.navigate("OTP", { phone: email }); // reuse 'phone' param as identifier
                } else {
                    Alert.alert("Error", "Failed to send OTP. Please try again.");
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 bg-white px-6 justify-center">
                    <View className="items-center mb-10">
                        <Text className="text-3xl font-bold text-gray-900">Welcome to DigiQC</Text>
                        <Text className="text-base text-gray-500 mt-2">Sign in to continue</Text>
                    </View>

                    {/* Mode Toggle */}
                    <View className="flex-row mb-8 bg-gray-100 p-1 rounded-xl">
                        <TouchableOpacity
                            className={`flex-1 py-3 rounded-lg items-center ${mode === 'phone' ? 'bg-white shadow-sm' : ''}`}
                            onPress={() => setMode('phone')}
                        >
                            <Text className={`font-semibold ${mode === 'phone' ? 'text-blue-600' : 'text-gray-500'}`}>Phone</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 py-3 rounded-lg items-center ${mode === 'email' ? 'bg-white shadow-sm' : ''}`}
                            onPress={() => {
                                console.log("Switching to Email Mode");
                                setMode('email');
                            }}
                        >
                            <Text className={`font-semibold ${mode === 'email' ? 'text-blue-600' : 'text-gray-500'}`}>Email</Text>
                        </TouchableOpacity>
                    </View>

                    {mode === 'phone' ? (
                        <View className="mb-6">
                            <Text className="text-gray-700 font-semibold mb-2 ml-1">Phone Number</Text>
                            <View className="flex-row gap-3">
                                <TextInput
                                    className="w-20 bg-gray-50 border border-gray-300 rounded-xl px-2 py-4 text-gray-900 text-lg text-center"
                                    value={countryCode}
                                    onChangeText={setCountryCode}
                                    keyboardType="phone-pad"
                                    maxLength={4}
                                />
                                <TextInput
                                    className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-gray-900 text-lg"
                                    placeholder="Mobile Number"
                                    placeholderTextColor="#9CA3AF"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                />
                            </View>
                        </View>
                    ) : (
                        <View className="mb-6">
                            <Text className="text-gray-700 font-semibold mb-2 ml-1">Email Address</Text>
                            <TextInput
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-gray-900 text-lg"
                                placeholder="name@example.com"
                                placeholderTextColor="#9CA3AF"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    )}

                    <PrimaryButton
                        title={loading ? "Sending..." : "Send OTP"}
                        onPress={onContinue}
                        disabled={loading}
                    />

                    <View className="mt-8">
                        <Text className="text-xs text-gray-400 text-center px-8 leading-5">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}


