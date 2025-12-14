import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, TextInput, FlatList, SafeAreaView } from 'react-native';
import { X, Search } from 'lucide-react-native';

interface SearchableSelectModalProps {
    visible: boolean;
    options: string[];
    onSelect: (item: string) => void;
    onClose: () => void;
    title: string;
}

export function SearchableSelectModal({ visible, options, onSelect, onClose, title }: SearchableSelectModalProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOptions = options.filter(option =>
        option.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
    );

    const handleSelect = (item: string) => {
        onSelect(item);
        setSearchQuery(''); // Reset search
    };

    const handleClose = () => {
        onClose();
        setSearchQuery('');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <SafeAreaView className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl h-[80%] flex-1 mt-20">
                    {/* Header */}
                    <View className="px-6 py-4 border-b border-gray-200 flex-row justify-between items-center bg-gray-50 rounded-t-3xl">
                        <Text className="text-lg font-bold text-gray-800 flex-1">
                            {title}
                        </Text>
                        <TouchableOpacity onPress={handleClose} className="p-2 bg-gray-200 rounded-full">
                            <X size={20} color="#4B5563" />
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View className="p-4 border-b border-gray-100">
                        <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
                            <Search size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-3 text-base text-gray-900"
                                placeholder="Search..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* List */}
                    <FlatList
                        data={filteredOptions}
                        keyExtractor={(item) => item}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ padding: 16 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleSelect(item)}
                                className="py-4 border-b border-gray-100 active:bg-blue-50"
                            >
                                <Text className="text-gray-800 text-base font-medium">{item}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={() => (
                            <View className="py-8 items-center">
                                <Text className="text-gray-500">No matching items found</Text>
                            </View>
                        )}
                    />
                </View>
            </SafeAreaView>
        </Modal>
    );
}
