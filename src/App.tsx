import "../global.css";
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./screens/SplashScreen";
import IntroScreen from "./screens/IntroScreen";
import LoginScreen from "./screens/LoginScreen";
import OtpScreen from "./screens/OtpScreen";
import MainDrawer from "./components/MainDrawer";
import { useEffect } from "react";
import InspectionFormScreen from "./screens/InspectionFormScreen";
import { SyncProvider } from "./context/SyncContext";
import NotificationScreen from "./screens/NotificationScreen";
import { ToastProvider } from "./context/ToastContext";

import { RootStackParamList } from "./types/navigation";
enableScreens();
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => { }, []);

  return (
    <SafeAreaProvider>
      <SyncProvider>
        <ToastProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Intro" component={IntroScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="OTP" component={OtpScreen} />
              <Stack.Screen name="Main" component={MainDrawer} />
              <Stack.Screen name="InspectionForm" component={InspectionFormScreen} />
              <Stack.Screen name="Notification" component={NotificationScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ToastProvider>
      </SyncProvider>
    </SafeAreaProvider>
  );
}