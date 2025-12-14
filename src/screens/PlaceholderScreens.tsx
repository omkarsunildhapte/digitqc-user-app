import React from "react";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function InspectionScreen() {
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-white">
            <Text className="text-xl font-bold text-gray-900">Inspection Screen</Text>
            <Text className="text-gray-500">Coming Soon</Text>
        </SafeAreaView>
    );
}



export function SettingsScreen() {
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-white">
            <Text className="text-xl font-bold text-gray-900">Settings Screen</Text>
            <Text className="text-gray-500">Coming Soon</Text>
        </SafeAreaView>
    );
}

export function ApproverScreen() {
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-white">
            <Text className="text-xl font-bold text-gray-900">Approver Screen</Text>
            <Text className="text-gray-500">Approvals Pending</Text>
        </SafeAreaView>
    );
}
