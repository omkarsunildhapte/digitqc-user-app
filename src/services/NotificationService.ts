import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import ApiClientService from './ApiClientService';

export async function registerForPushNotificationsAsync(userId: string) {
    console.log('Registering for push notifications...');
    let token;
    if (!Device.isDevice) {
        console.log('Must use a physical device for push notifications');
        return;
    }
    console.log('Device is a physical device');
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log('Existing status:', existingStatus);
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    console.log('Final status:', finalStatus);
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }
    console.log('Getting Expo push token...');
    try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        console.log('Project ID:', projectId);

        const payload = {
            projectId: projectId
        };
        const value = await Notifications.getExpoPushTokenAsync(payload);
        token = value.data;
        console.log('Expo push token:', token);
    } catch (e) {
        console.error("Error getting push token:", e);
        throw new Error("Failed to get push token. EAS Project ID missing?");
    }

    if (!token) {
        console.warn("Push token is undefined. Skipping backend registration.");
        return;
    }

    // 3. Android Channel
    if (Platform.OS === 'android') {
        const payload = {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        }
        await Notifications.setNotificationChannelAsync('default', payload);
    }

    // 4. Send token to backend
    // ApiClientService.registerMobileToken already throws if it fails
    const payload = {
        userId,
        expoPushToken: token,
        platform: Platform.OS,
        userType: 'tenant-user',
    };
    await ApiClientService.registerMobileToken(payload);

    return token;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function schedulePushNotification(title: string, body: string, data: any = {}) {
    const content = {
        title,
        body,
        data,
    };
    await Notifications.scheduleNotificationAsync({ content, trigger: null });
}

export function addNotificationListeners(
    onReceived: (notification: Notifications.Notification) => void,
    onResponse: (response: Notifications.NotificationResponse) => void
) {
    const receivedListener = Notifications.addNotificationReceivedListener(onReceived);
    const responseListener = Notifications.addNotificationResponseReceivedListener(onResponse);

    return () => {
        receivedListener.remove();
        responseListener.remove();
    };
}