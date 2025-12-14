import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ChevronDown, Filter, Plus, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../types/navigation";
import { INSPECTION_TABS, MOCK_INSPECTIONS, PROJECTS } from "../constants/data";
import { TextInput } from "react-native-gesture-handler";

type InspectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export default function InspectionScreen() {
    const navigation = useNavigation<InspectionScreenNavigationProp>();
    const route = useRoute<any>();
    const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);


    useEffect(() => {
        if (route.params?.projectId) {
            const project = PROJECTS.find(p => p.id === route.params.projectId);
            if (project) {
                setSelectedProject(project);
            }
        }
        if (route.params?.activeTab) {
            setActiveTab(route.params.activeTab);
        }
    }, [route.params?.projectId, route.params?.activeTab]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(INSPECTION_TABS[0].id);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const selectProject = (project: typeof PROJECTS[0]) => {
        setSelectedProject(project);
        setIsDropdownOpen(false);
    };

    const handleInspectionPress = (id: number, status: string) => {
        if (status === 'done') return; // Do not open popup for done items
        navigation.navigate("InspectionForm", {
            inspectionId: id.toString(),
            initialStatus: status
        });
    };

    const handleNewInspection = () => {
        navigation.navigate("InspectionForm");
    };

    const inspections = MOCK_INSPECTIONS.filter(i => i.status === activeTab);

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "left", "right"]}>
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-gray-200 z-10">
                {/* Project Dropdown */}
                <View className="flex-1 mr-4">
                    <Text className="text-xs text-gray-500 mb-0.5">Project</Text>
                    <TouchableOpacity
                        className="flex-row items-center"
                        onPress={toggleDropdown}
                        activeOpacity={0.7}
                    >
                        <Text className="text-lg font-bold text-gray-900 mr-2" numberOfLines={1}>
                            {selectedProject.name}
                        </Text>
                        <ChevronDown size={20} color="#1F2937" />
                    </TouchableOpacity>

                    {/* Dropdown Modal/Overlay */}
                    {isDropdownOpen && (
                        <View className="absolute top-12 left-0 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            {PROJECTS.map((project) => (
                                <TouchableOpacity
                                    key={project.id}
                                    className={`px-4 py-3 ${selectedProject.id === project.id ? "bg-blue-50" : ""}`}
                                    onPress={() => selectProject(project)}
                                >
                                    <Text className={`text-base ${selectedProject.id === project.id ? "text-blue-600 font-semibold" : "text-gray-700"}`}>
                                        {project.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Add Button */}
                <TouchableOpacity
                    className="bg-blue-600 p-2 rounded-lg shadow-sm active:bg-blue-700"
                    onPress={handleNewInspection}
                >
                    <Plus size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
            <View className="px-4 pt-3">
                <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row space-x-2 gap-2">
                        {/* full input */}
                        <TouchableOpacity className="p-2 bg-white rounded-lg border border-gray-200 w-[88%]">
                            <Search size={20} color="#6B7280" className="mr-2 h-5 w-5" />
                            <TextInput
                                placeholder="Search"
                                className="flex-1 px-4 py-2 border-0 outline-none focus:outline-none"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2 bg-white rounded-lg border border-gray-200">
                            <Filter size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {/* Tabs */}
            <View className="flex-row bg-white border-b border-gray-200 px-2 justify-around">
                {INSPECTION_TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => setActiveTab(tab.id)}
                        className={`py-3 px-2 border-b-2 items-center flex-1 ${activeTab === tab.id ? "border-blue-600" : "border-transparent"}`}
                    >
                        <Text className={`font-medium text-sm ${activeTab === tab.id ? "text-blue-600" : "text-gray-500"}`}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content List */}
            <ScrollView contentContainerStyle={{ padding: 16 }}>


                {/* List */}
                {inspections.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => handleInspectionPress(item.id, activeTab)}
                        className="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-100"
                    >
                        <View className="flex-row justify-between items-start">
                            <View>
                                <Text className="text-gray-900 font-bold text-base">{item.title}</Text>
                                <Text className="text-gray-500 text-sm mt-1">{item.subtitle} - {selectedProject.name}</Text>
                            </View>
                            <View className={`px-2 py-1 rounded text-xs ${activeTab === 'done' ? 'bg-green-100' :
                                activeTab === 'paused' ? 'bg-gray-100' :
                                    activeTab === 'pending' ? 'bg-orange-100' : 'bg-blue-100'
                                }`}>
                                <Text className={`text-xs font-semibold ${activeTab === 'done' ? 'text-green-700' :
                                    activeTab === 'paused' ? 'text-gray-700' :
                                        activeTab === 'pending' ? 'text-orange-700' : 'text-blue-700'
                                    }`}>
                                    {activeTab.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                        <View className="mt-3 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <Text className="text-gray-400 text-xs mr-2">{item.date}</Text>
                                {activeTab !== 'done' && item.deadline && (
                                    <Text className="text-red-500 text-xs font-semibold">Due: {item.deadline}</Text>
                                )}
                            </View>
                            {activeTab !== 'done' && (
                                <Text className="text-blue-600 text-xs font-medium">
                                    {activeTab === 'paused' ? 'Resume' : 'View Details'}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}



                {inspections.length === 0 && (
                    <View className="items-center justify-center py-20">
                        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                            <Text className="text-4xl">📋</Text>
                        </View>
                        <Text className="text-gray-500 text-center">No {activeTab} inspections found.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
