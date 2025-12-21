import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, isLoading } = useAuthStore();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const result = await register(name, email, password, confirmPassword);
    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Registration Failed", result.error || "Please try again");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0B0B0B]"
    >
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="flex-1 justify-center px-8 py-10">
          {/* HEADER */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-white mb-2">Create Account</Text>
            <Text className="text-[#9CA3AF] text-lg">Sign up to get started</Text>
          </View>

          {/* FORM */}
          <View className="space-y-5">
            {/* NAME */}
            <View>
              <Text className="text-white font-medium mb-2 ml-1">Full Name</Text>
              <View className="h-14 bg-[#161616] border border-[#232323] rounded-2xl flex-row items-center px-4">
                <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-3 text-white text-base"
                  placeholder="Ex: John Doe"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* EMAIL */}
            <View>
              <Text className="text-white font-medium mb-2 ml-1">Email Address</Text>
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
              <Text className="text-white font-medium mb-2 ml-1">Password</Text>
              <View className="h-14 bg-[#161616] border border-[#232323] rounded-2xl flex-row items-center px-4">
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-3 text-white text-base"
                  placeholder="Create a password"
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

            {/* CONFIRM PASSWORD */}
            <View>
              <Text className="text-white font-medium mb-2 ml-1">Confirm Password</Text>
              <View className="h-14 bg-[#161616] border border-[#232323] rounded-2xl flex-row items-center px-4">
                <Ionicons name="shield-checkmark-outline" size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-3 text-white text-base"
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* SIGNUP BUTTON */}
            <TouchableOpacity
              onPress={handleSignup}
              disabled={isLoading}
              className={`h-14 mt-4 bg-[#22C55E] rounded-2xl justify-center items-center ${isLoading ? "opacity-70" : ""
                }`}
            >
              {isLoading ? (
                <ActivityIndicator color="#0B0B0B" />
              ) : (
                <Text className="text-[#0B0B0B] font-bold text-lg">Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* LOGIN LINK */}
            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-[#9CA3AF] text-base">Already have an account? </Text>
              <Link href="/(auth)" asChild>
                <TouchableOpacity>
                  <Text className="ml-1 text-white font-bold text-base">Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
