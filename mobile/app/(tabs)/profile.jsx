import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuthStore } from '../../stores/useAuthStore'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'

const MENU_ITEMS = [
    { id: 1, icon: "person-outline", title: "Edit Profile", color: "#3B82F6", action: "/profile" },
    { id: 2, icon: "list-outline", title: "Orders", color: "#10B981", action: "/orders" },
    { id: 3, icon: "location-outline", title: "Addresses", color: "#F59E08", action: "/addresses" },
    { id: 4, icon: "heart-outline", title: "Wishlist", color: "#EF4444", action: "/wishlist" },
]

export default function ProfileScreen() {
    const { user, logout } = useAuthStore()
    const router = useRouter()

    const handleMenuPress = (action) => {
        if (action === "profile") return;
        router.push(action);
    }

    const handleLogout = async () => {
        await logout()
        router.replace("/(auth)")
    }

    return (
        <ScrollView
            className="flex-1 bg-[#0B0B0B]"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
        >
            {/* HEADER */}
            <View className="px-6 pb-8">
                <View className="bg-[#161616] rounded-3xl p-6">
                    <View className="flex-row items-center">
                        <View className="relative">
                            <Image
                                source={user?.imageUrl}
                                transition={2000}
                                style={{ width: 80, height: 80, borderRadius: 40 }}
                            />
                            <View className="absolute -bottom-1 -right-1 bg-[#1DB954] rounded-full h-7 w-7 items-center justify-center border-2 border-[#161616]">
                                <Ionicons name='checkmark' size={16} color="#121212" />
                            </View>
                        </View>

                        <View className="flex-1 ml-4">
                            <Text className="text-white text-2xl font-bold mb-1">{user?.name}</Text>
                            <Text className="text-gray-400 text-sm">{user?.email}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* MENU ITEMS */}
            <View className="flex-row flex-wrap gap-2 mx-6 mb-3">
                {MENU_ITEMS.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        className="bg-[#161616] rounded-2xl p-6 items-center justify-center"
                        style={{ width: "48%" }}
                        activeOpacity={0.7}
                        onPress={() => handleMenuPress(item.action)}
                    >
                        <View className="rounded-full w-16 h-16 items-center justify-center mb-4" style={{ backgroundColor: item.color + "20" }}>
                            <Ionicons name={item.icon} size={28} color={item.color} />
                        </View>
                        <Text className="text-white font-bold text-base">{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* NOTIFICATIONS */}
            <View className="mb-3 mx-6 bg-[#161616] rounded-2xl p-4">
                <TouchableOpacity className="flex-row items-center justify-between py-2" activeOpacity={0.7}>
                    <View className="flex-row items-center">
                        <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                        <Text className="text-white font-semibold ml-3">Notifications</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
            </View>

            {/* PRIVACY & SECURITY */}
            <View className="mb-3 mx-6 bg-[#161616] rounded-2xl p-4">
                <TouchableOpacity
                    className="flex-row items-center justify-between py-2"
                    activeOpacity={0.7}
                    onPress={() => router.push("/privacy-security")}
                >
                    <View className="flex-row items-center">
                        <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" />
                        <Text className="text-white font-semibold ml-3">Privacy & Security</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
            </View>

            {/* SIGNOUT BTN */}
            <TouchableOpacity
                className="mx-6 mb-3 bg-[#161616] rounded-2xl py-5 flex-row items-center justify-center border-2 border-red-500/20"
                activeOpacity={0.8}
                onPress={handleLogout}
            >
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                <Text className="text-red-500 font-bold text-base ml-2">Sign Out</Text>
            </TouchableOpacity>

            <Text className="mx-6 mb-3 text-center text-gray-400 text-xs">Version 1.0.0</Text>
        </ScrollView>
    )
}
