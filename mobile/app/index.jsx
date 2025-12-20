import { Redirect } from "expo-router";
import { useAuthStore } from "../stores/useAuthStore";

export default function Index() {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return <Redirect href="/(auth)" />;
  }

  return <Redirect href="/(tabs)" />;
}
