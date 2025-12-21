import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AddressesHeader() {
    return (
        <View className="bg-[#0B0B0B] px-6 pb-5 pt-4 border-b border-[#232323] flex-row items-center">
            <TouchableOpacity
                onPress={() => router.back()}
                className="mr-4 bg-[#282828]/50 p-2 rounded-full"
                activeOpacity={0.7}
            >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text className="text-white text-2xl font-bold">
                My Addresses
            </Text>
        </View>
    );
}
