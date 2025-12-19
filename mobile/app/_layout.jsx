import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeScreen>
          <Stack screenOptions={{ headerShown: false }} />
      </SafeScreen>
    </SafeAreaProvider>
  );
}
