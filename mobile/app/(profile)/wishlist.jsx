import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useWishlistStore } from "../../stores/useWishlistStore";
import { useCartStore } from "../../stores/useCartStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image } from "expo-image";

export default function WishlistScreen() {
  const {
    wishlist,
    wishlistData,
    removeFromWishlist,
    isLoading,
    isRemovingFromWishlist,
  } = useWishlistStore();

  const { addToCart, isAddingToCart } = useCartStore();

  const handleRemoveFromWishlist = (productId) => {
    Alert.alert(
      "Remove from wishlist",
      "Are you sure you want to remove this product?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => removeFromWishlist(productId) },
      ]
    );
  };

  const handleAddToCart = async (productId, productName) => {
    const result = await addToCart({ productId, quantity: 1 });
    await removeFromWishlist(productId);

    if (!result.success) {
      Alert.alert("Failed", `Failed to add ${productName} to cart`);
      return;
    }
    Alert.alert("Success", `${productName} added to cart`);
  };

  if (isLoading) return <LoadingUI />;

  return (
    <View className="flex-1 bg-[#0B0B0B]">
      {/* HEADER */}
      <View className="px-6 pb-5 border-b border-[#232323] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Wishlist</Text>
        <Text className="text-gray-400 text-sm ml-auto">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {wishlist.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="heart-outline" size={80} color="#444" />
          <Text className="text-white font-semibold text-xl mt-4">
            Wishlist is empty
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Save products you like for later
          </Text>
          <TouchableOpacity
            className="bg-[#22C55E] rounded-2xl px-8 py-4 mt-6"
            activeOpacity={0.9}
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-black font-bold text-base">
              Browse Products
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="px-6 py-4">
            {wishlistData.map((item) => (
              <View
                key={item._id}
                className="bg-[#0B0B0B] rounded-3xl mb-4 border border-[#232323]"
              >
                <View className="flex-row p-4">
                  <Image
                    source={item.images[0]}
                    className="rounded-2xl bg-[#161616]"
                    style={{ width: 96, height: 96 }}
                  />

                  <View className="flex-1 ml-4">
                    <Text
                      className="text-white font-bold text-base mb-2"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>

                    <Text className="text-[#22C55E] font-bold text-xl mb-2">
                      ${item.price.toFixed(2)}
                    </Text>

                    {item.stock > 0 ? (
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-[#22C55E] rounded-full mr-2" />
                        <Text className="text-[#22C55E] text-sm font-semibold">
                          {item.stock} in stock
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                        <Text className="text-red-500 text-sm font-semibold">
                          Out of stock
                        </Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    className="self-start bg-red-500/20 p-2 rounded-full"
                    onPress={() => handleRemoveFromWishlist(item._id)}
                    disabled={isRemovingFromWishlist}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                {item.stock > 0 && (
                  <View className="px-4 pb-4">
                    <TouchableOpacity
                      className="bg-[#22C55E] rounded-xl py-3 items-center"
                      activeOpacity={0.9}
                      onPress={() => handleAddToCart(item._id, item.name)}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <ActivityIndicator size="small" color="#000000" />
                      ) : (
                        <Text className="text-black font-bold">
                          Add to Cart
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function LoadingUI() {
  return (
    <View className="flex-1 bg-[#0B0B0B]">
      <View className="px-6 pb-5 border-b border-[#232323] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Wishlist</Text>
      </View>

      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#22C55E" />
        <Text className="text-gray-400 mt-4">Loading wishlist...</Text>
      </View>
    </View>
  );
}
