import { Slot } from "expo-router";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("Missing publishable key");
  }
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider value={DarkTheme}>
          <Slot />;
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
