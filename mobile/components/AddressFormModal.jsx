import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Switch,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function AddressFormModal({
    addressForm,
    isAddingAddress,
    isEditing,
    isUpdatingAddress,
    onClose,
    onFormChange,
    onSave,
    visible,
}) {
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            {/* BACKDROP */}
            <Pressable className="flex-1 bg-black/70 justify-end" onPress={onClose}>
                <Pressable>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="bg-[#161616] rounded-t-3xl max-h-[90%]"
                    >
                        {/* HEADER */}
                        <View className="px-6 py-5 border-b border-[#232323] flex-row items-center justify-between">
                            <Text className="text-white text-2xl font-bold">
                                {isEditing ? "Edit Address" : "Add New Address"}
                            </Text>
                            <TouchableOpacity
                                onPress={onClose}
                                className="bg-[#232323] rounded-full p-2"
                            >
                                <Ionicons name="close" size={22} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {/* FORM */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 40 }}
                        >
                            <View className="p-6">
                                {[
                                    { label: "Label", key: "label", placeholder: "Home / Work" },
                                    { label: "Full Name", key: "fullName", placeholder: "Your name" },
                                    {
                                        label: "Street Address",
                                        key: "streetAddress",
                                        placeholder: "Street, apartment",
                                        multiline: true,
                                    },
                                    { label: "City", key: "city", placeholder: "City" },
                                    { label: "State", key: "state", placeholder: "State" },
                                    {
                                        label: "ZIP Code",
                                        key: "zipCode",
                                        placeholder: "ZIP",
                                        keyboard: "numeric",
                                    },
                                    {
                                        label: "Phone Number",
                                        key: "phoneNumber",
                                        placeholder: "Phone number",
                                        keyboard: "phone-pad",
                                    },
                                ].map((item) => (
                                    <View key={item.key} className="mb-5">
                                        <Text className="text-gray-400 font-semibold mb-2">
                                            {item.label}
                                        </Text>
                                        <TextInput
                                            className="bg-[#0B0B0B] text-white px-4 py-4 rounded-xl text-base border border-[#232323]"
                                            placeholder={item.placeholder}
                                            placeholderTextColor="#777"
                                            value={addressForm[item.key]}
                                            keyboardType={item.keyboard || "default"}
                                            multiline={item.multiline}
                                            onChangeText={(text) =>
                                                onFormChange({
                                                    ...addressForm,
                                                    [item.key]: text,
                                                })
                                            }
                                        />
                                    </View>
                                ))}

                                {/* DEFAULT SWITCH */}
                                <View className="bg-[#0B0B0B] rounded-xl p-4 flex-row items-center justify-between border border-[#232323] mb-6">
                                    <Text className="text-white font-semibold">
                                        Set as default address
                                    </Text>
                                    <Switch
                                        value={addressForm.isDefault}
                                        onValueChange={(value) =>
                                            onFormChange({
                                                ...addressForm,
                                                isDefault: value,
                                            })
                                        }
                                        trackColor={{ true: "#22C55E" }}
                                        thumbColor="#FFFFFF"
                                    />
                                </View>

                                {/* SAVE BUTTON */}
                                <TouchableOpacity
                                    className="bg-[#22C55E] rounded-2xl py-5 items-center"
                                    activeOpacity={0.9}
                                    onPress={onSave}
                                    disabled={isAddingAddress || isUpdatingAddress}
                                >
                                    {isAddingAddress || isUpdatingAddress ? (
                                        <ActivityIndicator size="small" color="#000000" />
                                    ) : (
                                        <Text className="text-black font-bold text-lg">
                                            {isEditing ? "Save Changes" : "Add Address"}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
