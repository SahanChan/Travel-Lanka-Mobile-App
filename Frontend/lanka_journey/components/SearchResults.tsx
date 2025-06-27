import { View, Text } from "react-native";
import React from "react";
import HomeScreenCard from "@/components/HomeScreenCard";
import { images } from "@/constants/images";

interface SearchResultsProps {
  results: any[];
}

const SearchResults = ({ results }: SearchResultsProps) => {
  // Function to convert photo reference to a valid image source
  const getPhotoSource = (photo) => {
    if (!photo || !photo.name) {
      // Return a default image if no photo is available
      return images.ellaRock;
    }

    // Extract the photo reference from the photo object
    const photoReference = photo.name.split("/").pop();

    // Create a valid image source object for React Native
    return {
      uri: `https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY}&maxHeightPx=400&maxWidthPx=400`,
      headers: {
        "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY,
      },
    };
  };

  return (
    <View className="p-5">
      <Text className="text-lg font-bold text-gray-800 mb-3">
        Search Results
      </Text>
      {results && results.length > 0 ? (
        results.map((result, index) => (
          <HomeScreenCard
            key={index}
            image={
              result.photos && result.photos.length > 0
                ? getPhotoSource(result.photos[0])
                : images.ellaRock
            }
            title={result.displayName?.text || "Unknown Place"}
            location={result.shortFormattedAddress || "No address available"}
            id={result.id || ""}
          />
        ))
      ) : (
        <Text>No results found</Text>
      )}
    </View>
  );
};
export default SearchResults;
