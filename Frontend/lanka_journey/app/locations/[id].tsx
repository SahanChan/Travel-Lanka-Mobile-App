import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Define interfaces for the Google Places API response
interface DisplayName {
  text: string;
  languageCode?: string;
}

interface EditorialSummary {
  text: string;
  languageCode?: string;
}

interface Photo {
  name: string;
  widthPx?: number;
  heightPx?: number;
}

interface PlaceDetails {
  displayName?: DisplayName;
  shortFormattedAddress?: string;
  photos?: Photo[];
  rating?: number;
  editorialSummary?: EditorialSummary;
}

const LocationDetails = () => {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to fetch place details using the ID
  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // Check if API key exists
      if (!process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY) {
        throw new Error("Google Maps API key is missing");
      }

      const response = await axios.get(
        `https://places.googleapis.com/v1/places/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY,
            "X-Goog-FieldMask":
              "displayName,shortFormattedAddress,photos,rating,editorialSummary",
          },
        },
      );

      console.log(
        "Place Details Response:",
        JSON.stringify(response.data, null, 2),
      );
      setPlaceDetails(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load location details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get photo URL
  const getPhotoSource = (photo: Photo | undefined) => {
    if (!photo || !photo.name) {
      // Return a default image if no photo is available
      return images.ellaRock;
    }

    // Create a valid image source object for React Native
    return {
      uri: `https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY}&maxHeightPx=800&maxWidthPx=800`,
      headers: {
        "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY,
      },
    };
  };

  // Fetch place details when component mounts
  useEffect(() => {
    if (id) {
      fetchPlaceDetails();
    }
  }, [id]);

  return (
    <View className="flex-1 bg-background">
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-4 left-4 z-10 "
        style={{ marginTop: insets.top }}
      >
        <Ionicons name="chevron-back-outline" size={22} color="white" />
      </TouchableOpacity>

      {/* Fixed Header Image */}
      {loading ? (
        <View className="items-center justify-center py-10">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-xl text-gray-800 mt-4">
            Loading location details...
          </Text>
        </View>
      ) : error ? (
        <Text className="text-xl text-gray-800 text-center py-10">{error}</Text>
      ) : placeDetails ? (
        <View className="absolute top-0 left-0 right-0 h-72 z-0">
          {placeDetails?.photos && placeDetails?.photos.length > 0 && (
            <Image
              source={getPhotoSource(placeDetails?.photos[0])}
              className="w-full h-64  "
              resizeMode="cover"
            />
          )}
        </View>
      ) : null}

      {/* Scrollable Bottom Card */}
      <ScrollView
        className="flex-1 bg-white mt-56 rounded-t-3xl p-5 px-5"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between">
          <View className="">
            <Text className="text-2xl font-bold text-gray-900">
              {placeDetails?.displayName?.text || "Unknown Place"}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              📍{placeDetails?.shortFormattedAddress || "No address available"},
              Sri Lanka
            </Text>
          </View>
          <TouchableOpacity onPress={() => setLoading(false)}>
            <Ionicons name="bookmark-outline" size={22} color="#ffc600" />
          </TouchableOpacity>
        </View>

        <Text className="text-sm text-gray-700 mt-4 leading-relaxed">
          {placeDetails?.editorialSummary?.text || ""}
        </Text>
      </ScrollView>
    </View>

    //
    // <ScrollView className="bg-background flex-1 pt-12">
    //   <TouchableOpacity className="ml-4 mb-4" onPress={() => router.back()}>
    //     <Text className="text-primary font-semibold">← Back</Text>
    //   </TouchableOpacity>
    //
    //   <View className="px-4">
    //     {loading ? (
    //       <View className="items-center justify-center py-10">
    //         <ActivityIndicator size="large" color="#0000ff" />
    //         <Text className="text-xl text-gray-800 mt-4">
    //           Loading location details...
    //         </Text>
    //       </View>
    //     ) : error ? (
    //       <Text className="text-xl text-gray-800 text-center py-10">
    //         {error}
    //       </Text>
    //     ) : placeDetails ? (
    //       <>
    //         <Text className="text-2xl font-bold text-gray-800 mb-2">
    //           {placeDetails?.displayName?.text || "Unknown Place"}
    //         </Text>
    //         <Text className="text-gray-500 mb-4">
    //           📍 {placeDetails?.shortFormattedAddress || "No address available"}
    //         </Text>
    //         {placeDetails?.photos && placeDetails?.photos.length > 0 && (
    //           <Image
    //             source={getPhotoSource(placeDetails?.photos[0])}
    //             className="w-full h-64 rounded-xl mb-4"
    //             resizeMode="cover"
    //           />
    //         )}
    //         <Text className="text-gray-700 mb-4">
    //           This is the details page for{" "}
    //           {placeDetails?.displayName?.text || "this location"}. More
    //           information about this location will be added soon.
    //         </Text>
    //       </>
    //     ) : (
    //       <Text className="text-xl text-gray-800 text-center py-10">
    //         Location not found
    //       </Text>
    //     )}
    //   </View>
    // </ScrollView>
  );
};

export default LocationDetails;
