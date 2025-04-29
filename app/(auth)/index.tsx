import * as React from "react";
import { View, Image, SafeAreaView } from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import {
  isClerkAPIResponseError,
  useSignIn,
  useSSO,
  useUser,
} from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const { startSSOFlow } = useSSO();
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);

  const HandleSignInWithGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        console.log("Session created");
      } else {
        console.log("No session created");
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setErrors(error.errors);
      } else {
        console.error(error);
      }
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Image
          source={require("@/assets/logo.png")}
          style={{ width: 200, height: 200 }}
        />
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>
          Modern Chat App
        </Text>
        <Text>The Best Chat App Ever Made</Text>
        {errors.map((error) => (
          <Text key={error.code}>{error.code}</Text>
        ))}
        <Button
          onPress={HandleSignInWithGoogle}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 30,
          }}
        >
          <Image
            source={require("@/assets/google-icon.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={{ color: "black", fontWeight: "500" }}>
            Sign in with Google
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
