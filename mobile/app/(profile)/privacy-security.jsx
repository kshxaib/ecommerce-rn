import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import api from "../../lib/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PrivacySecurityScreen() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [shareData, setShareData] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const submitDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            await api.delete("/api/users/profile");
            router.replace("/(auth)");
        } catch (error) {
            Alert.alert(
                "Error",
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: submitDeleteAccount },
            ]
        );
    };

    const handleToggle = (id, value) => {
        switch (id) {
            case "two-factor":
                setTwoFactorEnabled(value);
                break;
            case "biometric":
                setBiometricEnabled(value);
                break;
            case "push":
                setPushNotifications(value);
                break;
            case "email":
                setEmailNotifications(value);
                break;
            case "marketing":
                setMarketingEmails(value);
                break;
            case "data":
                setShareData(value);
                break;
        }
    };

    return (
        <View className="flex-1 bg-black">
            {/* HEADER */}
            <View className="px-5 py-4 flex-row items-center border-b border-zinc-800">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">
                    Privacy & Security
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* SECURITY */}
                <View className="px-5 mt-6">
                    <Text className="text-white text-lg font-bold mb-3">
                        Security
                    </Text>

                    <View className="bg-zinc-900 rounded-2xl overflow-hidden">
                        {/* CHANGE PASSWORD */}
                        <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-zinc-800">
                            <Ionicons name="lock-closed-outline" size={22} color="#22c55e" />
                            <View className="ml-4 flex-1">
                                <Text className="text-white font-semibold">
                                    Change Password
                                </Text>
                                <Text className="text-zinc-400 text-sm">
                                    Update your account password
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#777" />
                        </TouchableOpacity>

                        {/* 2FA */}
                        <View className="flex-row items-center px-4 py-4 border-b border-zinc-800">
                            <Ionicons name="shield-checkmark-outline" size={22} color="#22c55e" />
                            <View className="ml-4 flex-1">
                                <Text className="text-white font-semibold">
                                    Two-Factor Authentication
                                </Text>
                                <Text className="text-zinc-400 text-sm">
                                    Extra layer of security
                                </Text>
                            </View>
                            <Switch
                                value={twoFactorEnabled}
                                onValueChange={(v) => handleToggle("two-factor", v)}
                                trackColor={{ false: "#27272a", true: "#22c55e" }}
                                thumbColor="#fff"
                            />
                        </View>

                        {/* BIOMETRIC */}
                        <View className="flex-row items-center px-4 py-4">
                            <Ionicons name="finger-print-outline" size={22} color="#22c55e" />
                            <View className="ml-4 flex-1">
                                <Text className="text-white font-semibold">
                                    Biometric Login
                                </Text>
                                <Text className="text-zinc-400 text-sm">
                                    Use fingerprint or face ID
                                </Text>
                            </View>
                            <Switch
                                value={biometricEnabled}
                                onValueChange={(v) => handleToggle("biometric", v)}
                                trackColor={{ false: "#27272a", true: "#22c55e" }}
                                thumbColor="#fff"
                            />
                        </View>
                    </View>
                </View>

                {/* PRIVACY */}
                <View className="px-5 mt-6">
                    <Text className="text-white text-lg font-bold mb-3">
                        Privacy
                    </Text>

                    <View className="bg-zinc-900 rounded-2xl overflow-hidden">
                        {[
                            {
                                id: "push",
                                title: "Push Notifications",
                                desc: "Receive app notifications",
                                value: pushNotifications,
                                icon: "notifications-outline",
                            },
                            {
                                id: "email",
                                title: "Email Notifications",
                                desc: "Order & account updates",
                                value: emailNotifications,
                                icon: "mail-outline",
                            },
                            {
                                id: "marketing",
                                title: "Marketing Emails",
                                desc: "Offers & promotions",
                                value: marketingEmails,
                                icon: "megaphone-outline",
                            },
                            {
                                id: "data",
                                title: "Share Usage Data",
                                desc: "Help improve the app",
                                value: shareData,
                                icon: "analytics-outline",
                            },
                        ].map((item, index, arr) => (
                            <View
                                key={item.id}
                                className={`flex-row items-center px-4 py-4 ${index !== arr.length - 1
                                    ? "border-b border-zinc-800"
                                    : ""
                                    }`}
                            >
                                <Ionicons name={item.icon} size={22} color="#22c55e" />
                                <View className="ml-4 flex-1">
                                    <Text className="text-white font-semibold">
                                        {item.title}
                                    </Text>
                                    <Text className="text-zinc-400 text-sm">
                                        {item.desc}
                                    </Text>
                                </View>
                                <Switch
                                    value={item.value}
                                    onValueChange={(v) => handleToggle(item.id, v)}
                                    trackColor={{ false: "#27272a", true: "#22c55e" }}
                                    thumbColor="#fff"
                                />
                            </View>
                        ))}
                    </View>
                </View>

                {/* DELETE ACCOUNT */}
                <View className="px-5 mt-8">
                    <TouchableOpacity
                        disabled={isDeleting}
                        onPress={handleDeleteAccount}
                        className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-5 flex-row items-center"
                    >
                        <Ionicons name="trash-outline" size={22} color="#ef4444" />
                        <View className="ml-4 flex-1">
                            <Text className="text-red-500 font-bold">
                                Delete Account
                            </Text>
                            <Text className="text-zinc-400 text-sm">
                                Permanently remove your account
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>
                <View className="px-6 pt-6 pb-4">
                    <View className="rounded-2xl p-4 flex-row">
                        <Ionicons name="information-circle-outline" size={24} color="#1DB954" />
                        <Text className="text-zinc-400 text-sm ml-3 flex-1">
                            We take your privacy seriously. Your data is encrypted and stored securely. You can
                            manage your privacy settings at any time.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}


