import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddressCard({
    address,
    onEdit,
    onDelete,
    isUpdatingAddress,
    isDeletingAddress,
}) {
    return (
        <View className="bg-[#161616] rounded-3xl p-5 mb-3 border border-[#232323]">
            {/* HEADER */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <View className="bg-[#22C55E]/20 rounded-full w-12 h-12 items-center justify-center mr-3">
                        <Ionicons name="location" size={22} color="#22C55E" />
                    </View>

                    <Text className="text-white font-bold text-lg">
                        {address.label}
                    </Text>
                </View>

                {address.isDefault && (
                    <View className="bg-[#22C55E] px-3 py-1 rounded-full">
                        <Text className="text-black text-xs font-bold">
                            Default
                        </Text>
                    </View>
                )}
            </View>

            {/* ADDRESS DETAILS */}
            <View className="ml-15">
                <Text className="text-white font-semibold mb-1">
                    {address.fullName}
                </Text>

                <Text className="text-gray-400 text-sm mb-1">
                    {address.streetAddress}
                </Text>

                <Text className="text-gray-400 text-sm mb-2">
                    {address.city}, {address.state} {address.zipCode}
                </Text>

                <Text className="text-gray-400 text-sm">
                    {address.phoneNumber}
                </Text>
            </View>

            {/* ACTION BUTTONS */}
            <View className="flex-row mt-5 gap-3">
                <TouchableOpacity
                    className="flex-1 bg-[#22C55E]/20 py-3 rounded-xl items-center"
                    activeOpacity={0.7}
                    onPress={() => onEdit(address)}
                    disabled={isUpdatingAddress}
                >
                    <Text className="text-[#22C55E] font-bold">
                        Edit
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-1 bg-[#EF4444]/20 py-3 rounded-xl items-center"
                    activeOpacity={0.7}
                    onPress={() => onDelete(address._id, address.label)}
                    disabled={isDeletingAddress}
                >
                    <Text className="text-[#EF4444] font-bold">
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
