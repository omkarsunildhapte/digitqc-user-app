import { DrawerActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from "expo-location";
import {
    AlertCircle,
    Bell,
    Briefcase,
    CheckCircle,
    Clock,
    LayoutDashboard,
    MapPin,
    Menu,
    PauseCircle,
    PlayCircle
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, AppState, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CircularProgress } from "../components/common/CircularProgress";
import { MOCK_INSPECTIONS, PROJECT_ICONS, PROJECTS, TODO_LIST } from "../constants/data";
import { registerForPushNotificationsAsync } from "../services/NotificationService";

export default function DashboardScreen() {
    const navigation = useNavigation();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkLocationPermission();
        registerForPushNotificationsAsync();

        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active") {
                checkLocationPermission();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const checkLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                setIsLoading(false);
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            setErrorMsg(null);
        } catch (error) {
            setErrorMsg("Error fetching location");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGrantPermission = async () => {
        Linking.openSettings();
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (errorMsg) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
                <View className="bg-red-50 p-6 rounded-full mb-6">
                    <MapPin size={48} color="#EF4444" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 text-center mb-2">Location Required</Text>
                <Text className="text-gray-500 text-center mb-8">
                    We need your location to show relevant projects.
                </Text>
                <TouchableOpacity onPress={handleGrantPermission} className="bg-blue-600 px-8 py-4 rounded-xl w-full">
                    <Text className="text-white text-center font-bold text-lg">Enable Location</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
    const OVERVIEW_ITEMS = [
        {
            id: 'total',
            label: 'Total',
            count: MOCK_INSPECTIONS.length,
            icon: LayoutDashboard,
            color: '#8B5CF6',
            bg: 'bg-purple-100',
            text: 'text-purple-600',
            action: () => { }
        },
        {
            id: 'active',
            label: 'Active',
            count: MOCK_INSPECTIONS.filter(i => i.status === 'active').length,
            icon: PlayCircle,
            color: '#3B82F6',
            bg: 'bg-blue-100',
            text: 'text-blue-600',
            action: () => (navigation as any).navigate('Inspection', { screen: 'Main', params: { activeTab: 'active' } })
        },
        {
            id: 'pending',
            label: 'Pending',
            count: MOCK_INSPECTIONS.filter(i => i.status === 'pending').length,
            icon: Clock,
            color: '#F97316',
            bg: 'bg-orange-100',
            text: 'text-orange-600',
            action: () => (navigation as any).navigate('Inspection', { screen: 'Main', params: { activeTab: 'pending' } })
        },
        {
            id: 'done',
            label: 'Done',
            count: MOCK_INSPECTIONS.filter(i => i.status === 'done').length,
            icon: CheckCircle,
            color: '#10B981',
            bg: 'bg-green-100',
            text: 'text-green-600',
            action: () => (navigation as any).navigate('Inspection', { screen: 'Main', params: { activeTab: 'done' } })
        },
        {
            id: 'paused',
            label: 'Paused',
            count: MOCK_INSPECTIONS.filter(i => i.status === 'paused').length,
            icon: PauseCircle,
            color: '#6B7280',
            bg: 'bg-gray-100',
            text: 'text-gray-600',
            action: () => (navigation as any).navigate('Inspection', { screen: 'Main', params: { activeTab: 'paused' } })
        },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            {/* Gradient Header */}
            <LinearGradient
                colors={['#2563EB', '#1E40AF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="pt-12 pb-6 px-6 rounded-b-[32px] shadow-lg absolute w-full top-0 z-10"
            >
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        className="bg-white/20 p-2 rounded-full"
                    >
                        <Menu size={24} color="white" />
                    </TouchableOpacity>

                    <View className="flex-row items-center space-x-4">
                        <TouchableOpacity onPress={() => navigation.navigate("Notification" as never)} className="bg-white/20 p-2 rounded-full mr-3">
                            <Bell size={24} color="white" />
                            <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-blue-600" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} >
                            <View className="w-10 h-10 bg-white rounded-full items-center justify-center border-2 border-white/30">
                                <Text className="text-blue-700 font-bold">JD</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ paddingTop: 130, paddingBottom: 40 }} className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Overview Grid */}
                <View className="px-6 mb-3">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Inspection Overview</Text>
                    <View className="flex-row flex-wrap gap-3">
                        {OVERVIEW_ITEMS.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={item.action}
                                className={`w-[31%] p-3 rounded-2xl mb-3 shadow-sm bg-white border border-gray-100 items-center justify-center`}
                                style={{ elevation: 2 }}
                            >
                                <View className={`w-10 h-10 ${item.bg} rounded-full items-center justify-center mb-2`}>
                                    <item.icon size={20} color={item.color} />
                                </View>
                                <Text className={`text-2xl font-bold ${item.text}`}>{item.count}</Text>
                                <Text className="text-gray-500 text-xs font-medium">{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="px-6 mb-8">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Your Performance</Text>
                    <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-row justify-between">
                        <CircularProgress
                            percentage={85}
                            size={90}
                            color="#3B82F6"
                            label="Task Completion"
                            subLabel="Last 30 days"
                        />
                        <CircularProgress
                            percentage={92}
                            size={90}
                            color="#10B981"
                            label="On-Time Rate"
                            subLabel="Avg. Delay: 2h"
                        />
                        <CircularProgress
                            percentage={78}
                            size={90}
                            color="#F59E0B"
                            label="Quality Score"
                            subLabel="Based on reviews"
                        />
                    </View>
                </View>
                <View className="px-6 mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-gray-800">Your Projects</Text>
                    </View>

                    {PROJECTS.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => (navigation as any).navigate("Inspection", { projectId: item.id })}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4 flex-row items-center"
                        >
                            <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mr-4">
                                {(() => {
                                    const IconComponent = PROJECT_ICONS[item.icon] || Briefcase;
                                    return <IconComponent size={24} color="#2563EB" />;
                                })()}
                            </View>

                            <View className="flex-1">
                                <View className="flex-row justify-between items-center mb-1">
                                    <Text className="text-base font-bold text-gray-900">{item.name}</Text>
                                    <Text className="text-blue-600 font-bold text-xs">{item.completed}%</Text>
                                </View>
                                <Text className="text-gray-500 text-xs mb-2">{item.location}</Text>

                                <View className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <View
                                        className="bg-blue-600 h-full rounded-full"
                                        style={{ width: `${item.completed}%` }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Tasks */}
                <View className="px-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-gray-800">Recent Tasks</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Todo" as never)}>
                            <Text className="text-blue-600 font-medium">View All</Text>
                        </TouchableOpacity>
                    </View>

                    {TODO_LIST.slice(0, 3).map((item) => (
                        <View key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 mb-3">
                            <TouchableOpacity onPress={() => navigation.navigate("Todo" as never)} className="flex-row items-center">
                                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${item.status === 'completed' ? 'bg-green-100' :
                                    item.status === 'overdue' ? 'bg-red-100' : 'bg-orange-100'
                                    }`} >
                                    {item.icon === "check" && <CheckCircle size={20} color={item.color} />}
                                    {item.icon === "clock" && <Clock size={20} color={item.color} />}
                                    {item.icon === "alert" && <AlertCircle size={20} color={item.color} />}
                                </View>
                                <View className="flex-1">
                                    <Text className={`font-semibold text-gray-900 ${item.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                                        {item.title}
                                    </Text>
                                    <Text className="text-gray-500 text-xs mt-0.5">{item.time}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
}
