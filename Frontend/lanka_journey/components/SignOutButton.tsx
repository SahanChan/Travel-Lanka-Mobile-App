import { useClerk, useAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await signOut();

      // Use router.replace instead of Linking to properly reset the navigation stack
      router.replace("/(auth)/sign-in");
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      className="mt-6 mx-6 py-3 border border-secondary rounded-xl"
      disabled={loading}
    >
      <Text className="text-center text-yellow-500 font-semibold text-base">
        {loading ? "Signing out..." : "Sign out"}
      </Text>
    </TouchableOpacity>
  );
};
