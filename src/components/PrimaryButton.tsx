import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

type Props = {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
};

export default function PrimaryButton({ title, onPress, isLoading, disabled }: Props) {
    return (
        <TouchableOpacity
            className={`w-full bg-blue-600 py-4 rounded-xl shadow-lg shadow-blue-200 items-center justify-center ${disabled ? "opacity-50" : "active:bg-blue-700"
                }`}
            onPress={onPress}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className="text-white text-center font-semibold text-lg">{title}</Text>
            )}
        </TouchableOpacity>
    );
}
