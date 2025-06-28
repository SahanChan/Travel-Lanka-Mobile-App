import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ReviewItem from "@/components/ReviewItem";

// Define interfaces for the Google Places API response
interface DisplayName {
  text: string;
  languageCode?: string;
}

interface PrimaryTypeDisplayName {
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

interface Review {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: {
    text?: string;
    languageCode?: string;
  };
  originalText?: {
    text?: string;
    languageCode?: string;
  };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
  publishTime?: string; // ISO 8601 string (optional in case parsing fails)
  flagContentUri?: string;
  googleMapsUri?: string;
}

interface PlaceDetails {
  displayName?: DisplayName;
  shortFormattedAddress?: string;
  photos?: Photo[];
  rating?: number;
  editorialSummary?: EditorialSummary;
  primaryTypeDisplayName?: PrimaryTypeDisplayName;
  reviews?: Review[];
  userRatingCount?: number;
}

const LocationDetails = () => {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get("window");

  const router = useRouter();
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAll, setShowAll] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
              "displayName,shortFormattedAddress,photos,rating,editorialSummary,primaryTypeDisplayName,userRatingCount,reviews",
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

  // Initialize fade animation when component mounts
  useEffect(() => {
    // Set initial value to 1 to make fade overlays visible
    fadeAnim.setValue(1);
  }, []);

  // Animate fade effect when showAll changes (only affects bottom overlay)
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showAll ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showAll, fadeAnim]);

  return (
    <View className="flex-1 bg-background">
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute  left-4 z-10 "
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

      {/* Bottom Card with FlatList for all content */}
      <View className="flex-1 bg-white mt-56 rounded-t-3xl">
        {placeDetails?.reviews && placeDetails?.reviews.length > 0 ? (
          <FlatList
            data={
              showAll ? placeDetails.reviews : placeDetails.reviews.slice(0, 2)
            }
            keyExtractor={(item, index) => `review-${index}`}
            renderItem={({ item }) => <ReviewItem review={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
            ListHeaderComponent={() => (
              <>
                <View className="flex-row justify-between ">
                  <View className="">
                    <View className="flex-row gap-6 items-center">
                      <Text
                        className="text-2xl font-bold text-gray-900"
                        numberOfLines={1}
                        ellipsizeMode="clip"
                        style={{ maxWidth: "75%" }}
                      >
                        {placeDetails?.displayName?.text || "Unknown Place"}
                      </Text>
                      {placeDetails?.rating ? (
                        <View className="flex-row gap-1 items-center ">
                          <Text className="text-xl font-semibold text-muted">
                            {placeDetails?.rating || ""}
                          </Text>
                          <Ionicons name="star" size={18} color="#ffc600" />
                          <Text className="text-sm font-semibold text-muted">
                            ({placeDetails?.userRatingCount || ""})
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    {placeDetails?.shortFormattedAddress ? (
                      <Text className="text-sm text-gray-500 mt-1">
                        📍{placeDetails?.shortFormattedAddress}, Sri Lanka
                      </Text>
                    ) : null}

                    {placeDetails?.primaryTypeDisplayName?.text ? (
                      <Text className="text-sm text-gray-500 mt-1">
                        {placeDetails?.primaryTypeDisplayName?.text || ""}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    className="pr-4"
                    onPress={() => setLoading(false)}
                  >
                    <Ionicons
                      name="bookmark-outline"
                      size={22}
                      color="#ffc600"
                    />
                  </TouchableOpacity>
                </View>

                {placeDetails?.editorialSummary?.text ? (
                  <Text className="text-sm text-gray-700 mt-4 leading-relaxed">
                    {placeDetails?.editorialSummary?.text}
                  </Text>
                ) : null}

                <View className="mt-6">
                  {/* Heading */}
                  <Text className="text-lg font-bold text-gray-900 mb-4">
                    Reviews ({placeDetails?.reviews?.length || 0})
                  </Text>
                </View>
              </>
            )}
            ListFooterComponent={() => (
              <>
                {placeDetails?.reviews && placeDetails.reviews.length > 2 && (
                  <TouchableOpacity
                    onPress={() => setShowAll(!showAll)}
                    className="mt-1 mb-20"
                  >
                    <Text className="text-center text-yellow-500 font-semibold">
                      {showAll ? "See Less" : "See More"}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          />
        ) : (
          <ScrollView
            className="p-5 px-5"
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row justify-between">
              <View className="">
                <View className="flex-row gap-6 items-center">
                  <Text
                    className="text-2xl font-bold text-gray-900"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ maxWidth: "20%" }}
                  >
                    {placeDetails?.displayName?.text || "Unknown Place"}
                  </Text>
                  {placeDetails?.rating ? (
                    <View className="flex-row gap-1 items-center ">
                      <Text className="text-xl font-semibold text-muted">
                        {placeDetails?.rating || ""}
                      </Text>
                      <Ionicons name="star" size={18} color="#ffc600" />
                      <Text className="text-sm font-semibold text-muted">
                        ({placeDetails?.userRatingCount || ""})
                      </Text>
                    </View>
                  ) : null}
                </View>

                {placeDetails?.shortFormattedAddress ? (
                  <Text className="text-sm text-gray-500 mt-1">
                    📍{placeDetails?.shortFormattedAddress}, Sri Lanka
                  </Text>
                ) : null}

                {placeDetails?.primaryTypeDisplayName?.text ? (
                  <Text className="text-sm text-gray-500 mt-1">
                    {placeDetails?.primaryTypeDisplayName?.text || ""}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                className="pr-4"
                onPress={() => setLoading(false)}
              >
                <Ionicons name="bookmark-outline" size={22} color="#ffc600" />
              </TouchableOpacity>
            </View>

            {placeDetails?.editorialSummary?.text ? (
              <Text className="text-sm text-gray-700 mt-4 leading-relaxed">
                {placeDetails?.editorialSummary?.text}
              </Text>
            ) : null}
          </ScrollView>
        )}
      </View>
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
