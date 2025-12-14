import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { RootStackParamList } from "../types/navigation";
import { AuthService } from "../services/AuthService";

type Props = {
    navigation: StackNavigationProp<RootStackParamList, "Splash">;
};

export default function SplashScreen({ navigation }: Props) {
    useEffect(() => {
        const checkAuth = async () => {
            // Artificial delay for splash effect
            await new Promise(resolve => setTimeout(resolve, 1400));

            const isAuthenticated = AuthService.isAuthenticated();
            if (isAuthenticated) {
                navigation.replace("Main");
            } else {
                navigation.replace("Intro");
            }
        };
        checkAuth();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Image
                    source={require("../../assets/digiqc-logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const PRIMARY = "#1268F8";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PRIMARY,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        alignItems: "center",
    },
    logo: {
        width: 110,
        height: 110,
        marginBottom: 16,
    },
    title: {
        color: "white",
        fontSize: 28,
        fontWeight: "700",
    },
});
