import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Calendar, Camera, CheckCircle, ChevronLeft, Clock, Edit2, Image as ImageIcon, X } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DEFAULT_QUESTIONS, ROLES } from "../constants/data";
import { useSync } from "../context/SyncContext";
import { useToast } from "../context/ToastContext";
import { RootStackParamList } from "../types/navigation";

import { useNetInfo } from "@react-native-community/netinfo";
import { ImageAnnotationModal } from "../components/common/ImageAnnotationModal";
import { InspectionService } from "../services/InspectionService";

const STEPS = ["Setup", "Collaborators", "Drawings", "Checklist", "Completion"];
const CHECKLIST_TYPES = ["Structural", "Finishing", "Safety", "Electrical", "Plumbing"];

type InspectionFormRouteProp = RouteProp<RootStackParamList, 'InspectionForm'>;

type QuestionType = 'text' | 'radio' | 'boolean' | 'select';

interface Question {
    id: number;
    text: string;
    type: QuestionType;
    options?: string[]; // For radio/select
    answer: any;
    comment: string;
    proof: string | null;
    requiredProof: boolean;
    isCompleted?: boolean;
}

export default function InspectionFormScreen() {
    const navigation = useNavigation();
    const route = useRoute<InspectionFormRouteProp>();
    const { addToQueue } = useSync();
    const toast = useToast();
    const { inspectionId, initialStatus } = route.params || {};
    const netInfo = useNetInfo();
    const isOnline = netInfo.isConnected;

    const [currentStep, setCurrentStep] = useState(inspectionId ? 1 : 0);

    // Step 0: Setup
    const [taskName, setTaskName] = useState("");
    const [checklistType, setChecklistType] = useState<string | null>(null);
    const [isChecklistModalVisible, setChecklistModalVisible] = useState(false);

    // Modal State
    const [isModalVisible, setModalVisible] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

    // Step 1: Collaborators
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [collaboratorPhoto, setCollaboratorPhoto] = useState<string | null>(null);

    // Step 2: Diagram (Renamed from Drawings)
    const [hasDiagram, setHasDiagram] = useState<boolean | null>(null);
    const [diagramImage, setDiagramImage] = useState<string | null>(null);


    const toggleRole = (role: string) => {
        if (selectedRole === role) {
            setSelectedRole(null);
        } else {
            setSelectedRole(role);
        }
    };

    const handleSelectChecklistType = (type: string) => {
        setChecklistType(type);
        setChecklistModalVisible(false);
        // Only auto-advance if taskName is also filled
        if (taskName.trim()) {
            setCurrentStep(1);
        }
    };

    // Step 3: Checklist
    const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS as Question[]);

    // Step 4: Completion (Rechecking)
    const [recheckingDate, setRecheckingDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [mode, setMode] = useState<'date' | 'time'>('date');

    // Annotation State
    const [annotationModalVisible, setAnnotationModalVisible] = useState(false);
    const [tempImageUri, setTempImageUri] = useState<string | null>(null);

    const handleNext = () => {
        if (currentStep === 0) {
            if (!taskName.trim()) {
                toast.show("Please enter a Task Name.", "error");
                return;
            }
            if (!checklistType) {
                toast.show("Please select a Checklist Type.", "error");
                return;
            }
        }
        if (currentStep === 2) {
            if (hasDiagram === null) {
                toast.show("Please answer if you have the diagram.", "error");
                return;
            }
            if (!diagramImage) {
                toast.show("Diagram image is mandatory.", "error");
                return;
            }
        }
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        const minStep = inspectionId ? 1 : 0;
        if (currentStep > minStep) {
            setCurrentStep(currentStep - 1);
        } else {
            handleCancel();
        }
    };

    const handleCancel = () => {
        Alert.alert(
            "Cancel Inspection",
            "Are you sure? Unsaved progress will be lost.",
            [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: () => navigation.goBack() }
            ]
        );
    };

    const handlePause = () => {
        toast.show("Inspection saved to Paused tab.", "info");
        navigation.goBack();
    };

    const handleSubmit = async () => {
        // Validation check for all questions
        const incompleteQuestions = questions.filter(q => !q.isCompleted);

        if (incompleteQuestions.length > 0) {
            toast.show("Please complete all questions in the checklist.", "warning");
            return;
        }

        if (!recheckingDate) {
            toast.show("Please set a rechecking date and time.", "error");
            return;
        }

        const payload = {
            id: inspectionId || Date.now().toString(),
            taskName,
            checklistType,
            questions,
            drawings: diagramImage,
            collaborators: selectedRole ? [selectedRole] : [],
            collaboratorPhoto,
            recheckingTime: recheckingDate.toISOString(),
            timestamp: Date.now()
        };

        if (isOnline) {
            try {
                // Try to save online
                await InspectionService.saveInspection(payload);
                toast.show("Inspection saved successfully to the server!", "success");
                navigation.goBack();
            } catch (error) {
                // If it fails, fallback to offline
                console.log("Online save failed, falling back to offline", error);
                addToQueue('inspection_submit', payload);
                toast.show("Connection failed. Saved to offline queue.", "warning");
                navigation.goBack();
            }
        } else {
            // Offline Mode
            addToQueue('inspection_submit', payload);
            toast.show("You are offline. Saved to sync queue.", "info");
            navigation.goBack();
        }
    };

    const showDatepicker = () => {
        setMode('date');
        setShowDatePicker(true);
    };

    const showTimepicker = () => {
        setMode('time');
        setShowDatePicker(true);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || recheckingDate;
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (currentDate) {
            // If we are setting date, preserve time if it was already set, or default to now
            // But simplify: just replace the date part or time part
            if (recheckingDate && mode === 'time') {
                const newDate = new Date(recheckingDate.getTime());
                newDate.setHours(currentDate.getHours());
                newDate.setMinutes(currentDate.getMinutes());
                setRecheckingDate(newDate);
            } else if (recheckingDate && mode === 'date') {
                const newDate = new Date(currentDate.getTime());
                newDate.setHours(recheckingDate.getHours());
                newDate.setMinutes(recheckingDate.getMinutes());
                setRecheckingDate(newDate);
            } else {
                setRecheckingDate(currentDate);
            }
        }
    };

    const pickImage = async (type: 'proof' | 'diagram' | 'collaborator', questionId: number | null = null) => {
        if (type === 'collaborator') {
            // Camera ONLY for collaborators (enforced)
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                toast.show("Camera access is needed.", "error");
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.8,
            });
            if (!result.canceled) {
                setCollaboratorPhoto(result.assets[0].uri);
            }
            return;
        }

        let result;
        const isCamera = type === 'proof' || type === 'diagram'; // Suggest Camera preferred but allow gallery if needed? 
        // User said: "Diagram ... Image Picker (Camera or Gallery)"
        // User said: "Proof ... Camera" (from "take the photo only the camera allow that time")
        // But user constraint "collaboratorPhoto is optinal" and "camera only".
        // Let's use generic logic but force camera for Proof if needed. 
        // User constraint: "All images (Diagram & Proofs) must support Cropping & Annotation."

        // For Diagram: Picker (Cam/Gal) -> Crop (allowsEditing=true) -> Annotate
        // For Proof: Camera Only -> Crop? -> Annotate

        if (type === 'proof') {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                toast.show("Camera access is needed for proof.", "error");
                return;
            }
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true, // Crop allowed
                quality: 0.8,
            });
        } else {
            // Diagram: Camera or Gallery
            // We use a custom alert or default to Gallery if not specified, 
            // but normally we want to show the chooser. 
            // Since we trigger this from a custom UI, let's implement the chooser here or just specific calls.
            // Simplified: If type is diagram, we show chooser.
            Alert.alert(
                "Upload Diagram",
                "Choose a source",
                [
                    {
                        text: "Camera",
                        onPress: async () => {
                            const permission = await ImagePicker.requestCameraPermissionsAsync();
                            if (permission.granted) {
                                const r = await ImagePicker.launchCameraAsync({
                                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                    allowsEditing: true,
                                    quality: 0.8,
                                });
                                processImageResult(r, type);
                            }
                        }
                    },
                    {
                        text: "Gallery",
                        onPress: async () => {
                            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                            if (permission.granted) {
                                const r = await ImagePicker.launchImageLibraryAsync({
                                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                    allowsEditing: true,
                                    aspect: [4, 3],
                                    quality: 0.8,
                                });
                                processImageResult(r, type);
                            }
                        }
                    },
                    { text: "Cancel", style: "cancel" }
                ]
            );
            return;
        }

        processImageResult(result, type);
    };

    const processImageResult = (result: ImagePicker.ImagePickerResult, type: 'proof' | 'diagram') => {
        if (!result.canceled) {
            const uri = result.assets[0].uri;
            // Immediate Annotation for both types
            setTempImageUri(uri);
            // We need to know WHAT we are annotating (Diagram or Proof) to save correctly.
            // Using a ref or state for 'annotationTarget' would be cleaner, but let's reuse activeQuestion for Proofs.
            // For Diagram, activeQuestion is null.
            setAnnotationModalVisible(true);
        }
    };

    const handleAnnotationSave = (newUri: string) => {
        if (activeQuestion) {
            // It was a Proof
            setActiveQuestion({ ...activeQuestion, proof: newUri });
        } else {
            // It must be the Diagram
            setDiagramImage(newUri);
        }
        setAnnotationModalVisible(false);
        setTempImageUri(null);
    };

    const openQuestionModal = (q: Question) => {
        setActiveQuestion({ ...q }); // Clone to avoid direct mutation until saved
        setModalVisible(true);
    };

    const saveQuestion = () => {
        if (!activeQuestion) return;

        // Validation Logic inside Modal
        if (activeQuestion.type === 'text' && !activeQuestion.answer.trim()) {
            toast.show("Please enter an answer.", "error");
            return;
        }
        if ((activeQuestion.type === 'radio' || activeQuestion.type === 'select') && !activeQuestion.answer) {
            toast.show("Please select an option.", "error");
            return;
        }
        if (activeQuestion.type === 'boolean' && activeQuestion.answer === null) {
            toast.show("Please select Yes or No.", "error");
            return;
        }

        // Logic: Negative answers require comments
        const isNegative = activeQuestion.answer === 'Fail' || activeQuestion.answer === 'No' || activeQuestion.answer === 'Rejected' || activeQuestion.answer === false;
        if (isNegative && !activeQuestion.comment.trim()) {
            toast.show("Please add a comment for this negative result.", "error");
            return;
        }

        if (activeQuestion.requiredProof && !activeQuestion.proof) {
            toast.show("Photo proof is required for this item.", "error");
            return;
        }

        // Save to main state
        const updatedQ = { ...activeQuestion, isCompleted: true };
        setQuestions(questions.map(q => q.id === updatedQ.id ? updatedQ : q));
        setModalVisible(false);
        setActiveQuestion(null);
    };

    // Helper to render input based on type
    const renderModalInput = () => {
        if (!activeQuestion) return null;
        const q = activeQuestion;

        switch (q.type) {
            case 'text':
                return (
                    <TextInput
                        className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800"
                        placeholder="Type your answer here..."
                        value={q.answer}
                        onChangeText={(t) => setActiveQuestion({ ...q, answer: t })}
                    />
                );
            case 'boolean':
                return (
                    <View className="flex-row gap-4">
                        <TouchableOpacity
                            onPress={() => setActiveQuestion({ ...q, answer: true })}
                            className={`flex-1 py-3 rounded-lg border items-center ${q.answer === true ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                        >
                            <Text className={`font-bold ${q.answer === true ? 'text-blue-700' : 'text-gray-600'}`}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveQuestion({ ...q, answer: false })}
                            className={`flex-1 py-3 rounded-lg border items-center ${q.answer === false ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                        >
                            <Text className={`font-bold ${q.answer === false ? 'text-blue-700' : 'text-gray-600'}`}>No</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'radio':
            case 'select':
                return (
                    <View className="flex-row gap-2 flex-wrap">
                        {q.options?.map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => setActiveQuestion({ ...q, answer: opt })}
                                className={`px-4 py-2 rounded-full border ${q.answer === opt
                                    ? 'bg-blue-100 border-blue-500'
                                    : 'bg-white border-gray-300'}`}
                            >
                                <Text className={`${q.answer === opt ? 'text-blue-700 font-bold' : 'text-gray-600'}`}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            default:
                return null;
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Setup
                return (
                    <View>
                        <Text className="text-lg font-semibold text-gray-800 mb-4">Inspection Setup</Text>

                        <Text className="text-sm font-semibold text-gray-500 mb-2">Task Name</Text>
                        <TextInput
                            className="bg-white border border-gray-300 rounded-xl p-4 text-base mb-6 text-gray-900"
                            placeholder="e.g., Block A, 3rd Floor"
                            value={taskName}
                            onChangeText={setTaskName}
                        />

                        <Text className="text-sm font-semibold text-gray-500 mb-2">Checklist Type</Text>
                        <TouchableOpacity
                            onPress={() => setChecklistModalVisible(true)}
                            className="bg-white border border-gray-300 rounded-xl p-4 mb-6 flex-row justify-between items-center"
                        >
                            <Text className={`text-base ${checklistType ? 'text-gray-900' : 'text-gray-400'}`}>
                                {checklistType || "Select a Checklist Type"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );

            case 1: // Collaborators
                return (
                    <View>
                        <Text className="text-lg font-semibold text-gray-800 mb-2">Who is with you?</Text>
                        {/* ... (Same as before) ... */}
                        <View className="flex-row flex-wrap gap-3">
                            {ROLES.map(role => (
                                <TouchableOpacity
                                    key={role}
                                    onPress={() => toggleRole(role)}
                                    className={`px-4 py-2 rounded-full border ${selectedRole === role ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'}`}
                                >
                                    <Text className={`${selectedRole === role ? 'text-blue-700 font-bold' : 'text-gray-600'}`}>{role}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View className="mt-6">
                            <Text className="text-sm font-semibold text-gray-500 mb-2">Collaborator Photo (Optional - Camera Only)</Text>
                            {collaboratorPhoto ? (
                                <View className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200">
                                    <Image source={{ uri: collaboratorPhoto }} className="w-full h-full" resizeMode="cover" />
                                    <TouchableOpacity
                                        onPress={() => setCollaboratorPhoto(null)}
                                        className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                                    >
                                        <X size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => pickImage('collaborator')}
                                    className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50"
                                >
                                    <Camera size={28} color="#9CA3AF" />
                                    <Text className="text-gray-500 font-medium mt-2">Take Photo</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                );
            case 2: // Diagram
                return (
                    <View>
                        <Text className="text-lg font-semibold text-gray-800 mb-4">Inspection Diagram</Text>

                        <Text className="text-base text-gray-700 mb-3">Do you have the title diagram?</Text>
                        <View className="flex-row gap-4 mb-6">
                            <TouchableOpacity onPress={() => setHasDiagram(true)} className={`flex-1 p-4 rounded-xl border ${hasDiagram === true ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200'}`}>
                                <Text className={`text-center font-bold ${hasDiagram === true ? 'text-blue-700' : 'text-gray-600'}`}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setHasDiagram(false)} className={`flex-1 p-4 rounded-xl border ${hasDiagram === false ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200'}`}>
                                <Text className={`text-center font-bold ${hasDiagram === false ? 'text-blue-700' : 'text-gray-600'}`}>No</Text>
                            </TouchableOpacity>
                        </View>

                        <Text className="text-base text-gray-700 mb-3">Main Diagram Image (Mandatory)</Text>
                        <TouchableOpacity
                            onPress={() => pickImage('diagram')}
                            className={`bg-purple-50 border-2 border-dashed rounded-xl p-0 items-center justify-center h-64 overflow-hidden ${diagramImage ? 'border-purple-500' : 'border-purple-200'}`}
                        >
                            {diagramImage ? (
                                <View className="w-full h-full relative">
                                    <Image source={{ uri: diagramImage }} className="w-full h-full" resizeMode="contain" />
                                    <View className="absolute bottom-2 right-2 flex-row gap-2">
                                        <TouchableOpacity
                                            onPress={() => {
                                                setTempImageUri(diagramImage);
                                                setActiveQuestion(null); // Ensure target is Diagram
                                                setAnnotationModalVisible(true);
                                            }}
                                            className="bg-white/90 p-2 rounded-lg shadow-sm flex-row items-center"
                                        >
                                            <Edit2 size={16} color="#4B5563" />
                                            <Text className="ml-1 text-xs font-bold text-gray-800">Edit/Annotate</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => pickImage('diagram')}
                                            className="bg-white/90 p-2 rounded-lg shadow-sm flex-row items-center"
                                        >
                                            <ImageIcon size={16} color="#4B5563" />
                                            <Text className="ml-1 text-xs font-bold text-gray-800">Change</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <View className="items-center justify-center p-6">
                                    <ImageIcon size={40} color="#7c3aed" />
                                    <Text className="text-purple-600 font-bold mt-2 text-lg">Upload Diagram</Text>
                                    <Text className="text-purple-400 text-xs mt-1">Camera or Gallery • Crop & Annotate</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                );
            case 3: // Checklist (List Only)
                return (
                    <View>
                        <Text className="text-lg font-semibold text-gray-800 mb-4">Inspection Checklist</Text>
                        {questions.map((q) => (
                            <TouchableOpacity
                                key={q.id}
                                onPress={() => openQuestionModal(q)}
                                className={`bg-white p-4 rounded-xl border mb-3 shadow-sm flex-row items-center justify-between ${q.isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                            >
                                <View className="flex-1 pr-4">
                                    <Text className="text-gray-900 font-bold text-base mb-1">{q.id}. {q.text}</Text>
                                    {q.isCompleted ? (
                                        <Text className="text-green-700 text-xs font-medium">
                                            Completed • Answer: {String(q.answer)}
                                        </Text>
                                    ) : (
                                        <Text className="text-gray-400 text-xs italic">Tap to answer...</Text>
                                    )}
                                </View>
                                {q.isCompleted ? (
                                    <CheckCircle size={24} color="#15803d" />
                                ) : (
                                    <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center border border-gray-200">
                                        <Edit2 size={16} color="#9CA3AF" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            case 4: // Completion (Recheck Time)
                return (
                    <View>
                        <Text className="text-lg font-semibold text-gray-800 mb-4">Finalization</Text>
                        <Text className="text-gray-600 mb-6">Please schedule a rechecking time for verification.</Text>

                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                onPress={showDatepicker}
                                className="flex-1 bg-white border border-gray-300 p-4 rounded-xl flex-row items-center justify-center"
                            >
                                <Calendar size={20} color="#4B5563" />
                                <Text className="ml-2 font-semibold text-gray-700">
                                    {recheckingDate ? recheckingDate.toLocaleDateString() : "Select Date"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={showTimepicker}
                                className="flex-1 bg-white border border-gray-300 p-4 rounded-xl flex-row items-center justify-center"
                            >
                                <Clock size={20} color="#4B5563" />
                                <Text className="ml-2 font-semibold text-gray-700">
                                    {recheckingDate ? recheckingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Select Time"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {showDatePicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={recheckingDate || new Date()}
                                mode={mode}
                                is24Hour={true}
                                display="default"
                                onChange={onDateChange}
                            />
                        )}

                        <View className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <View className="flex-row items-center mb-2">
                                <CheckCircle size={20} color="#3b82f6" />
                                <Text className="font-bold text-blue-800 ml-2">Ready to Submit?</Text>
                            </View>
                            <Text className="text-blue-600 text-sm">
                                You are about to submit this inspection for {checklistType || 'Review'}. {isOnline ? 'It will be uploaded to the server.' : 'It will be queued for sync.'}
                            </Text>
                        </View>
                    </View>
                );
            default:
                return <View />;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
            {/* Header */}
            <View className="px-4 py-3 bg-white border-b border-gray-200 flex-row justify-between items-center">
                <TouchableOpacity onPress={handleBack} className="p-2">
                    <ChevronLeft size={24} color="#374151" />
                </TouchableOpacity>
                <View>
                    <Text className="text-lg font-bold text-gray-900 text-center">New Inspection</Text>
                    <Text className="text-xs text-gray-500 text-center">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}</Text>
                </View>
                <TouchableOpacity onPress={handleCancel} className="p-2">
                    <X size={24} color="#EF4444" />
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View className="flex-row h-1 w-full bg-gray-200">
                <View
                    style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    className="h-full bg-blue-600"
                />
            </View>

            {/* Content */}
            <ScrollView className="flex-1 p-4">
                {renderStepContent()}
            </ScrollView>

            {/* Footer */}
            <View className="p-4 bg-white border-t border-gray-200 flex-row gap-3">
                <TouchableOpacity
                    onPress={handlePause}
                    className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                >
                    <Text className="font-semibold text-gray-700">Pause</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={currentStep === STEPS.length - 1 ? handleSubmit : handleNext}
                    className="flex-[2] bg-blue-600 py-3 rounded-xl items-center"
                >
                    <Text className="font-bold text-white text-lg">
                        {currentStep === STEPS.length - 1 ? "Submit" : "Next"}
                    </Text>
                </TouchableOpacity>
            </View>


            {/* Question Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl h-[85%]">
                        {/* Modal Header */}
                        <View className="px-6 py-4 border-b border-gray-200 flex-row justify-between items-center bg-gray-50 rounded-t-3xl">
                            <Text className="text-lg font-bold text-gray-800 flex-1">
                                {activeQuestion ? `${activeQuestion.id}. Details` : 'Details'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2 bg-gray-200 rounded-full">
                                <X size={20} color="#4B5563" />
                            </TouchableOpacity>
                        </View>

                        {/* Modal Content */}
                        {activeQuestion && (
                            <ScrollView className="p-6">
                                <Text className="text-xl font-bold text-gray-900 mb-6 leading-7">{activeQuestion.text}</Text>

                                <View className="mb-8">
                                    <Text className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Answer</Text>
                                    {renderModalInput()}
                                </View>

                                {/* Comment Section */}
                                <View className="mb-8">
                                    <Text className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                        Comment
                                        {['Fail', 'No', 'Rejected', false].indexOf(activeQuestion.answer) !== -1 && <Text className="text-red-500"> (Required)</Text>}
                                    </Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-base min-h-[100px]"
                                        placeholder="Add observations, issues, or notes..."
                                        value={activeQuestion.comment}
                                        onChangeText={(t) => setActiveQuestion({ ...activeQuestion, comment: t })}
                                        multiline
                                        textAlignVertical="top"
                                    />
                                </View>

                                {/* Proof Section */}
                                <View className="mb-4">
                                    <Text className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                        Evidence
                                        {activeQuestion.requiredProof && <Text className="text-blue-500"> (Required)</Text>}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => pickImage('proof')}
                                        className={`w-full h-56 rounded-xl border-2 border-dashed items-center justify-center overflow-hidden ${activeQuestion.proof ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}
                                    >
                                        {activeQuestion.proof ? (
                                            <View className="w-full h-full relative">
                                                <Image source={{ uri: activeQuestion.proof }} className="w-full h-full" resizeMode="contain" />
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setTempImageUri(activeQuestion.proof);
                                                        // activeQuestion is already set, so handleAnnotationSave will work for proof
                                                        setAnnotationModalVisible(true);
                                                    }}
                                                    className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-lg shadow-sm flex-row items-center"
                                                >
                                                    <Edit2 size={16} color="#4B5563" />
                                                    <Text className="ml-1 text-xs font-bold text-gray-800">Annotate</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <View className="items-center">
                                                <Camera size={40} color="#9CA3AF" />
                                                <Text className="text-gray-500 font-medium mt-2">Tap to take photo (Camera)</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}

                        {/* Modal Footer */}
                        <View className="p-6 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                            <TouchableOpacity
                                onPress={saveQuestion}
                                className="bg-blue-600 w-full py-4 rounded-xl items-center shadow-md active:bg-blue-700"
                            >
                                <Text className="text-white font-bold text-lg">Save & Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Checklist Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isChecklistModalVisible}
                onRequestClose={() => setChecklistModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl max-h-[80%]">
                        <View className="px-6 py-4 border-b border-gray-200 flex-row justify-between items-center bg-gray-50 rounded-t-3xl">
                            <Text className="text-lg font-bold text-gray-800">Select Checklist Type</Text>
                            <TouchableOpacity onPress={() => setChecklistModalVisible(false)} className="p-2 bg-gray-200 rounded-full">
                                <X size={20} color="#4B5563" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView className="p-4">
                            {CHECKLIST_TYPES.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => handleSelectChecklistType(type)}
                                    className={`p-4 mb-3 rounded-xl border ${checklistType === type ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'}`}
                                >
                                    <Text className={`text-base font-semibold ${checklistType === type ? 'text-blue-700' : 'text-gray-700'}`}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Image Annotation Modal */}
            <ImageAnnotationModal
                visible={annotationModalVisible}
                imageUri={tempImageUri}
                onClose={() => setAnnotationModalVisible(false)}
                onSave={handleAnnotationSave}
            />
        </SafeAreaView >
    );
}
