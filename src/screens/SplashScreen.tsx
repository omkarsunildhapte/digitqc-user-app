import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { RootStackParamList } from "../types/navigation";
import { AuthService } from "../services/AuthService";
import { registerForPushNotificationsAsync } from "../services/NotificationService";

type Props = {
    navigation: StackNavigationProp<RootStackParamList, "Splash">;
};

export default function SplashScreen({ navigation }: Props) {
    useEffect(() => {
        const checkAuth = async () => {
            await new Promise(resolve => setTimeout(resolve, 1400));
            try {
                const user = await AuthService.loadSession();

                if (user) {
                    if (user.id) {
                        registerForPushNotificationsAsync(user.id).catch(err => console.error("Push Reg Failed", err));
                    }
                    navigation.replace("Main");
                } else {
                    navigation.replace("Intro");
                }
            } catch (error) {
                console.error("Session load failed", error);
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
