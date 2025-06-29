import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const EditProfile = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">
          Edit Profile
        </Text>
        <View className="w-8" />
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-yellow-50 rounded-xl border border-yellow-200 p-6 w-full max-w-sm">
          <View className="items-center mb-4">
            <Ionicons name="construct-outline" size={64} color="#F59E0B" />
          </View>
          <Text className="text-yellow-800 font-bold text-xl text-center mb-2">
            Under Construction
          </Text>
          <Text className="text-yellow-700 text-center leading-6">
            This feature is still under development. We're working hard to bring you the best profile editing experience!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;