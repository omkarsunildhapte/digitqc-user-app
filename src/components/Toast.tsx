import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    visible: boolean;
    message: string;
    type?: ToastType;
    onHide: () => void;
    position?: 'top' | 'bottom';
}

export const Toast: React.FC<ToastProps> = ({
    visible,
    message,
    type = 'info',
    onHide,
    position = 'top'
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    speed: 12,
                    bounciness: 0
                })
            ]).start();

            const timer = setTimeout(() => {
                hideToast();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: position === 'top' ? -100 : 100,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            if (visible) onHide();
        });
    };

    if (!visible) return null;

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            case 'warning': return 'bg-orange-500';
            case 'info': return 'bg-blue-500';
            default: return 'bg-gray-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle color="white" size={20} />;
            case 'error': return <AlertCircle color="white" size={20} />;
            case 'warning': return <AlertCircle color="white" size={20} />; // Or a specific warning icon if needed
            case 'info': return <Info color="white" size={20} />;
        }
    };

    const styles = position === 'top' ? "top-12" : "bottom-12";

    return (
        <Animated.View
            className={`absolute left-4 right-4 z-50 rounded-lg shadow-lg flex-row items-center p-4 ${getBackgroundColor()} ${styles}`}
            style={{
                opacity: fadeAnim,
                transform: [{ translateY }]
            }}
        >
            <View className="mr-3">
                {getIcon()}
            </View>
            <Text className="flex-1 text-white font-medium text-sm">
                {message}
            </Text>
            <TouchableOpacity onPress={hideToast} className="ml-2">
                <X color="white" size={18} />
            </TouchableOpacity>
        </Animated.View>
    );
};
