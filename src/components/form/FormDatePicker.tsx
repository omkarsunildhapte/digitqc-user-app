import React, { useState } from "react";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import { Calendar, Clock, X } from "lucide-react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

interface FormDatePickerProps {
    label?: string;
    value: Date | null;
    onChange: (date: Date) => void;
    mode?: 'date' | 'time' | 'datetime';
    error?: string;
}

export function FormDatePicker({ label, value, onChange, mode = 'date', error }: FormDatePickerProps) {
    const [show, setShow] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShow(Platform.OS === 'ios'); // Keep open on iOS, close on Android
        if (selectedDate) {
            if (mode === 'datetime') {
                // If customized logic needed for both date & time, handle here. 
                // Basic implementation handles one picker. 
                // For simplified UX, we might need two pickers or just rely on native behavior.
                onChange(selectedDate);
            } else {
                onChange(selectedDate);
            }
        }
        if (event.type === 'dismissed') {
            setShow(false);
        }
    };

    const formatDate = (date: Date) => {
        if (mode === 'time') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (mode === 'date') return date.toLocaleDateString();
        return date.toLocaleString();
    };

    return (
        <View className="mb-4">
            {label && <Text className="text-sm font-semibold text-gray-700 mb-1.5">{label}</Text>}

            <TouchableOpacity
                onPress={() => setShow(true)}
                className={`bg-white border rounded-xl p-3 flex-row justify-between items-center ${error ? 'border-red-500' : 'border-gray-200'
                    }`}
            >
                <Text className={`text-base ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                    {value ? formatDate(value) : (mode === 'time' ? 'Select Time' : 'Select Date')}
                </Text>
                {mode === 'time' ? <Clock size={20} color="#6B7280" /> : <Calendar size={20} color="#6B7280" />}
            </TouchableOpacity>

            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

            {show && (
                <DateTimePicker
                    value={value || new Date()}
                    mode={mode as any} // 'datetime' on Android needs care, usually defaults to date then time
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                />
            )}
        </View>
    );
}
