import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";

interface HomeScreenCardProps {
  id: string;
  image?: any;
  title: string;
  location?: string;
}

const HomeScreenCard: React.FC<HomeScreenCardProps> = ({
  id,
  image,
  title,
  location,
}) => {
  return (
    <View className="bg-white rounded-2xl shadow-sm mr-4 w-56 h-64 overflow-hidden">
      <Link href={`/locations/${id}`} asChild>
        <TouchableOpacity activeOpacity={0.8} className="flex-1">
          <Image
            source={image || require("@/assets/images/logo.png")}
            className="w-full h-32"
            resizeMode="cover"
          />

          <View className="p-3 flex-grow">
            <Text
              className="font-semibold text-base text-gray-800"
              numberOfLines={1}
              ellipsizeMode="clip"
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-500 mt-1"
              numberOfLines={2} // Limit to 2 lines for consistent height
              ellipsizeMode="tail"
            >
              📍 {location || "Location not available"}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>

      {/* Add to trip button always at the bottom */}
      <View className="px-3 pb-3">
        <TouchableOpacity
          className="bg-secondary rounded-xl py-2"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-semibold text-sm">
            Add to trip
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default HomeScreenCard;
