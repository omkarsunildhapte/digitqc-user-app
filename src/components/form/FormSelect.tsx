import React, { useState } from "react";
import { Text, TouchableOpacity, View, Modal, ScrollView } from "react-native";
import { ChevronDown, X, Check } from "lucide-react-native";

interface Option {
    label: string;
    value: any;
}

interface FormSelectProps {
    label?: string;
    options: Option[] | string[];
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    error?: string;
}

export function FormSelect({ label, options, value, onChange, placeholder = "Select an option", error }: FormSelectProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const normalizedOptions = options.map(opt =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    const selectedOption = normalizedOptions.find(opt => opt.value === value);

    const handleSelect = (val: any) => {
        onChange(val);
        setModalVisible(false);
    };

    return (
        <View className="mb-4">
            {label && <Text className="text-sm font-semibold text-gray-700 mb-1.5">{label}</Text>}

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className={`bg-white border rounded-xl p-3 flex-row justify-between items-center ${error ? 'border-red-500' : 'border-gray-200'
                    }`}
            >
                <Text className={`text-base ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>

            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70%]">
                        <View className="p-4 border-b border-gray-100 flex-row justify-between items-center bg-gray-50 rounded-t-3xl">
                            <Text className="text-lg font-bold text-gray-900">{label || "Select Option"}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1 bg-gray-200 rounded-full">
                                <X size={20} color="#374151" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ padding: 16 }}>
                            {normalizedOptions.map((option) => (
                                <TouchableOpacity
                                    key={String(option.value)}
                                    onPress={() => handleSelect(option.value)}
                                    className={`flex-row justify-between items-center p-4 rounded-xl mb-2 ${value === option.value ? 'bg-blue-50 border border-blue-100' : 'bg-white border border-gray-100'
                                        }`}
                                >
                                    <Text className={`text-base font-medium ${value === option.value ? 'text-blue-700' : 'text-gray-700'}`}>
                                        {option.label}
                                    </Text>
                                    {value === option.value && <Check size={20} color="#2563EB" />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
