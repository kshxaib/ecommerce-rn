import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function registerForPushNotifications() {
    if (!Device.isDevice) {
        alert("Physical device required");
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        alert("Permission denied");
        return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log("Expo Push Token: ", tokenData.data);
    return tokenData.data; // Expo Push Token
}
