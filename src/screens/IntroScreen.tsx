import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../types/navigation";

type Props = StackScreenProps<RootStackParamList, "Intro">;

import { INTRO_SLIDES } from "../constants/data";

const { width } = Dimensions.get("window");

export default function IntroScreen({ navigation }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    // Auto‑advance slider every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % INTRO_SLIDES.length;
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
        }, 3000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center">
                <View className="h-[60%]">
                    <FlatList
                        ref={flatListRef}
                        data={INTRO_SLIDES}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={{ width }} className="items-center justify-center px-8">
                                <View className="items-center justify-center w-64 h-64 mb-10">
                                    <Image source={item.image} className="w-full h-full" resizeMode="contain" />
                                </View>
                                <Text className="text-3xl font-extrabold text-gray-900 mb-3 text-center">{item.title}</Text>
                                <Text className="text-base text-gray-500 text-center leading-6 px-4">{item.description}</Text>
                            </View>
                        )}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewConfigRef}
                    />
                </View>
                {/* Pagination Dots */}
                <View className="flex-row space-x-2 mb-12">
                    {INTRO_SLIDES.map((_, index) => (
                        <View
                            key={index}
                            className={`mx-1 h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-[#1268F8]" : "bg-gray-300"}`}
                        />
                    ))}
                </View>
                <View className="px-8 w-full">
                    <TouchableOpacity
                        className="w-full bg-[#1268F8] py-4 rounded-xl items-center shadow-lg shadow-blue-200"
                        onPress={() => navigation.replace("Login")}
                        activeOpacity={0.85}
                    >
                        <Text className="text-white font-bold text-lg">Get Started</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}