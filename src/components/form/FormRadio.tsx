import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CheckCircle, Circle } from "lucide-react-native";

interface Option {
    label: string;
    value: any;
}

interface FormRadioProps {
    label?: string;
    options: Option[] | string[];
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

export function FormRadio({ label, options, value, onChange, error }: FormRadioProps) {
    const normalizedOptions = options.map(opt =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    return (
        <View className="mb-4">
            {label && <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>}
            <View className="flex-row flex-wrap gap-2">
                {normalizedOptions.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <TouchableOpacity
                            key={String(option.value)}
                            onPress={() => onChange(option.value)}
                            className={`flex-row items-center px-4 py-2.5 rounded-full border ${isSelected ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'
                                }`}
                        >
                            {isSelected ? (
                                <CheckCircle size={16} color="#2563EB" />
                            ) : (
                                <Circle size={16} color="#9CA3AF" />
                            )}
                            <Text className={`ml-2 font-medium ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        </View>
    );
}
