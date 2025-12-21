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
            <View className="flex-1 bg-black/60 justify-end">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="bg-white rounded-t-3xl max-h-[90%]"
                >
                    {/* HEADER */}
                    <View className="px-6 py-5 border-b border-gray-200 flex-row items-center justify-between">
                        <Text className="text-black text-2xl font-bold">
                            {isEditing ? "Edit Address" : "Add New Address"}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color="#000000" />
                        </TouchableOpacity>
                    </View>

                    {/* FORM */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        <View className="p-6">
                            {/* LABEL */}
                            <View className="mb-5">
                                <Text className="text-gray-700 font-semibold mb-2">Label</Text>
                                <TextInput
                                    className="bg-gray-100 text-black p-4 rounded-xl text-base"
                                    placeholder="e.g., Home, Work"
                                    placeholderTextColor="#999"
                                    value={addressForm.label}
                                    onChangeText={(text) =>
                                        onFormChange({ ...addressForm, label: text })
                                    }
                                />
                            </View>

                            {/* FULL NAME */}
                            <View className="mb-5">
                                <Text className="text-gray-700 font-semibold mb-2">Full Name</Text>
                                <TextInput
                                    className="bg-gray-100 text-black px-4 py-4 rounded-xl text-base"
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#999"
                                    value={addressForm.fullName}
                                    onChangeText={(text) =>
                                        onFormChange({ ...addressForm, fullName: text })
                                    }
                                />
                            </View>

                            {/* STREET */}
                            <View className="mb-5">
                                <Text className="text-gray-700 font-semibold mb-2">Street Address</Text>
                                <TextInput
                                    className="bg-gray-100 text-black px-4 py-4 rounded-xl text-base"
                                    placeholder="Street, apartment, etc."
                                    placeholderTextColor="#999"
                                    value={addressForm.streetAddress}
                                    onChangeText={(text) =>
                                        onFormChange({ ...addressForm, streetAddress: text })
                                    }
                                    multiline
                                />
                            </View>

                            {/* CITY */}
                            <View className="mb-5">
                                <Text className="text-gray-700 font-semibold mb-2">City</Text>
                                <TextInput
                                    className="bg-gray-100 text-black px-4 py-4 rounded-xl text-base"
                                    placeholder="City"
                                    placeholderTextColor="#999"
                                    value={addressForm.city}
                                    onChangeText={(text) =>
                                        onFormChange({ ...addressForm, city: text })
                                    }
                                />
                            </View>

                            {/* STATE */}
                            <View className="mb-5">
                                <Text className="text-gray-700 font-semibold mb-2">State</Text>
                                <TextInput
                                    className="bg-gray-100 text-black px-4 py-4 rounded-xl text-base"
                                    placeholder="State"
                                    placeholderTextColor="#999"
                                    value={addressForm.state}
                                    onChangeText={(text) =>
                                        onFormChange({ ...addressForm, state: text })
                                    }
                                />
                            </View>

                            {/* ZIP */}
                            <View className="mb-5">
                                <Text className="text-gray-700 font-semibold mb-2">ZIP Code</Text>
                                <TextInput
                                    className="bg-gray-100 text-black px-4 py-4 rounded-xl text-base"
                                    placeholder="ZIP code"
                                    placeholderTextColor="#999"
                                    value={addressForm.zipCode}
                                    onChangeText={(text) =>
                                        onFormChange({ ...addressForm, zipCode: text })
                                    }
                                    keyboardType="numeric"
                                />
                            </View>

                            {/* PHONE */}
                            <View className="mb-5">
                                <Text className="text-gray-700 font-semibold mb-2">Phone Number</Text>
                                <TextInput
                                    className="bg-gray-100 text-black px-4 py-4 rounded-xl text-base"
                                    placeholder="Phone number"
                                    placeholderTextColor="#999"
                                    value={addressForm.phoneNumber}
                                    onChangeText={(text) =>
                                        onFormChange({ ...addressForm, phoneNumber: text })
                                    }
                                    keyboardType="phone-pad"
                                />
                            </View>

                            {/* DEFAULT */}
                            <View className="bg-gray-100 rounded-xl p-4 flex-row items-center justify-between mb-6">
                                <Text className="text-black font-semibold">
                                    Set as default address
                                </Text>
                                <Switch
                                    value={addressForm.isDefault}
                                    onValueChange={(value) =>
                                        onFormChange({ ...addressForm, isDefault: value })
                                    }
                                />
                            </View>

                            {/* SAVE */}
                            <TouchableOpacity
                                className="bg-black rounded-xl py-5 items-center"
                                activeOpacity={0.8}
                                onPress={onSave}
                                disabled={isAddingAddress || isUpdatingAddress}
                            >
                                {isAddingAddress || isUpdatingAddress ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">
                                        {isEditing ? "Save Changes" : "Add Address"}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
