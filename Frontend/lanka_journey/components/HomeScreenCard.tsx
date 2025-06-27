import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";

interface HomeScreenCardProps {
  id: string;
  image: any;
  title: string;
  location: string;
}

const HomeScreenCard: React.FC<HomeScreenCardProps> = ({
  id,
  image,
  title,
  location,
}) => {
  return (
    <View className="bg-white rounded-2xl shadow-sm mr-4 w-56 overflow-hidden">
      <Link href={`/locations/${id}`} asChild>
        {/* Wrap rest of the card (excluding button) in Touchable */}
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={image} className="w-full h-32" resizeMode="cover" />

          <View className="p-3">
            <Text className="font-semibold text-base text-gray-800">
              {title}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">📍 {location}</Text>
          </View>
        </TouchableOpacity>
      </Link>
      {/* "Add to trip" Button */}
      <TouchableOpacity
        className="mx-3 mb-3 bg-secondary rounded-xl py-2"
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-semibold text-sm">
          Add to trip
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default HomeScreenCard;
