import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
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

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const router = useRouter();
  const [agree, setAgree] = useState(false);

  const [username, setUsername] = useState("");

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const onGooglePress = useCallback(async () => {
  //   try {
  //     const { createdSessionId, setActive } = await startGoogleOAuthFlow();
  //
  //     if (createdSessionId) {
  //       if (setActive) {
  //         await setActive({ session: createdSessionId });
  //       }
  //       router.replace("/");
  //     }
  //   } catch (err) {
  //     console.error("OAuth error", err);
  //     Alert.alert("Error", "Something went wrong during Google sign up");
  //   }
  // }, [startGoogleOAuthFlow]);
  //
  // const onFacebookPress = useCallback(async () => {
  //   try {
  //     const { createdSessionId, setActive } = await startFacebookOAuthFlow();
  //
  //     if (createdSessionId) {
  //       if (setActive) {
  //         await setActive({ session: createdSessionId });
  //       }
  //       router.replace("/");
  //     }
  //   } catch (err) {
  //     console.error("OAuth error", err);
  //     Alert.alert("Error", "Something went wrong during Facebook sign up");
  //   }
  // }, [startFacebookOAuthFlow]);

  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      const redirectUrlX = AuthSession.makeRedirectUri({
        scheme: "lankajourney",
        path: "sso-callback", // your app scheme (e.g., "lankajourney" for production)
      });
      console.log("Redirect URI:", redirectUrlX);

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

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || loading) return;

    if (!agree) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    setLoading(true);
    setError("");

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        username,
        firstName: firstname || undefined,
        lastName: lastname || undefined,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded || loading) return;

    setLoading(true);
    setError("");

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        // makeFavouriteCollection();
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setError("Verification could not be completed. Please try again.");
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      setError(
        err.errors?.[0]?.message || "An error occurred during verification",
      );
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={"padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <View className="flex-1 justify-center px-8">
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Verify Your Email
              </Text>
              <Text className="text-gray-500 text-center">
                We've sent a verification code to your email. Please enter it
                below.
              </Text>
            </View>

            {error ? (
              <View className="bg-red-100 p-3 rounded-lg mb-4">
                <Text className="text-red-700">{error}</Text>
              </View>
            ) : null}

            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 mb-2 font-medium">
                  Verification Code
                </Text>
                <TextInput
                  className="bg-gray-100 p-4 rounded-xl"
                  value={code}
                  placeholder="Enter the code from your email"
                  onChangeText={(code) => setCode(code)}
                  keyboardType="number-pad"
                />
              </View>

              <TouchableOpacity
                className={`bg-secondary py-4 rounded-xl items-center mt-4 ${loading ? "opacity-70" : ""}`}
                onPress={onVerifyPress}
                disabled={loading}
              >
                <Text className="text-white font-bold text-lg">
                  {loading ? "Verifying..." : "Verify Email"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          className="flex-1 bg-background"
          contentContainerStyle={{ minHeight: "100%", paddingTop: 40 }}
          // keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 justify-start bg-background">
            {/* Logo */}
            <View className="items-center mb-6">
              <Image
                source={images.logo}
                className="w-40 h-40 mb-2"
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-center text-gray-800">
              Create an account
            </Text>
            <Text className="text-sm text-center text-gray-500 mt-2 mb-6">
              Fill your information below or register with your social account
            </Text>

            {error ? (
              <View className="bg-red-100 p-3 rounded-lg mb-4">
                <Text className="text-red-700">{error}</Text>
              </View>
            ) : null}

            {/* firstname */}
            <TextInput
              placeholder="First Name"
              value={firstname}
              onChangeText={(fname) => setFirstname(fname)}
              keyboardType="default"
              autoCapitalize="none"
              className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-gray-800"
              placeholderTextColor="#999"
            />

            {/* lastname */}
            <TextInput
              placeholder="Last Name"
              value={lastname}
              onChangeText={(lname) => setLastname(lname)}
              keyboardType="default"
              autoCapitalize="none"
              className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-gray-800"
              placeholderTextColor="#999"
            />

            {/* username (required) */}
            <TextInput
              placeholder="Username (required)"
              value={username}
              onChangeText={(username) => setUsername(username)}
              keyboardType="default"
              autoCapitalize="none"
              className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-gray-800"
              placeholderTextColor="#999"
            />

            {/* Email */}
            <TextInput
              placeholder="Email"
              value={emailAddress}
              onChangeText={(email) => setEmailAddress(email)}
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-gray-800"
              placeholderTextColor="#999"
            />

            {/* Password */}
            <View className="border border-gray-300 rounded-md px-4 flex-row items-center justify-between mb-6">
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(password) => setPassword(password)}
                secureTextEntry={!showPassword}
                className="flex-1 text-gray-800"
                placeholderTextColor="#999"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#999"
                />
              </Pressable>
            </View>

            {/* Agree Checkbox */}
            <TouchableOpacity
              onPress={() => setAgree(!agree)}
              className="flex-row items-center mb-6"
            >
              <View
                className={`w-4 h-4 rounded-sm border border-gray-400 mr-2 ${
                  agree ? "bg-secondary" : "bg-background"
                }`}
              />
              <Text className="text-sm text-gray-600">
                Agree with{" "}
                <Text className="text-yellow-500 font-semibold">
                  Terms & Conditions
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={loading}
              className={`bg-secondary py-3 rounded-md mb-6 ${
                loading ? "opacity-70" : ""
              }`}
            >
              <Text className="text-center text-white font-semibold text-base">
                {loading ? "Creating Account..." : "Register"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="h-px bg-gray-300 flex-1" />
              <Text className="mx-3 text-gray-500 text-sm">Or</Text>
              <View className="h-px bg-gray-300 flex-1" />
            </View>

            {/* Social Sign Up */}
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
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
                <Text className="text-secondary font-bold text-sm">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

    // <SafeAreaView className="flex-1 bg-white">
    //   <KeyboardAvoidingView
    //     behavior={Platform.OS === "ios" ? "padding" : "height"}
    //     className="flex-1"
    //   >
    //     <View className="flex-1 justify-center px-8">
    //       <View className="items-center mb-8">
    //         <Text className="text-3xl font-bold text-primary mb-2">
    //           Create Account
    //         </Text>
    //         <Text className="text-gray-500 text-center">
    //           Sign up to start your journey
    //         </Text>
    //       </View>
    //
    //       {error ? (
    //         <View className="bg-red-100 p-3 rounded-lg mb-4">
    //           <Text className="text-red-700">{error}</Text>
    //         </View>
    //       ) : null}
    //
    //       <View className="space-y-4">
    //         <View>
    //           <Text className="text-gray-700 mb-2 font-medium">Email</Text>
    //           <TextInput
    //             className="bg-gray-100 p-4 rounded-xl"
    //             autoCapitalize="none"
    //             value={emailAddress}
    //             placeholder="Enter your email"
    //             onChangeText={(email) => setEmailAddress(email)}
    //             keyboardType="email-address"
    //           />
    //         </View>
    //
    //         <View>
    //           <Text className="text-gray-700 mb-2 font-medium">Password</Text>
    //           <TextInput
    //             className="bg-gray-100 p-4 rounded-xl"
    //             value={password}
    //             placeholder="Create a password"
    //             secureTextEntry={true}
    //             onChangeText={(password) => setPassword(password)}
    //           />
    //         </View>
    //
    //         <TouchableOpacity
    //           className={`bg-primary py-4 rounded-xl items-center mt-4 ${loading ? "opacity-70" : ""}`}
    //           onPress={onSignUpPress}
    //           disabled={loading}
    //         >
    //           <Text className="text-white font-bold text-lg">
    //             {loading ? "Creating Account..." : "Sign Up"}
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //
    //       <View className="flex-row justify-center mt-8">
    //         <Text className="text-gray-600">Already have an account? </Text>
    //         <Link href="/(auth)/sign-in" asChild>
    //           <TouchableOpacity>
    //             <Text className="text-primary font-semibold">Sign In</Text>
    //           </TouchableOpacity>
    //         </Link>
    //       </View>
    //     </View>
    //   </KeyboardAvoidingView>
    // </SafeAreaView>
  );
}
