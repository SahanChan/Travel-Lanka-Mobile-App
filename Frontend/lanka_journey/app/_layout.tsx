import { Redirect, Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "react-native";
import { ClerkProvider, useAuth, useClerk } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import * as Linking from "expo-linking";

// This layout determines the root navigation structure
function RootLayoutNav() {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for auth to load before deciding where to route
  if (!isLoaded) return null;

  // If user is not signed in, redirect to auth flow
  if (!isSignedIn) {
    return (
      <>
        <StatusBar hidden={true} />

        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </>
    );
  }

  // If user is signed in, redirect to tabs
  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="trips/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      // publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
    </ClerkProvider>
  );
}
