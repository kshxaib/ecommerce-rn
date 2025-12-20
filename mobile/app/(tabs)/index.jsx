import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import ProductsGrid from '../../components/ProductsGrid';
import { useProductStore } from '../../stores/useProductStore';

const CATEGORIES = [
    { name: "All", icon: "grid-outline" },
    { name: "Electronics", image: require("../../assets/images/electronics.png") },
    { name: "Fashion", image: require("../../assets/images/fashion.png") },
    { name: "Sports", image: require("../../assets/images/sports.png") },
    { name: "Books", image: require("../../assets/images/books.png") },
];

export default function ShopScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const { getAllProducts, products, isLoading } = useProductStore()

    const filteredProducts = useMemo(() => {
        if (!products) return [];

        let filtered = products;

        if (selectedCategory !== "All") {
            filtered = filtered.filter((product) => product.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [products, selectedCategory, searchQuery])


    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            {/* HEADER */}
            <View className="px-6 pb-6 pt-6">
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-#FFFFFF text-3xl font-bold tracking-tight ">Shop</Text>
                        <Text className="text-#B3B3B3 text-sm mt-1">Explore the best products</Text>
                    </View>

                    <TouchableOpacity className="bg-#282828/50 p-3 rounded-full">
                        <Ionicons name='options-outline' size={22} color={"#fff"} />
                    </TouchableOpacity>
                </View>

                {/* SEARCH BAR */}
                <View className="bg-#282828/50 flex-row items-center px-5 py-4 rounded-2xl">
                    <Ionicons name='search' size={22} color={"#666"} />
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor={"#666"}
                        className="ml-3 flex-1 text-base text-#FFFFFF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* CATEGORY FILTER */}
            <View className="mb-6">
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                    {CATEGORIES.map((category) => {
                        const isSelected = selectedCategory === category.name;
                        return (
                            <TouchableOpacity
                                key={category.name}
                                onPress={() => setSelectedCategory(category.name)}
                                className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center ${isSelected ? "bg-#282828" : "bg-#282828/50"}`}
                            >
                                {
                                    category.icon ? (
                                        <Ionicons name={category.icon} size={36} color={isSelected ? "#121212" : "#fff"} />
                                    ) : (
                                        <Image source={category.image} className="size-12" resizeMode='contain' />
                                    )
                                }
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>

            <View className="px-6 mb-6">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-#FFFFFF text-lg font-bold">Products</Text>
                    <Text className="text-#B3B3B3 text-sm">{products.length} items</Text>
                </View>

                {/* PRODUCTS GRID */}
                <ProductsGrid products={filteredProducts} isLoading={isLoading} />
            </View>
        </ScrollView>
    )
} 