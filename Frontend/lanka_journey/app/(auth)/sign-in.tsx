import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      // const redirectUrlX = AuthSession.makeRedirectUri({
      //   scheme: "lankajourney",
      //   path: "sso-callback",
      //   // preferLocalhost: true,
      //   isTripleSlashed: true, // your app scheme (e.g., "lankajourney" for production)
      // });
      // console.log("Redirect URI:", redirectUrlX);
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: "lankajourney",
            path: "sso-callback",
            isTripleSlashed: true,
          }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded || loading) return;

    setLoading(true);
    setError("");

    // Start the sign-in process using the email/username and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: identifier,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError("Sign in could not be completed. Please try again.");
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={"padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          className="flex-1 bg-background"
          contentContainerStyle={{ minHeight: "100%", paddingTop: 40 }}
          // keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 bg-background px-6 justify-start">
            {/* Logo */}
            <View className="items-center mb-6">
              <Image
                source={images.logo} // your Lanka Journey logo
                className="w-40 h-40 mb-2"
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-center text-gray-800">
              Sign in
            </Text>
            <Text className="text-sm text-center text-gray-500 mt-3 mb-10">
              Hi Welcome back, Plan your next trip
            </Text>

            {error ? (
              <View className="bg-red-100 p-3 rounded-lg mb-4">
                <Text className="text-red-700">{error}</Text>
              </View>
            ) : null}

            {/* Email/Username Input */}
            <TextInput
              placeholder="Email or Username"
              value={identifier}
              autoCapitalize="none"
              onChangeText={(value) => setIdentifier(value)}
              className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-gray-800 mt-3"
              placeholderTextColor="#999"
            />

            {/* Password Input */}
            <View className="border border-gray-300 rounded-md px-4  flex-row items-center justify-between">
              <TextInput
                placeholder="Password"
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={(password) => setPassword(password)}
                className="flex-1 text-gray-800"
                placeholderTextColor="#999"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Ionicons name="eye-off-outline" size={20} color="#999" />
                ) : (
                  <Ionicons name="eye-outline" size={20} color="#999" />
                )}
              </Pressable>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="self-end mt-3 mb-6">
              <Text className="text-sm text-gray-500">Forget Password</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              className={`bg-secondary py-3 rounded-md mb-6 ${loading ? "opacity-70" : ""}`}
              onPress={onSignInPress}
              disabled={loading}
            >
              <Text className="text-center text-white font-semibold text-base">
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="h-px bg-gray-300 flex-1" />
              <Text className="mx-3 text-gray-500 text-sm">Or</Text>
              <View className="h-px bg-gray-300 flex-1" />
            </View>

            {/* Social Buttons */}
            <View className="flex-row justify-center mb-6">
              <TouchableOpacity
                className="flex-row items-center bg-white gap-5 px-5 py-3 rounded-lg shadow space-x-3"
                onPress={onPress}
              >
                <Image
                  source={icons.google}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="text-base text-black font-medium">
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}

            <View className="flex-row justify-center mt-4">
              <Text className="text-sm text-gray-600">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
                <Text className="text-secondary text-sm font-semibold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/*<View className="flex-1 justify-center px-8">*/}
        {/*  <View className="items-center mb-8">*/}
        {/*    <Text className="text-3xl font-bold text-primary mb-2">*/}
        {/*      Welcome Back*/}
        {/*    </Text>*/}
        {/*    <Text className="text-gray-500 text-center">*/}
        {/*      Sign in to continue your journey*/}
        {/*    </Text>*/}
        {/*  </View>*/}

        {/*  {error ? (*/}
        {/*    <View className="bg-red-100 p-3 rounded-lg mb-4">*/}
        {/*      <Text className="text-red-700">{error}</Text>*/}
        {/*    </View>*/}
        {/*  ) : null}*/}

        {/*  <View className="space-y-4">*/}
        {/*    <View>*/}
        {/*      <Text className="text-gray-700 mb-2 font-medium">Email</Text>*/}
        {/*      <TextInput*/}
        {/*        className="bg-gray-100 p-4 rounded-xl"*/}
        {/*        autoCapitalize="none"*/}
        {/*        value={emailAddress}*/}
        {/*        placeholder="Enter your email"*/}
        {/*        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}*/}
        {/*        keyboardType="email-address"*/}
        {/*      />*/}
        {/*    </View>*/}

        {/*    <View>*/}
        {/*      <Text className="text-gray-700 mb-2 font-medium">Password</Text>*/}
        {/*      <TextInput*/}
        {/*        className="bg-gray-100 p-4 rounded-xl"*/}
        {/*        value={password}*/}
        {/*        placeholder="Enter your password"*/}
        {/*        secureTextEntry={true}*/}
        {/*        onChangeText={(password) => setPassword(password)}*/}
        {/*      />*/}
        {/*    </View>*/}

        {/*    <TouchableOpacity*/}
        {/*      className={`bg-primary py-4 rounded-xl items-center mt-4 ${loading ? "opacity-70" : ""}`}*/}
        {/*      onPress={onSignInPress}*/}
        {/*      disabled={loading}*/}
        {/*    >*/}
        {/*      <Text className="text-white font-bold text-lg">*/}
        {/*        {loading ? "Signing in..." : "Sign In"}*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}

        {/*  <View className="flex-row justify-center mt-8">*/}
        {/*    <Text className="text-gray-600">Don't have an account? </Text>*/}
        {/*    <Link href="/(auth)/sign-up" asChild>*/}
        {/*      <TouchableOpacity>*/}
        {/*        <Text className="text-primary font-semibold">Sign Up</Text>*/}
        {/*      </TouchableOpacity>*/}
        {/*    </Link>*/}
        {/*  </View>*/}
        {/*</View>*/}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
