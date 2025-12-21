import { View, Text, Alert, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCartStore } from "../../stores/useCartStore"
import { useAddressStore } from "../../stores/useAddressStore"
import { Image } from 'expo-image'
import Ionicons from '@expo/vector-icons/Ionicons'
import OrderSummary from "../../components/OrderSummary"
import { router } from "expo-router";
import AddressSelectionModal from '../../components/AddressSelectionModal'

export default function CartScreen() {
    const {
        updateQuantity,
        removeFromCart,
        isRemovingFromCart,
        isUpdating,
        isLoading,
        cart,
        cartTotal,
        cartItemCount
    } = useCartStore();

    const { addresses, getAddresses } = useAddressStore();

    const [paymentLoading, setPaymentLoading] = useState(false);
    const [addressModalVisible, setAddressModalVisible] = useState(false);

    const cartItems = useCartStore((state) => state.cart.items) || [];
    const itemCount = useCartStore((state) => state.cartItemCount());
    const subtotal = useCartStore((state) => state.cartTotal());
    const shipping = 50
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    const handleQuantityChange = async (productId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;
        await updateQuantity({ productId, quantity: newQuantity })
    };

    const handleRemoveItem = async (productId, productName) => {
        Alert.alert(
            "Remove Item",
            `Remove ${productName} from your cart?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Remove", onPress: async () => await removeFromCart(productId) },
            ]
        )
    }

    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        if (!addresses || addresses.length === 0) {
            Alert.alert(
                "No Address",
                "Please add an address to continue",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Add Address", onPress: () => router.push("/(profile)/addresses") },
                ]
            )
            return;
        }
        setAddressModalVisible(true)
    }

    useEffect(() => {
        getAddresses()
    }, [])

    if (isLoading) return <LoadingUI />;
    if (cartItems.length === 0) return <EmptyUI />;

    return (
        <>
            <Text className="px-6 pb-5 bg-[#0B0B0B] text-white text-3xl font-bold tracking-tight">
                Cart
            </Text>

            <ScrollView
                className="flex-1 bg-[#0B0B0B]"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 240 }}
            >
                <View className="px-6">
                    {cartItems.map((item, index) => (
                        <View key={index} className="bg-[#161616] rounded-3xl mb-4 overflow-hidden">
                            <View className="flex-row p-4 gap-4">
                                <View className="relative">
                                    <Image
                                        source={item.product.images[0]}
                                        contentFit="cover"
                                        style={{ width: 112, height: 112, borderRadius: 16 }}
                                    />
                                    <View className="absolute top-2 right-2 bg-[#22C55E] rounded-full px-2 py-0.5">
                                        <Text className="text-black text-xs font-bold">
                                            ×{item.quantity}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-1 justify-between">
                                    <View>
                                        <Text
                                            className="text-white font-bold text-lg"
                                            numberOfLines={2}
                                        >
                                            {item.product.name}
                                        </Text>

                                        <View className="flex-row items-center mt-2">
                                            <Text className="text-[#22C55E] font-bold text-2xl">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </Text>
                                            <Text className="text-gray-400 text-sm ml-2">
                                                ${item.product.price.toFixed(2)} each
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center mt-3">
                                        <TouchableOpacity
                                            className="bg-[#232323] rounded-full w-9 h-9 items-center justify-center"
                                            onPress={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                                            disabled={isUpdating}
                                        >
                                            <Ionicons name="remove" size={18} color="#FFFFFF" />
                                        </TouchableOpacity>

                                        <View className="mx-4 min-w-[32px] items-center">
                                            <Text className="text-white font-bold text-lg">
                                                {item.quantity}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            className="bg-[#22C55E] rounded-full w-9 h-9 items-center justify-center"
                                            onPress={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                                            disabled={isUpdating}
                                        >
                                            <Ionicons name="add" size={18} color="#000000" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="ml-auto bg-[#EF4444]/15 rounded-full w-9 h-9 items-center justify-center"
                                            onPress={() => handleRemoveItem(item.product._id, item.product.name)}
                                            disabled={isRemovingFromCart}
                                        >
                                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
            </ScrollView>

            {/* BOTTOM BAR */}
            <View className="absolute bottom-0 left-0 right-0 bg-[#0B0B0B]/95 border-t border-[#232323] pt-4 pb-32 px-6">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <Ionicons name="cart" size={20} color="#22C55E" />
                        <Text className="text-gray-400 ml-2">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                        </Text>
                    </View>
                    <Text className="text-white font-bold text-xl">
                        ${total.toFixed(2)}
                    </Text>
                </View>

                <TouchableOpacity
                    className="bg-[#22C55E] rounded-2xl"
                    onPress={handleCheckout}
                    disabled={paymentLoading}
                >
                    <View className="py-5 flex-row items-center justify-center">
                        <Text className="text-black font-bold text-lg mr-2">
                            Checkout
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="#000000" />
                    </View>
                </TouchableOpacity>
            </View>

            <AddressSelectionModal
                visible={addressModalVisible}
                onClose={() => setAddressModalVisible(false)}
                onProceed={() => { }}
                isProcessing={paymentLoading}
            />
        </>
    )
}

function LoadingUI() {
    return (
        <View className="flex-1 bg-[#0B0B0B] items-center justify-center">
            <ActivityIndicator size="large" color="#22C55E" />
            <Text className="text-gray-400 mt-4">Loading cart...</Text>
        </View>
    );
}

function EmptyUI() {
    return (
        <View className="flex-1 bg-[#0B0B0B]">
            <View className="px-6 pt-16 pb-5">
                <Text className="text-white text-3xl font-bold tracking-tight">
                    Cart
                </Text>
            </View>
            <View className="flex-1 items-center justify-center px-6">
                <Ionicons name="cart-outline" size={80} color="#9CA3AF" />
                <Text className="text-white font-semibold text-xl mt-4">
                    Your cart is empty
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                    Add some products to get started
                </Text>
            </View>
        </View>
    );
}
