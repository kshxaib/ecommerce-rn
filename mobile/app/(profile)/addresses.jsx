import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAddressStore } from '../../stores/useAddressStore'
import AddressesHeader from '../../components/AddressesHeader';
import { Ionicons } from '@expo/vector-icons';
import AddressFormModal from '../../components/AddressFormModal';
import AddressCard from '../../components/AddressCard';


export default function AddressesScreen() {
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({ label: "", fullName: "", streetAddress: "", city: "", state: "", zipCode: "", phoneNumber: "", isDefault: false, });

    const { addresses, getAddresses, addAddress, updateAddress, deleteAddress, isLoading, isAdding, isDeleting, isUpdating } = useAddressStore()

    useEffect(() => {
        getAddresses()
    }, [])

    const handleAddAddress = async () => {
        setShowAddressForm(true)
        setEditingAddressId(null)
        setAddressForm({
            label: "",
            fullName: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            phoneNumber: "",
            isDefault: false,
        });
    }

    const handleEditAddress = async (address) => {
        setShowAddressForm(true);
        setEditingAddressId(address._id);
        setAddressForm({
            label: address.label,
            fullName: address.fullName,
            streetAddress: address.streetAddress,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            phoneNumber: address.phoneNumber,
            isDefault: address.isDefault,
        });
    }

    const handleDeleteAddress = async (addressId, label) => {
        Alert.alert(
            "Delete Address",
            `Are you sure you want to delete ${label}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => deleteAddress(addressId),
                },
            ]
        );
    }

    const handleSaveAddress = async () => {
        if (
            !addressForm.label ||
            !addressForm.fullName ||
            !addressForm.streetAddress ||
            !addressForm.city ||
            !addressForm.state ||
            !addressForm.zipCode ||
            !addressForm.phoneNumber
        ) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (editingAddressId) {
            await updateAddress(editingAddressId, addressForm)
            setShowAddressForm(false)
            setEditingAddressId(null)
            Alert.alert("Success", "Address updated successfully");
        } else {
            await addAddress(addressForm)
            setShowAddressForm(false)
            Alert.alert("Success", "Address added successfully");
        }
    }

    const handleCloseAddressForm = () => {
        setShowAddressForm(false)
        setEditingAddressId(null)
    }

    if (isLoading) {
        return <LoadingUI />
    }

    return (
        <>
            <AddressesHeader />
            {
                addresses.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-6">
                        <Ionicons name="location-outline" size={80} color="#666" />
                        <Text className="text-text-primary font-semibold text-xl mt-4">No addresses yet</Text>
                        <Text className="text-text-secondary text-center mt-2">
                            Add your first delivery address
                        </Text>
                        <TouchableOpacity
                            className="bg-primary rounded-2xl px-8 py-4 mt-6"
                            activeOpacity={0.8}
                            onPress={handleAddAddress}
                        >
                            <Text className="text-background font-bold text-base">Add Address</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    >
                        <View className="px-6 py-4">
                            {addresses.map((address) => (
                                <AddressCard
                                    key={address._id}
                                    address={address}
                                    onEdit={handleEditAddress}
                                    onDelete={handleDeleteAddress}
                                    isUpdatingAddress={isUpdating}
                                    isDeletingAddress={isDeleting}
                                />
                            ))}

                            <TouchableOpacity
                                className="bg-primary rounded-2xl py-4 items-center mt-2"
                                activeOpacity={0.8}
                                onPress={handleAddAddress}
                            >
                                <View className="flex-row items-center">
                                    <Ionicons name="add-circle-outline" size={24} color="#121212" />
                                    <Text className="text-background font-bold text-base ml-2">Add New Address</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                )
            }
            <AddressFormModal
                visible={showAddressForm}
                isEditing={!!editingAddressId}
                addressForm={addressForm}
                isAddingAddress={isAdding}
                isUpdatingAddress={isUpdating}
                onClose={handleCloseAddressForm}
                onSave={handleSaveAddress}
                onFormChange={setAddressForm}
            />
        </>
    )
}

function LoadingUI() {
    return (
        <>
            <AddressesHeader />
            <View className="flex-1 items-center justify-center px-6">
                <ActivityIndicator size="large" color="#00D9FF" />
                <Text className="text-text-secondary mt-4">Loading addresses...</Text>
            </View>
        </>
    );
}