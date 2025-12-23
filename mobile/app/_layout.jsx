import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect } from "react";
import { useWishlistStore } from "../stores/useWishlistStore";
import { useCartStore } from "../stores/useCartStore";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const { checkAuth, isCheckingAuth, token } = useAuthStore();
  const { getWishlist } = useWishlistStore();
  const { getCart } = useCartStore();

  useEffect(() => {
    checkAuth();
    Notifications.requestPermissionsAsync();
  }, []);

  useEffect(() => {
    if (token) {
      getWishlist();
      getCart();
    }
  }, [token]);

  if (isCheckingAuth) return null;

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeScreen>
    </SafeAreaProvider>
  );
}
