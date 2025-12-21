import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native'
import React from 'react'
import { useWishlistStore } from '../stores/useWishlistStore'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCartStore } from '../stores/useCartStore'

export default function ProductsGrid({ products, isLoading }) {
    const { isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist } = useWishlistStore()
    const { isAddingToCart, addToCart } = useCartStore()
    const router = useRouter()

    const handleAddToCart = async (productId, productName) => {
        const result = await addToCart({ productId, quantity: 1 })
        if (!result.success) {
            Alert.alert("Failed", `Failed to add ${productName} in cart`)
        }
        Alert.alert("Success", `${productName} added to cart`)
    }

    if (isLoading) {
        return (
            <View className="py-20 items-center justify-center">
                <ActivityIndicator size={"large"} color="#00D9FF" />
                <Text className="text-#B3B3B3 mt-4">Loading products...</Text>
            </View>
        )
    }

    const renderProduct = ({ item: product }) => (
        <TouchableOpacity
            className="bg-#282828 rounded-3xl overflow-hidden mb-3"
            style={{ width: "48%" }}
            onPress={() => router.push(`/product/${product._id}`)}
        >
            <View className="relative">
                <Image
                    source={{ uri: product.images[0] }}
                    className="w-full h-44 bg-#282828"
                    resizeMode='cover'
                />

                <TouchableOpacity
                    className="absolute top-3 right-3 bg-black/30 backdrop-blur-xl p-2 rounded-full"
                    activeOpacity={0.7}
                    onPress={() => toggleWishlist(product._id)}
                    disabled={isAddingToWishlist || isRemovingFromWishlist}
                >
                    {
                        isAddingToWishlist || isRemovingFromWishlist ? (
                            <ActivityIndicator size={"small"} color={"#FFFFFF"} />
                        ) : (
                            <Ionicons
                                name={isInWishlist(product._id) ? "heart" : "heart-outline"}
                                size={24}
                                color={isInWishlist(product._id) ? "#FF0000" : "#FFFFFF"}
                            />
                        )
                    }
                </TouchableOpacity>
            </View>

            <View className="p-3">
                <Text className="text-#FFFFFF text-xs mb-1">{product.category}</Text>
                <Text className="text-#B3B3B3 text-sm font-vold mb-2" numberOfLines={2}>{product.name}</Text>
            </View>

            <View className="flex-row items-center mb-2">
                <Ionicons name='star' size={12} color="#FFC107" />
                <Text className="text-#FFFFFF text-xs fort-semibold ml-1">
                    {product.averageRating.toFixed(1)}
                </Text>
                <Text className="text-#B3B3B3 text-xs ml-1">
                    ({product.totalReviews})
                </Text>
            </View>

            <View className="flex-row items-center justify-between">
                <Text className="text-#FFFFFF font text-lg">${product.price.toFixed(2)}</Text>
                <TouchableOpacity
                    className="bg-#121212 rounded-full w-8 h-8 items-center justify-center"
                    activeOpacity={0.7}
                    onPress={() => handleAddToCart(product._id, product.name)}
                    disabled={isAddingToCart}
                >
                    {
                        isAddingToCart ? (
                            <ActivityIndicator size={"small"} color="#FFFFFF" />
                        ) : (
                            <Ionicons name="add" size={24} color="#FFFFFF" />
                        )
                    }
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderProduct}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={NoProductsFound}
        />
    )
}

function NoProductsFound() {
    return (
        <View className="py-20 items-center justify-center">
            <Ionicons name='search-outline' size={48} color="#666" />
            <Text className="text-#FFFFFF font-medium mt-4">No products found</Text>
            <Text className="text-#B3B3B3 text-sm mt-2">Try adjusting your search or filter</Text>
        </View>
    )
}