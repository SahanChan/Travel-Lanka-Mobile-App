import { Redirect, Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "react-native";
import { ClerkProvider, useAuth, useClerk } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import * as Linking from "expo-linking";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// This layout determines the root navigation structure
function RootLayoutNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null,
  );

  // Check if user has seen onboarding
  useEffect(() => {
    async function checkOnboarding() {
      try {
        const value = await AsyncStorage.getItem("hasSeenOnboarding");

        setHasSeenOnboarding(value === "true");
      } catch (error) {
        console.error("Error reading from AsyncStorage:", error);
        setHasSeenOnboarding(false);
      }
    }
    // async function defaultcheck() {
    //   try {
    //     const x = await AsyncStorage.setItem("hasSeenOnboarding", "false");
    //     const valuex = await AsyncStorage.getItem("hasSeenOnboarding");
    //     console.log(valuex);
    //   } catch (error) {
    //     console.error("Error reading from AsyncStorage:", error);
    //   }
    // }
    // defaultcheck();
    checkOnboarding();
  }, []);

  // Wait for auth and onboarding check to load before deciding where to route
  if (!isLoaded || hasSeenOnboarding === null) return null;

  // If user hasn't seen onboarding, show it first
  if (hasSeenOnboarding === false) {
    return (
      <>
        <StatusBar hidden={true} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
      </>
    );
  }

  // If user is not signed in, redirect to auth flow
  if (!isSignedIn) {
    return (
      <>
        <StatusBar hidden={true} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </>
    );
  }

  // If user is signed in, redirect to tabs
  return (
    <>
      <StatusBar hidden={true} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="trips/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="locations" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <RootLayoutNav />
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
