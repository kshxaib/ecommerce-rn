import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-#121212" style={{ paddingTop: insets.top }}>
      {children}
    </View>
  );
};

export default SafeScreen;