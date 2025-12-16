import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

interface LoaderProps {
    visible?: boolean;
    color?: string;
    size?: 'small' | 'large';
}

export const Loader = ({ visible = true, color = "#2563EB", size = "large" }: LoaderProps) => {
    if (!visible) return null;

    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
    },
});
