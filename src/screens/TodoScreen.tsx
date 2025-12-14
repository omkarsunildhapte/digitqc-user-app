import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, LayoutAnimation, Platform, UIManager, Modal, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Clock, AlertCircle, Plus, Trash2, Search, Filter, X, Camera, MessageSquare, ChevronRight, Calendar } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { TODO_LIST } from '../constants/data';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function TodoScreen() {
    // Local state initialized with mock data
    const [tasks, setTasks] = useState(TODO_LIST.map(t => ({
        ...t,
        id: t.id.toString(),
        proof: null as string | null,
        comment: '' as string
    })));
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [commentText, setCommentText] = useState('');

    const openTaskModal = (task: any) => {
        setSelectedTask(task);
        setCommentText(task.comment || '');
        setModalVisible(true);
    };

    const closeTaskModal = () => {
        setModalVisible(false);
        setSelectedTask(null);
    };

    const saveTaskDetails = () => {
        if (selectedTask) {
            setTasks(prev => prev.map(t =>
                t.id === selectedTask.id ? { ...t, comment: commentText, proof: selectedTask.proof } : t
            ));
            closeTaskModal();
        }
    };

    const handleCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission needed", "Camera permission is required to add proof.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setSelectedTask((prev: any) => ({ ...prev, proof: result.assets[0].uri }));
        }
    };

    const toggleStatus = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTasks(prev => prev.map(task => {
            if (task.id === id) {
                const newStatus = task.status === 'completed' ? 'pending' : 'completed';
                return {
                    ...task,
                    status: newStatus,
                    color: newStatus === 'completed' ? '#10B981' : '#F59E0B',
                    icon: newStatus === 'completed' ? 'check' : 'clock',
                    time: newStatus === 'completed' ? 'Completed just now' : 'Updated just now'
                };
            }
            return task;
        }));
    };

    const deleteTask = (id: string) => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to remove this task?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setTasks(prev => prev.filter(t => t.id !== id));
                        if (selectedTask?.id === id) closeTaskModal();
                    }
                }
            ]
        );
    };

    const styles = {
        all: "bg-gray-900 border-gray-900",
        pending: "bg-orange-500 border-orange-500",
        completed: "bg-green-600 border-green-600"
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (filter === 'all') return matchesSearch;
        if (filter === 'completed') return matchesSearch && task.status === 'completed';
        return matchesSearch && task.status !== 'completed';
    });

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "left", "right"]}>
            {/* Header */}
            <View className="px-6 py-4 bg-white border-b border-gray-100 shadow-sm z-10">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-3xl font-bold text-gray-900 tracking-tight">Tasks</Text>
                    <TouchableOpacity
                        className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center shadow-md shadow-blue-200"
                        onPress={() => Alert.alert("New Task", "Feature coming soon.")}
                    >
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 mb-4 border border-gray-200">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        className="flex-1 ml-3 text-base text-gray-900 h-6 p-0"
                        placeholder="Search tasks..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filter Tabs */}
                <View className="flex-row">
                    {['all', 'pending', 'completed'].map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setFilter(f as any)}
                            className={`mr-2 px-4 py-2 rounded-full border ${filter === f ? styles[f] : 'bg-transparent border-transparent'}`}
                        >
                            <Text className={`capitalize font-semibold ${filter === f ? 'text-white' : 'text-gray-500'}`}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Task List */}
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {filteredTasks.length === 0 ? (
                    <View className="items-center justify-center py-20 opacity-50">
                        <CheckCircle size={48} color="#D1D5DB" />
                        <Text className="text-lg font-bold text-gray-400 mt-4">No tasks found</Text>
                    </View>
                ) : (
                    filteredTasks.map((task) => (
                        <TouchableOpacity
                            key={task.id}
                            onPress={() => openTaskModal(task)}
                            className="bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center flex-1 pr-4">
                                    <TouchableOpacity
                                        onPress={() => toggleStatus(task.id)}
                                        className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 ${task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                                    >
                                        {task.status === 'completed' && <CheckCircle size={14} color="white" />}
                                    </TouchableOpacity>

                                    <View>
                                        <Text className={`text-base font-semibold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                            {task.title}
                                        </Text>
                                        <View className="flex-row items-center mt-1">
                                            {task.status === 'overdue' ?
                                                <Text className="text-red-500 text-xs font-medium">Overdue</Text> :
                                                <Text className="text-gray-500 text-xs mt-0.5">{task.time}</Text>
                                            }
                                            {task.proof && <Text className="text-blue-500 text-xs ml-2 font-medium">• Has Proof</Text>}
                                            {task.comment && <Text className="text-gray-500 text-xs ml-2">• 1 Comment</Text>}
                                        </View>
                                    </View>
                                </View>
                                <ChevronRight size={20} color="#D1D5DB" />
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* Task Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeTaskModal}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 justify-end bg-black/50"
                >
                    <View className="bg-white rounded-t-[32px] h-[85%] p-6 shadow-2xl">
                        {/* Modal Header */}
                        <View className="flex-row justify-between items-start mb-6">
                            <View className="flex-1 pr-4">
                                <Text className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Task Details</Text>
                                <Text className="text-2xl font-bold text-gray-900">{selectedTask?.title}</Text>
                            </View>
                            <TouchableOpacity onPress={closeTaskModal} className="bg-gray-100 p-2 rounded-full">
                                <X size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                            {/* Status Section */}
                            <View className="flex-row items-center space-x-4 mb-8">
                                <View className={`px-4 py-2 rounded-full flex-row items-center ${selectedTask?.status === 'completed' ? 'bg-green-100' : 'bg-orange-100'
                                    }`}>
                                    {selectedTask?.status === 'completed' ?
                                        <CheckCircle size={16} color="#15803d" className="mr-2" /> :
                                        <Clock size={16} color="#c2410c" className="mr-2" />
                                    }
                                    <Text className={`font-bold capitalize ${selectedTask?.status === 'completed' ? 'text-green-700' : 'text-orange-700'
                                        }`}>{selectedTask?.status}</Text>
                                </View>
                                <Text className="text-gray-500 font-medium">{selectedTask?.time}</Text>
                            </View>

                            {/* Proof Section */}
                            <View className="mb-8">
                                <Text className="text-lg font-bold text-gray-900 mb-3">Proof of Work</Text>
                                {selectedTask?.proof ? (
                                    <View className="relative">
                                        <Image
                                            source={{ uri: selectedTask.proof }}
                                            className="w-full h-48 rounded-2xl bg-gray-100"
                                            resizeMode="cover"
                                        />
                                        <TouchableOpacity
                                            onPress={handleCamera}
                                            className="absolute bottom-4 right-4 bg-black/70 p-2 rounded-full flex-row items-center px-4"
                                        >
                                            <Camera size={16} color="white" />
                                            <Text className="text-white text-xs font-bold ml-2">Retake</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={handleCamera}
                                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl items-center justify-center bg-gray-50 active:bg-gray-100"
                                    >
                                        <Camera size={32} color="#9CA3AF" />
                                        <Text className="text-gray-500 font-medium mt-2">Tap to take photo proof</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Comments Section */}
                            <View className="mb-8">
                                <Text className="text-lg font-bold text-gray-900 mb-3">Comments</Text>
                                <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100 min-h-[120px]">
                                    <TextInput
                                        className="text-base text-gray-800"
                                        multiline
                                        placeholder="Add notes about this task..."
                                        placeholderTextColor="#9CA3AF"
                                        value={commentText}
                                        onChangeText={setCommentText}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>
                        </ScrollView>

                        {/* Action Buttons */}
                        <View className="flex-row gap-4 pt-4 border-t border-gray-100">
                            <TouchableOpacity
                                onPress={() => deleteTask(selectedTask?.id)}
                                className="flex-1 bg-red-50 p-4 rounded-xl items-center justify-center"
                            >
                                <Text className="text-red-600 font-bold">Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    toggleStatus(selectedTask?.id);
                                    saveTaskDetails();
                                }}
                                className={`flex-[2] p-4 rounded-xl items-center justify-center shadow-lg ${selectedTask?.status === 'completed' ? 'bg-gray-900' : 'bg-blue-600'
                                    }`}
                            >
                                <Text className="text-white font-bold text-lg">
                                    {selectedTask?.status === 'completed' ? 'Mark Incomplete' : 'Complete Task'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={saveTaskDetails} className="mt-4 self-center">
                            <Text className="text-gray-500 font-medium">Save & Close</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}
