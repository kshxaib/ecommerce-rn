import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useOrderStore } from "../../stores/useOrderStore";
import { useReviewStore } from "../../stores/useReviewStore";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getStatusColor, capitalizeFirstLetter, formatDate } from "../../lib/utils";
import RatingModal from "../../components/RatingModal";

export default function OrdersScreen() {
    const { orders, isLoading, error, getOrders } = useOrderStore();
    const { isCreatingReview, createReview } = useReviewStore();

    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [productRatings, setProductRatings] = useState({});

    const handleOpenRating = (order) => {
        setSelectedOrder(order);
        setShowRatingModal(true);

        const initialRatings = {};
        order.orderItems.forEach((item) => {
            initialRatings[item.product._id] = 0;
        });
        setProductRatings(initialRatings);
    };

    const handleSubmitRating = async () => {
        if (!selectedOrder) return;

        const allRated = Object.values(productRatings).every((r) => r > 0);
        if (!allRated) {
            Alert.alert("Error", "Please rate all products");
            return;
        }

        try {
            await Promise.all(
                selectedOrder.orderItems.map((item) =>
                    createReview({
                        productId: item.product._id,
                        orderId: selectedOrder._id,
                        rating: productRatings[item.product._id],
                    })
                )
            );

            Alert.alert("Success", "Review submitted successfully");
            setShowRatingModal(false);
            setSelectedOrder(null);
            setProductRatings({});
            await getOrders();
        } catch (err) {
            Alert.alert("Error", err?.message || "Failed to submit review");
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <View className="flex-1 bg-black">
            {/* HEADER */}
            <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-800 bg-black">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="bg-gray-800/70 w-11 h-11 rounded-full items-center justify-center mr-4"
                >
                    <Ionicons name="arrow-back" size={22} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-2xl font-bold">My Orders</Text>
            </View>

            {isLoading ? (
                <LoadingUI />
            ) : error ? (
                <ErrorUI />
            ) : !orders || orders.length === 0 ? (
                <EmptyUI />
            ) : (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    <View className="px-5 py-4">
                        {orders.map((order) => {
                            const totalItems = order.orderItems.reduce(
                                (sum, item) => sum + item.quantity,
                                0
                            );

                            return (
                                <View
                                    key={order._id}
                                    className="bg-gray-900 rounded-3xl p-5 mb-4 border border-gray-800"
                                >
                                    {/* ORDER HEADER */}
                                    <View className="mb-4">
                                        <Text className="text-white font-bold text-base mb-1">
                                            Order #{order._id.slice(-8).toUpperCase()}
                                        </Text>

                                        <Text className="text-gray-400 text-sm mb-2">
                                            {formatDate(order.createdAt)}
                                        </Text>

                                        <View
                                            className="self-start px-3 py-1 rounded-full"
                                            style={{
                                                backgroundColor: getStatusColor(order.status) + "20",
                                            }}
                                        >
                                            <Text
                                                className="text-xs font-bold"
                                                style={{ color: getStatusColor(order.status) }}
                                            >
                                                {capitalizeFirstLetter(order.status)}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* ITEMS */}
                                    {order.orderItems.map((item) => (
                                        <Text
                                            key={item._id}
                                            numberOfLines={1}
                                            className="text-gray-400 text-sm"
                                        >
                                            {item.name} × {item.quantity}
                                        </Text>
                                    ))}

                                    {/* FOOTER */}
                                    <View className="border-t border-gray-800 mt-4 pt-4 flex-row justify-between items-center">
                                        <View>
                                            <Text className="text-gray-400 text-xs mb-1">
                                                {totalItems} items
                                            </Text>
                                            <Text className="text-green-500 font-bold text-xl">
                                                ${order.totalPrice.toFixed(2)}
                                            </Text>
                                        </View>

                                        {order.status === "delivered" &&
                                            (order.hasReviewed ? (
                                                <View className="bg-green-500/20 px-5 py-3 rounded-full flex-row items-center">
                                                    <Ionicons
                                                        name="checkmark-circle"
                                                        size={18}
                                                        color="#22C55E"
                                                    />
                                                    <Text className="text-green-500 font-semibold text-sm ml-2">
                                                        Reviewed
                                                    </Text>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    className="bg-green-500 px-5 py-3 rounded-full flex-row items-center"
                                                    activeOpacity={0.8}
                                                    onPress={() => handleOpenRating(order)}
                                                >
                                                    <Ionicons name="star" size={18} color="#121212" />
                                                    <Text className="text-black font-bold text-sm ml-2">
                                                        Leave Rating
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            )}

            <RatingModal
                visible={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                order={selectedOrder}
                productRatings={productRatings}
                onSubmit={handleSubmitRating}
                isSubmitting={isCreatingReview}
                onRatingChange={(productId, rating) =>
                    setProductRatings((prev) => ({ ...prev, [productId]: rating }))
                }
            />
        </View>
    );
}

/* ================= STATES ================= */

function LoadingUI() {
    return (
        <View className="flex-1 items-center justify-center bg-black">
            <ActivityIndicator size="large" color="#22C55E" />
            <Text className="text-gray-400 mt-4">Loading orders...</Text>
        </View>
    );
}

function ErrorUI() {
    return (
        <View className="flex-1 items-center justify-center px-6 bg-black">
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text className="text-white font-semibold text-xl mt-4">
                Failed to load orders
            </Text>
            <Text className="text-gray-400 text-center mt-2">
                Please check your connection and try again
            </Text>
        </View>
    );
}

function EmptyUI() {
    return (
        <View className="flex-1 items-center justify-center px-6 bg-black">
            <Ionicons name="receipt-outline" size={80} color="#6B7280" />
            <Text className="text-white font-semibold text-xl mt-4">
                No orders yet
            </Text>
            <Text className="text-gray-400 text-center mt-2">
                Your order history will appear here
            </Text>
        </View>
    );
}
