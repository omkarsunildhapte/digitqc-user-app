import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
    size?: number;
    strokeWidth?: number;
    percentage: number;
    color?: string;
    bgColor?: string;
    label?: string;
    subLabel?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function CircularProgress({
    size = 100,
    strokeWidth = 10,
    percentage = 0,
    color = "#3B82F6",
    bgColor = "#E5E7EB",
    label,
    subLabel
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: percentage,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    }, [percentage]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    return (
        <View className="items-center justify-center">
            <View style={{ width: size, height: size }} className="relative items-center justify-center">
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background Circle */}
                    <Circle
                        stroke={bgColor}
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress Circle */}
                    <AnimatedCircle
                        stroke={color}
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>

                {/* Center Text */}
                <View className="absolute items-center justify-center">
                    <Text className="text-xl font-bold text-gray-800">{percentage}%</Text>
                </View>
            </View>
            {label && <Text className="text-sm font-semibold text-gray-700 mt-2">{label}</Text>}
            {subLabel && <Text className="text-xs text-gray-500">{subLabel}</Text>}
        </View>
    );
}
