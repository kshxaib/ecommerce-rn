import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import React, { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert("Login Failed", result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      <View className="flex-1 justify-center px-8">
        {/* Header Section */}
        <View className="mb-10">
          <Text className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</Text>
          <Text className="text-gray-500 text-lg">Sign in to continue</Text>
        </View>

        {/* Form Section */}
        <View className="space-y-6">
          {/* Email Input */}
          <View>
            <Text className="text-gray-600 font-medium mb-2 ml-1">Email Address</Text>
            <View className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl flex-row items-center px-4 focus:border-black focus:bg-white transition-all">
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base"
                placeholder="Ex: john@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-gray-600 font-medium mb-2 ml-1">Password</Text>
            <View className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl flex-row items-center px-4 focus:border-black focus:bg-white transition-all">
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`w-full h-14 mt-4 bg-black rounded-2xl justify-center items-center shadow-sm ${isLoading ? 'opacity-70' : ''}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Login</Text>
            )}
          </TouchableOpacity>

          {/* Signup Link */}
          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-gray-500 text-base">Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text className="text-black font-bold text-base">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}
