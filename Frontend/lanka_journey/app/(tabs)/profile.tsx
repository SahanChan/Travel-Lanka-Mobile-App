import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React from "react";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { legalLinks, settingsOptions } from "@/constants";
import { SignOutButton } from "@/components/SignOutButton";

const Profile = () => {
  const { user } = useUser();
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
                source={images.profileImage}
                className="w-12 h-12 rounded-full"
              />
              <View className="ml-2">
                <Text className="text-black font-bold text-sm">
                  {user?.firstName ||
                    user?.username ||
                    user?.emailAddresses[0].emailAddress}
                </Text>
                <Text className="text-black text-xs">
                  📍 Moratuwa, Sri Lanka
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="chevron-forward-outline" size={24} />
          </TouchableOpacity>
        </TouchableOpacity>
        <View className="mt-6 mx-6 rounded-xl bg-white border border-gray-200">
          {settingsOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
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
