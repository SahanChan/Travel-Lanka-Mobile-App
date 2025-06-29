import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { legalLinks, settingsOptions } from "@/constants";
import { SignOutButton } from "@/components/SignOutButton";
import LocationText from "@/components/LocationText";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleSettingsPress = (label: string) => {
    switch (label) {
      case "Notifications":
        router.push("/notifications");
        break;
      case "Language":
        router.push("/language");
        break;
      case "Currency":
        router.push("/currency");
        break;
      case "Reset Onboarding":
        handleResetOnboarding();
        break;
      default:
        break;
    }
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reset Onboarding",
      "This will clear your onboarding progress and show the welcome screens again when you restart the app. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("hasSeenOnboarding");
              Alert.alert(
                "Success",
                "Onboarding has been reset! Please restart the app to see the onboarding screens again.",
                [{ text: "OK" }]
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to reset onboarding. Please try again.",
                [{ text: "OK" }]
              );
              console.error("Error resetting onboarding:", error);
            }
          },
        },
      ]
    );
  };

  const handleLegalPress = (item: string) => {
    switch (item) {
      case "Privacy Policy":
        router.push("/privacy-policy");
        break;
      case "Terms and conditions":
        router.push("/terms-conditions");
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-4 pb-2">
          <Text className="text-xl font-bold text-gray-800 text-center">
            Profile
          </Text>
        </View>
        <TouchableOpacity className="bg-yellow-400 mx-6 rounded-xl p-4 flex-row items-center justify-between">
          <View className="flex-row justify-between mx-2 my-4 items-center">
            <View className=" flex-row items-center space-x-3 ">
              <Image
                source={{ uri: user?.imageUrl }}
                className="w-12 h-12 rounded-full"
              />
              <View className="ml-2">
                <Text className="text-black font-bold text-sm">
                  {user?.firstName ||
                    user?.username ||
                    user?.emailAddresses[0].emailAddress}
                </Text>
                <LocationText />
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push("/edit-profile")}>
            <Ionicons name="chevron-forward-outline" size={24} />
          </TouchableOpacity>
        </TouchableOpacity>
        <View className="mt-6 mx-6 rounded-xl bg-white border border-gray-200">
          {settingsOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSettingsPress(item.label)}
              className="flex-row justify-between items-center px-4 py-6 border-b border-gray-200"
            >
              <View className="flex-row items-center gap-5">
                {item.icon}
                <Text className="text-gray-800 text-sm">{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-6 mx-6 rounded-xl bg-white border border-gray-200">
          {legalLinks.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleLegalPress(item)}
              className="flex-row justify-between items-center px-4 py-6 border-b border-gray-200"
            >
              <View className="flex-row items-center gap-5">
                <Text className="text-gray-800 text-sm">{item}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
        <SignOutButton />
      </ScrollView>
    </SafeAreaView>
  );
};
export default Profile;
