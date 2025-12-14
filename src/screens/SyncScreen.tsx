import { RefreshCcw, WifiOff, Cloud } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSync } from "../context/SyncContext";
import { PROJECTS } from "../constants/data";

export default function SyncScreen() {
    const { queue, retryItem } = useSync();

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "left", "right"]}>
            <View className="px-6 py-4 bg-white border-b border-gray-200">
                <Text className="text-2xl font-bold text-gray-900">Sync Status</Text>
                <Text className="text-gray-500">Manage offline inspections</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {queue.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <View className="mb-4 bg-green-100 p-6 rounded-full">
                            <Cloud size={48} color="#059669" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900">All Synced!</Text>
                        <Text className="text-gray-500 text-center mt-2 px-8">
                            You have no pending offline data correctly. Everything is up to date.
                        </Text>
                    </View>
                ) : (
                    <View>
                        <View className="flex-row items-center mb-4 bg-orange-50 p-3 rounded-lg border border-orange-100">
                            <WifiOff size={20} color="#ea580c" />
                            <Text className="ml-2 text-orange-700 font-medium">
                                {queue.length} item{queue.length !== 1 ? 's' : ''} waiting to upload
                            </Text>
                        </View>

                        {queue.map((item) => (
                            <View key={item.id} className="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-200">
                                <View className="flex-row justify-between items-start mb-2">
                                    <View>
                                        <Text className="font-bold text-gray-900 text-base">
                                            {item.type === 'inspection_submit' ? 'Inspection Submission' : 'Image Upload'}
                                        </Text>
                                        <Text className="text-xs text-gray-500 mt-1">
                                            ID: {item.id}
                                        </Text>
                                        <Text className="text-xs text-gray-400 mt-0.5">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </Text>
                                    </View>
                                    <View className={`px-2 py-1 rounded ${item.status === 'failed' ? 'bg-red-100' : 'bg-blue-100'}`}>
                                        <Text className={`text-xs font-bold ${item.status === 'failed' ? 'text-red-700' : 'text-blue-700'}`}>
                                            {item.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                {item.type === 'inspection_submit' && (
                                    <View className="mb-3 bg-gray-50 p-2 rounded">
                                        <Text className="text-xs text-gray-600">
                                            Project: {PROJECTS.find((p: any) => p.id === '1')?.name || 'Project'} • Items: {item.data?.questions?.length || 0}
                                        </Text>
                                    </View>
                                )}

                                <View className="flex-row justify-end space-x-2 border-t border-gray-100 pt-3">
                                    <TouchableOpacity
                                        className="flex-row items-center px-3 py-2 bg-gray-100 rounded-lg"
                                        onPress={() => retryItem(item.id)}
                                    >
                                        <RefreshCcw size={16} color="#374151" />
                                        <Text className="ml-2 text-xs font-bold text-gray-700">Retry Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
