import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useOrderStore } from '../../stores/useOrderStore'
import { useReviewStore } from '../../stores/useReviewStore'

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
            const productId = item.product._id
            initialRatings[productId] = 0;
        })
        setProductRatings(initialRatings);
    }

    const handleSubmitRating = async () => {
        if (!selectedOrder) return;

        const allRated = Object.values(productRatings).every((rating) => rating > 0)
        if (!allRated) {
            Alert.alert("Error", 'Please rate all products')
            return;
        }

        try {
            await Promise.all(
                selectedOrder.orderItems.map((item) => {
                    createReview({
                        productId: item.product._id,
                        orderId: selectedOrder._id,
                        rating: productRatings[item.product._id],
                    })
                })
            )

            Alert.alert("Success", 'Review submitted successfully')
            setShowRatingModal(false);
            setSelectedOrder(null);
            setProductRatings({});
            await getOrders();
        } catch (error) {
            Alert.alert("Error", error?.message || 'Failed to submit review')
        }
    }

    useEffect(() => {
        getOrders();
    }, [])

    return (
        <>
            <Text>OrdersScreen</Text>
        </>
    )
}