import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

interface TopPlacesCardProps {
  image: any;
  title: string;
  location: string;
}

const TopPlacesCard: React.FC<TopPlacesCardProps> = ({
  image,
  title,
  location,
}) => {
  return (
    <View className="bg-white rounded-2xl shadow-sm mr-4 w-56">
      {/* Image */}
      <Image
        source={image}
        className="w-full h-32 rounded-t-2xl"
        resizeMode="cover"
      />

      {/* Info Section */}
      <View className="p-3">
        <Text className="font-semibold text-base text-gray-800">{title}</Text>
        <Text className="text-xs text-gray-500 mt-1">📍 {location}</Text>

        <TouchableOpacity className="mt-3 bg-secondary rounded-xl py-2">
          <Text className="text-white text-center font-semibold text-sm">
            Add to trip
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default TopPlacesCard;
