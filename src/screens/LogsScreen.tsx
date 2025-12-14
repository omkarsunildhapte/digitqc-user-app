import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { MOCK_LOGS, LogItem } from '../constants/data';

export default function LogsScreen() {
    const navigation = useNavigation();
    const renderItem = ({ item }: { item: LogItem }) => (
        <View className="flex-row items-center p-4 bg-white border-b border-gray-100">
            <FileText size={20} color="#6B7280" />
            <View className="ml-4 flex-1">
                <Text className="text-gray-900 font-medium">{item.fileName}</Text>
                <Text className="text-gray-500 text-sm">{item.date}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
            <View className="flex-row items-center p-4 bg-white shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">System Logs</Text>
            </View>
            <FlatList
                data={MOCK_LOGS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
}