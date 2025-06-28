import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";

interface SearchResultsCardProps {
  id: string;
  image: any;
  title: string;
  location: string;
}

const SearchResultsCard: React.FC<SearchResultsCardProps> = ({
  id,
  image,
  title,
  location,
}) => {
  return (
    <View className="bg-white rounded-2xl shadow-md mb-4 overflow-hidden border border-gray-100">
      <Link href={`/locations/${id}`} asChild>
        {/* Wrap rest of the card (excluding button) in Touchable */}
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={image} className="w-full h-40" resizeMode="cover" />

          <View className="px-4 pt-3 pb-2">
            <Text className="font-bold text-lg text-primary">{title}</Text>
            <Text className="text-sm text-gray-500 mt-1 mb-1">
              <Text className="text-muted">📍</Text> {location}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
      {/* "Add to trip" Button */}
      <TouchableOpacity
        className="mx-4 mb-4 bg-secondary rounded-xl py-2.5 shadow-sm"
        activeOpacity={0.7}
      >
        <Text className="text-white text-center font-bold text-sm">
          Add to trip
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default SearchResultsCard;
