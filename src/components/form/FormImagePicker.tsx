import React from "react";
import { Text, TouchableOpacity, View, Image, Alert } from "react-native";
import { Camera, Image as ImageIcon, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useToast } from "../../context/ToastContext";

interface FormImagePickerProps {
    label?: string;
    value: string | null;
    onChange: (uri: string | null) => void;
    error?: string;
    mode?: 'camera' | 'gallery' | 'both';
    editable?: boolean;
}

export function FormImagePicker({
    label,
    value,
    onChange,
    error,
    mode = 'both',
    editable = true
}: FormImagePickerProps) {
    const toast = useToast();

    const handlePickImage = async () => {
        if (mode === 'camera') {
            openCamera();
            return;
        }
        if (mode === 'gallery') {
            openGallery();
            return;
        }

        Alert.alert(
            "Upload Photo",
            "Choose a source",
            [
                { text: "Camera", onPress: openCamera },
                { text: "Gallery", onPress: openGallery },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            toast.show("Camera access is needed.", "error");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: editable,
            quality: 0.8,
        });

        if (!result.canceled) {
            onChange(result.assets[0].uri);
        }
    };

    const openGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            toast.show("Gallery access is needed.", "error");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: editable,
            quality: 0.8,
        });

        if (!result.canceled) {
            onChange(result.assets[0].uri);
        }
    };

    return (
        <View className="mb-4">
            {label && <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>}

            {value ? (
                <View className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                    <Image source={{ uri: value }} className="w-full h-full" resizeMode="cover" />
                    <TouchableOpacity
                        onPress={() => onChange(null)}
                        className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full"
                    >
                        <X size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handlePickImage}
                        className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-lg shadow-sm"
                    >
                        <Text className="text-xs font-bold text-gray-900">Change</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={handlePickImage}
                    className={`w-full h-32 rounded-xl border-2 border-dashed items-center justify-center bg-gray-50 ${error ? 'border-red-300' : 'border-gray-300'
                        }`}
                >
                    <View className="items-center">
                        <Camera size={28} color="#9CA3AF" />
                        <Text className="text-gray-500 font-medium mt-2">Tap to add photo</Text>
                    </View>
                </TouchableOpacity>
            )}

            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        </View>
    );
}
