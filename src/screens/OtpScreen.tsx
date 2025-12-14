import React, { useRef, useState } from "react";
import { Keyboard, TextInput, TouchableOpacity, SafeAreaView, View, Text } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useToast } from "../context/ToastContext";
import { AuthService } from "../services/AuthService";
import { Loader } from "../components/common/Loader";

type Props = {
    route: RouteProp<RootStackParamList, "OTP">;
    navigation: StackNavigationProp<RootStackParamList, "OTP">;
};

export default function OtpScreen({ route, navigation }: Props) {
    const contactInfo = route.params?.phone ?? "";
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const refs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];
    const toast = useToast();

    const setDigit = (index: number, val: string) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...code];
        next[index] = val;
        setCode(next);
        if (val && index < 5) refs[index + 1].current?.focus();
        if (!val && index > 0) refs[index - 1].current?.focus();
    };

    const onVerify = async () => {
        if (code.some((c) => c === "")) {
            toast.show("Please enter the complete OTP.", "warning");
            return;
        }
        setLoading(true);
        const otp = code.join("");
        Keyboard.dismiss();
        try {
            const response = await AuthService.verifyOtp(contactInfo, otp, contactInfo.includes('@') ? 'email' : 'phone');
            if (response && (response as any).success) {
                toast.show(`Welcome, ${response.user.first_name}`, "success");
                setTimeout(() => {
                    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
                }, 100);
            } else {
                toast.show("Invalid OTP", "error");
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            toast.show("An error occurred", "error");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Loader visible={loading} />
            <View className="flex-1 px-6 justify-center items-center">
                <Text className="text-2xl font-bold mb-2 text-gray-900">OTP Verification</Text>
                <Text className="text-gray-500 mb-2">Enter the OTP sent to</Text>
                <Text className="font-bold mb-6 text-gray-900">{contactInfo}</Text>

                <View className="flex-row justify-center gap-4 mb-6">
                    {code.map((c, i) => (
                        <TextInput
                            key={i}
                            ref={refs[i]}
                            value={c}
                            onChangeText={(v) => setDigit(i, v)}
                            keyboardType="number-pad"
                            maxLength={1}
                            className="w-12 h-12 border border-gray-200 rounded-xl text-center text-xl font-bold bg-gray-50 text-gray-900 focus:border-blue-500"
                            textAlign="center"
                        />
                    ))}
                </View>
                <TouchableOpacity onPress={() => toast.show("OTP Sent!", "info")} className="mt-2">
                    <Text className="text-blue-600 font-semibold underline">Resend OTP</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full bg-blue-600 py-4 rounded-xl shadow-lg shadow-blue-200 items-center mt-8 active:bg-blue-700"
                    onPress={onVerify}
                >
                    <Text className="text-white font-bold text-lg">Verify</Text>
                </TouchableOpacity>

                <TouchableOpacity className="mt-4" onPress={() => navigation.goBack()}>
                    <Text className="text-gray-500">{contactInfo.includes('@') ? 'Change email' : 'Change number'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
