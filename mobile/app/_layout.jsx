import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect } from "react";
import { useWishlistStore } from "../stores/useWishlistStore";


export default function RootLayout() {
  const { checkAuth, isCheckingAuth, token } = useAuthStore();
  const { getWishlist } = useWishlistStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (token) {
      getWishlist();
    }
  }, [token]);

  if (isCheckingAuth) {
    return null; // or splash / loader
  }


  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeScreen>
    </SafeAreaProvider>
  );
}
