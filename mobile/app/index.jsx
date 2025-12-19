import { Redirect } from "expo-router";

const isLoggedIn = false;

export default function Index() {
  if (!isLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  return <Redirect href="/" />;
}
