import React from "react";
import { Text, TextInput, View, TextInputProps } from "react-native";

interface FormInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export function FormInput({ label, error, className, ...props }: FormInputProps) {
    return (
        <View className="mb-4">
            {label && <Text className="text-sm font-semibold text-gray-700 mb-1.5">{label}</Text>}
            <TextInput
                className={`bg-white border rounded-xl p-3 text-base text-gray-900 ${error ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                    } ${className}`}
                placeholderTextColor="#9CA3AF"
                {...props}
            />
            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        </View>
    );
}
