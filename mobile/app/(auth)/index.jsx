import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Login Failed", result.error || "Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0B0B0B]"
    >
      <StatusBar style="dark" />

      <View className="flex-1 justify-center px-8">
        {/* HEADER */}
        <View className="mb-10">
          <Text className="text-4xl font-bold text-white mb-2">
            Welcome Back!
          </Text>
          <Text className="text-[#9CA3AF] text-lg">
            Sign in to continue
          </Text>
        </View>

        {/* FORM */}
        <View className="space-y-6">
          {/* EMAIL */}
          <View>
            <Text className="text-[#FFFFFF] font-medium mb-2 ml-1">
              Email Address
            </Text>
            <View className="h-14 bg-[#161616] border border-[#232323] rounded-2xl flex-row items-center px-4">
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-white text-base"
                placeholder="Ex: john@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View>
            <Text className="text-[#FFFFFF] font-medium mb-2 ml-1">
              Password
            </Text>
            <View className="h-14 bg-[#161616] border border-[#232323] rounded-2xl flex-row items-center px-4">
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-white text-base"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`h-14 mt-4 bg-[#22C55E] rounded-2xl justify-center items-center ${isLoading ? "opacity-70" : ""
              }`}
          >
            {isLoading ? (
              <ActivityIndicator color="#0B0B0B" />
            ) : (
              <Text className="text-[#0B0B0B] font-bold text-lg">
                Login
              </Text>
            )}
          </TouchableOpacity>

          {/* SIGNUP LINK */}
          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-[#9CA3AF] text-base">
              Don’t have an account?
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text className="ml-1 text-white font-bold text-base">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
