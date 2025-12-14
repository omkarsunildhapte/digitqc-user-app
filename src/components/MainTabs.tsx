import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ClipboardCheck, Home, ListTodo, RefreshCw, UserCheck } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetInfo } from "@react-native-community/netinfo";
import { View, Text } from "react-native";
import DashboardScreen from "../screens/DashboardScreen";
import InspectionScreen from "../screens/InspectionScreen";
import SyncScreen from "../screens/SyncScreen";
import TodoScreen from "../screens/TodoScreen";
import { ApproverScreen } from "../screens/PlaceholderScreens";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    const insets = useSafeAreaInsets();
    const netInfo = useNetInfo();

    return (
        <React.Fragment>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#ffffff",
                        borderTopWidth: 1,
                        borderTopColor: "#e5e7eb",
                        height: 60 + insets.bottom,
                        paddingBottom: insets.bottom + 4,
                        paddingTop: 8,
                    },
                    tabBarActiveTintColor: "#2563eb",
                    tabBarInactiveTintColor: "#9ca3af",
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: "500",
                        marginBottom: 4,
                    }
                }}
            >
                <Tab.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{
                        tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                    }}
                />
                <Tab.Screen
                    name="Inspection"
                    component={InspectionScreen}
                    options={{
                        tabBarIcon: ({ color }) => <ClipboardCheck size={24} color={color} />,
                    }}
                />
                <Tab.Screen
                    name="Todo"
                    component={TodoScreen}
                    options={{
                        tabBarIcon: ({ color }) => <ListTodo size={24} color={color} />,
                    }}
                />
                <Tab.Screen
                    name="Sync"
                    component={SyncScreen}
                    options={{
                        tabBarIcon: ({ color }) => <RefreshCw size={24} color={color} />,
                    }}
                />
                <Tab.Screen
                    name="Approver"
                    component={ApproverScreen}
                    options={{
                        tabBarIcon: ({ color }) => <UserCheck size={24} color={color} />,
                    }}
                />
            </Tab.Navigator>
            {!netInfo.isConnected && (
                <View
                    style={{
                        position: "absolute",
                        bottom: 60 + insets.bottom,
                        left: 0,
                        right: 0,
                        backgroundColor: "#6a5455ff",
                        padding: 6,
                    }}
                >
                    <Text style={{ color: "#fff", textAlign: "center" }}>
                        Offline – Some features may be unavailable
                    </Text>
                </View>
            )}
        </React.Fragment>
    );
}