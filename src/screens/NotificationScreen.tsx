import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronLeft, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react-native';
import { Notification, MOCK_NOTIFICATIONS } from '../constants/data';

export default function NotificationScreen({ navigation }: any) {
    const renderItem = ({ item }: { item: Notification }) => {
        let IconComponent = Info;
        let iconColor = "#3B82F6"; // blue
        let bgColor = "bg-blue-50";

        switch (item.type) {
            case 'success':
                IconComponent = CheckCircle;
                iconColor = "#10B981"; // green
                bgColor = "bg-green-50";
                break;
            case 'warning':
                IconComponent = AlertTriangle;
                iconColor = "#F59E0B"; // yellow
                bgColor = "bg-yellow-50";
                break;
            case 'alert':
                IconComponent = Bell;
                iconColor = "#EF4444"; // red
                bgColor = "bg-red-50";
                break;
        }

        return (
            <TouchableOpacity className={`flex-row p-4 mb-3 rounded-xl border ${item.read ? 'bg-white border-gray-100' : 'bg-blue-50/30 border-blue-100'}`}>
                <View className={`w-10 h-10 ${bgColor} rounded-full justify-center items-center mr-4`}>
                    <IconComponent size={20} color={iconColor} />
                </View>
                <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text className={`text-base font-bold ${item.read ? 'text-gray-900' : 'text-blue-900'}`}>{item.title}</Text>
                        <Text className="text-xs text-gray-400">{item.time}</Text>
                    </View>
                    <Text className="text-gray-600 leading-5">{item.message}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "left", "right"]}>
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 bg-white shadow-sm mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <ChevronLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Notifications</Text>
            </View>

            {/* List */}
            <FlatList
                data={MOCK_NOTIFICATIONS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 24 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Bell size={48} color="#D1D5DB" />
                        <Text className="text-gray-400 mt-4">No notifications yet</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
