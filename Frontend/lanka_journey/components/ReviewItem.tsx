import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const ReviewItem: React.FC<ReviewProps> = ({ review }) => {
  // State to track if the review text is expanded
  const [isExpanded, setIsExpanded] = useState(false);
  // State to track if the text is truncated (more than 3 lines)
  const [isTruncated, setIsTruncated] = useState(false);

  // Generate stars based on rating
  const renderStars = () => {
    if (!review.rating) return null;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= review.rating ? "star" : "star-outline"}
          size={14}
          color="#ffc600"
        />,
      );
    }
    return <View className="flex-row gap-1">{stars}</View>;
  };

  return (
    <View className="mb-4 p-3 bg-gray-50 rounded-lg">
      <View className="flex-row items-center mb-2">
        {review.authorAttribution?.photoUri ? (
          <Image
            source={{ uri: review.authorAttribution.photoUri }}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-gray-300 mr-3 items-center justify-center">
            <Text className="text-gray-600 font-bold">
              {review.authorAttribution?.displayName?.charAt(0) || "?"}
            </Text>
          </View>
        )}

        <View className="flex-1 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="font-semibold text-gray-800">
              {review.authorAttribution?.displayName || "Anonymous"}
            </Text>
            {renderStars()}
          </View>

          <Text className="text-xs text-gray-500">
            {review.relativePublishTimeDescription || ""}
          </Text>
        </View>
      </View>

      <View className="mt-2">
        <Text
          className="text-gray-700 text-sm"
          numberOfLines={isExpanded ? undefined : 3}
          onTextLayout={(e) => {
            const { lines } = e.nativeEvent;
            setIsTruncated(lines.length > 3);
          }}
        >
          {review.text?.text ||
            review.originalText?.text ||
            "No review text available"}
        </Text>
        {(isTruncated || isExpanded) && (
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            <Text className="text-blue-500 mt-1">
              {isExpanded ? "See less" : "See more"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ReviewItem;
