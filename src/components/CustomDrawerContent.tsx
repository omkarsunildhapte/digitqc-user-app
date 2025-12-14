import { DrawerContentScrollView } from '@react-navigation/drawer';
import { FileText, HelpCircle, LogOut } from 'lucide-react-native';
import React from 'react';
import { Alert, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../services/AuthService';

export default function CustomDrawerContent(props: any) {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
            <StatusBar barStyle="dark-content" />

            <View className="p-6 border-b border-gray-100 items-center pt-10">
                <View className="w-20 h-20 bg-blue-100 rounded-full justify-center items-center mb-3">
                    <Text className="text-2xl font-bold text-blue-600">JD</Text>
                </View>
                <Text className="text-lg font-bold text-gray-900">John Doe</Text>
                <Text className="text-gray-500">john.doe@example.com</Text>
            </View>

            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 10, flexGrow: 1 }}>
                <View className="px-4">
                    <DrawerItem icon={<HelpCircle size={22} color="#4B5563" />} label="Support" onPress={() => props.navigation.navigate('Support')} />
                    <DrawerItem icon={<FileText size={22} color="#4B5563" />} label="View Logs" onPress={() => props.navigation.navigate('Logs')} />
                </View>

            </DrawerContentScrollView>

            <View className="p-4 ">
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Logout",
                            "Are you sure you want to logout?",
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "Logout",
                                    style: "destructive",
                                    onPress: async () => {
                                        await AuthService.logout();
                                        props.navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Login' }],
                                        });
                                    }
                                }
                            ]
                        );
                    }}
                    className="flex-row items-center p-3 mb-2 bg-red-50 rounded-xl justify-center"
                >
                    <LogOut size={20} color="#EF4444" />
                    <Text className="text-red-600 font-semibold ml-3">Logout</Text>
                </TouchableOpacity>
                <Text className="text-center text-gray-400 text-xs border-t border-gray-100 pt-3 mt-4">App Version 1.0.0</Text>
            </View>
        </SafeAreaView>
    );
}

const DrawerItem = ({ icon, label, onPress }: any) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-4 px-2 active:bg-gray-50 rounded-lg mb-1">
        {icon}
        <Text className="ml-4 text-gray-700 font-medium text-base">{label}</Text>
    </TouchableOpacity>
);