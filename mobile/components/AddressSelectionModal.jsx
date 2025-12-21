import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useAddressStore } from "../stores/useAddressStore";

const AddressSelectionModal = ({
    visible,
    onClose,
    onProceed,
    isProcessing,
}) => {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const { addresses, isLoading: addressesLoading } = useAddressStore()

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-[#161616] rounded-t-3xl h-1/2">
                    {/* Modal Header */}
                    <View className="flex-row items-center justify-between p-6 border-b border-[#232323]">
                        <Text className="text-white text-2xl font-bold">Select Address</Text>
                        <TouchableOpacity onPress={onClose} className="bg-[#232323] rounded-full p-2">
                            <Ionicons name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-6">
                        {addressesLoading ? (
                            <View className="py-8">
                                <ActivityIndicator size="large" color="#22C55E" />
                            </View>
                        ) : (
                            <View className="gap-4">
                                {addresses?.map((address) => (
                                    <TouchableOpacity
                                        key={address._id}
                                        className={`bg-[#0B0B0B] rounded-3xl p-6 border-2 ${selectedAddress?._id === address._id
                                            ? "border-[#22C55E]"
                                            : "border-[#232323]"
                                            }`}
                                        activeOpacity={0.7}
                                        onPress={() => setSelectedAddress(address)}
                                    >
                                        <View className="flex-row items-start justify-between">
                                            <View className="flex-1">
                                                <View className="flex-row items-center mb-3">
                                                    <Text className="text-[#22C55E] font-bold text-lg mr-2">
                                                        {address.label}
                                                    </Text>
                                                    {address.isDefault && (
                                                        <View className="bg-[#22C55E]/20 rounded-full px-3 py-1">
                                                            <Text className="text-[#22C55E] text-sm font-semibold">Default</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text className="text-white font-semibold text-lg mb-2">
                                                    {address.fullName}
                                                </Text>
                                                <Text className="text-gray-400 text-base leading-6 mb-1">
                                                    {address.streetAddress}
                                                </Text>
                                                <Text className="text-gray-400 text-base mb-2">
                                                    {address.city}, {address.state} {address.zipCode}
                                                </Text>
                                                <Text className="text-gray-400 text-base">{address.phoneNumber}</Text>
                                            </View>
                                            {selectedAddress?._id === address._id && (
                                                <View className="bg-[#22C55E] rounded-full p-2 ml-3">
                                                    <Ionicons name="checkmark" size={24} color="#000000" />
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    <View className="p-6 border-t border-[#232323]">
                        <TouchableOpacity
                            className="bg-[#22C55E] rounded-2xl py-5"
                            activeOpacity={0.9}
                            onPress={() => {
                                if (selectedAddress) onProceed(selectedAddress);
                            }}
                            disabled={!selectedAddress || isProcessing}
                        >
                            <View className="flex-row items-center justify-center">
                                {isProcessing ? (
                                    <ActivityIndicator size="small" color="#000000" />
                                ) : (
                                    <>
                                        <Text className="text-black font-bold text-lg mr-2">
                                            Continue to Payment
                                        </Text>
                                        <Ionicons name="arrow-forward" size={20} color="#000000" />
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddressSelectionModal;
