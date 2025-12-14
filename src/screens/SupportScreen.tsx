import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Phone, MessageCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function SupportScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
            <View className="flex-row items-center p-4 bg-white shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                    <ArrowLeft size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Support</Text>
            </View>

            <ScrollView className="p-4">
                <Text className="text-gray-500 mb-6">How can we help you today?</Text>

                <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                    <View className="flex-row items-center mb-2">
                        <Mail size={24} color="#2563EB" />
                        <Text className="ml-3 text-lg font-semibold text-gray-900">Email Us</Text>
                    </View>
                    <Text className="text-gray-600 ml-9">support@digitqc.com</Text>
                </View>

                <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                    <View className="flex-row items-center mb-2">
                        <Phone size={24} color="#16A34A" />
                        <Text className="ml-3 text-lg font-semibold text-gray-900">Call Us</Text>
                    </View>
                    <Text className="text-gray-600 ml-9">+1 (800) 123-4567</Text>
                </View>

                <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                    <View className="flex-row items-center mb-2">
                        <MessageCircle size={24} color="#F59E0B" />
                        <Text className="ml-3 text-lg font-semibold text-gray-900">Live Chat</Text>
                    </View>
                    <Text className="text-gray-600 ml-9">Available 9am - 5pm EST</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
