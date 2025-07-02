import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link, LinkProps } from "expo-router";
import { images } from "@/constants/images";

interface TripCardProps {
  id: string;
  image: any;
  name: string;
  startDate: string;
  endDate: string;
}

const TripCard: React.FC<TripCardProps> = ({
  id,
  image,
  name,
  startDate,
  endDate,
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View className="bg-white rounded-2xl shadow-md mb-4 overflow-hidden border border-gray-100">
      <Link href={`/trips/${id}`} asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <Image
            source={image || images.ellaRock}
            className="w-full h-40"
            resizeMode="cover"
          />

          <View className="px-4 pt-3 pb-4">
            <Text className="font-bold text-lg text-black">{name}</Text>
            <Text className="text-sm text-gray-500 mt-1 mb-1">
              <Text className="text-muted">🗓️</Text> {formatDate(startDate)} -{" "}
              {formatDate(endDate)}
            </Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default TripCard;
