import React, { useState, useRef } from 'react';
import { View, Modal, Image, TouchableOpacity, Text, PanResponder, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import { X, Check, Trash2, Undo2 } from 'lucide-react-native';

interface ImageAnnotationModalProps {
    visible: boolean;
    imageUri: string | null;
    onClose: () => void;
    onSave: (uri: string) => void;
}

export function ImageAnnotationModal({ visible, imageUri, onClose, onSave }: ImageAnnotationModalProps) {
    const [paths, setPaths] = useState<string[]>([]);
    const [currentPath, setCurrentPath] = useState<string>('');
    const [saving, setSaving] = useState(false);

    // ViewShot ref to capture the view
    const viewShotRef = useRef<ViewShot>(null);

    // Dimensions for the drawing area
    // We'll try to keep it responsive, but for now fixed aspect or sticking to container size is easier
    // Let's assume full screen overlay for simplicity or a large modal

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                setCurrentPath(`M${locationX},${locationY}`);
            },
            onPanResponderMove: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                setCurrentPath((prev) => `${prev} L${locationX},${locationY}`);
            },
            onPanResponderRelease: () => {
                setCurrentPath((prev) => {
                    if (prev) {
                        setPaths((old) => [...old, prev]);
                    }
                    return '';
                });
            },
        })
    ).current;

    const handleClear = () => {
        setPaths([]);
        setCurrentPath('');
    };

    const handleUndo = () => {
        setPaths((prev) => prev.slice(0, -1));
    };

    const handleSave = async () => {
        if (viewShotRef.current && viewShotRef.current.capture) {
            setSaving(true);
            try {
                const uri = await viewShotRef.current.capture();
                onSave(uri);
            } catch (error) {
                console.error("Failed to save annotation", error);
            } finally {
                setSaving(false);
            }
        }
    };

    if (!imageUri) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 bg-black">
                {/* Header */}
                <View className="flex-row justify-between items-center p-4 bg-black z-10">
                    <TouchableOpacity onPress={onClose} className="p-2">
                        <X size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-lg">Annotate Image</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={saving}
                        className="p-2 bg-blue-600 rounded-lg flex-row items-center"
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <Check size={20} color="white" />
                                <Text className="text-white font-bold ml-1">Save</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Canvas Container */}
                <View className="flex-1 justify-center items-center bg-black relative">
                    <ViewShot
                        // @ts-ignore
                        ref={viewShotRef}
                        options={{ format: "jpg", quality: 0.8 }}
                        className="flex-1 w-full h-full relative"
                        collapsable={false}
                    >
                        {/* Background Image - ensure it's visible */}
                        <Image
                            source={{ uri: imageUri }}
                            style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}
                            resizeMode="contain"
                        />

                        {/* Drawing Layer */}
                        <View
                            style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10, backgroundColor: 'rgba(0,0,0,0.01)' }}
                            {...panResponder.panHandlers}
                        >
                            <Svg height="100%" width="100%">
                                {paths.map((d, index) => (
                                    <Path
                                        key={index}
                                        d={d}
                                        stroke="red"
                                        strokeWidth={3}
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                ))}
                                <Path
                                    d={currentPath}
                                    stroke="red"
                                    strokeWidth={3}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </Svg>
                        </View>
                    </ViewShot>
                </View>

                {/* Toolbar */}
                <View className="flex-row justify-around items-center p-6 bg-black pb-8">
                    <TouchableOpacity onPress={handleUndo} className="p-3 items-center">
                        <Undo2 size={24} color="white" />
                        <Text className="text-white text-xs mt-1">Undo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleClear} className="p-3 items-center">
                        <Trash2 size={24} color="#EF4444" />
                        <Text className="text-red-500 text-xs mt-1">Clear All</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );
}
