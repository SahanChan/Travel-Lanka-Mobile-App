import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Notifications = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            Notifications
          </Text>
          <View className="w-8" />
        </View>

        {/* Content */}
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons 
            name="notifications-off-outline" 
            size={80} 
            color="#9CA3AF" 
            className="mb-4"
          />
          <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">
            No Notifications
          </Text>
          <Text className="text-gray-600 text-center leading-6">
            You don't have any notifications at the moment. We'll notify you when there's something new!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Notifications;