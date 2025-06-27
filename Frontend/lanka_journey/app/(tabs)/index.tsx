import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { icons } from "@/constants/icons";
import HomeScreenCard from "@/components/HomeScreenCard";
import { images } from "@/constants/images";
import {
  categories,
  topActivities,
  topHotels,
  topPlaces,
  topRestaurants,
} from "@/constants";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/SignOutButton";
import { Link } from "expo-router";
import SearchResults from "@/components/SearchResults";
import axios from "axios";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useUser();

  const fetchPlaces = async () => {
    // Check if search query is empty
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Check if API key exists
      if (!process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY) {
        throw new Error("Google Maps API key is missing");
      }

      const response = await axios.post(
        "https://places.googleapis.com/v1/places:searchText",
        {
          textQuery: searchQuery,
          locationBias: {
            rectangle: {
              low: {
                latitude: 5.918, // Southernmost point
                longitude: 79.791, // Westernmost point
              },
              high: {
                latitude: 9.834, // Northernmost point
                longitude: 81.881, // Easternmost point
              },
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY,
            "X-Goog-FieldMask":
              "places.displayName,places.shortFormattedAddress,places.id,places.photos",
          },
        },
      );

      console.log("API Response:", JSON.stringify(response.data, null, 2));

      // Check if places array exists in the response
      if (response.data && response.data.places) {
        setSearchResults(response.data.places);
      } else {
        console.warn("No places found in response:", response.data);
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Fetch errork:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchPlaces();
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchPress={fetchPlaces}
      />

      <ScrollView
        className="flex-1 "
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 150 }}
      >
        {loading ? (
          <ActivityIndicator size="large" className="mt-10" />
        ) : searchResults.length > 0 ? (
          <SearchResults results={searchResults} />
        ) : (
          <>
            <View className="flex flex-col">
              <View className="px-5 mt-6">
                <Text className="text-xl font-bold text-gray-800 mb-4">
                  Categories
                </Text>
                <View className="flex-row justify-between">
                  {categories.map((cat, index) => (
                    <TouchableOpacity
                      key={index}
                      className="items-center justify-center bg-secondary-100 w-24 h-24 rounded-xl shadow-sm"
                      activeOpacity={0.8}
                    >
                      <Image
                        source={cat.icon}
                        className="w-10 h-10 mb-1"
                        resizeMode="contain"
                      />
                      <Text className="text-xs text-gray-600 text-center">
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View className=" mt-6">
                <View className="flex-row justify-between items-center px-5">
                  <Text className="text-xl font-bold text-gray-800 mb-4">
                    Top Places
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-sm font-semibold text-muted mb-4">
                      See more
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <FlatList
                    data={topPlaces}
                    horizontal
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingLeft: 20, // space before the first card
                      paddingRight: 10, // optional: spacing at the end
                    }}
                    renderItem={({ item }) => (
                      <HomeScreenCard
                        {...item}
                        image={item.image}
                        title={item.title}
                        location={item.location}
                      />
                    )}
                  />
                </View>
              </View>
              <View className=" mt-6">
                <View className="flex-row justify-between items-center px-5">
                  <Text className="text-xl font-bold text-gray-800 mb-4">
                    Top Hotels
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-sm font-semibold text-muted mb-4">
                      See more
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <FlatList
                    data={topHotels}
                    horizontal
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingLeft: 20, // space before the first card
                      paddingRight: 10, // optional: spacing at the end
                    }}
                    renderItem={({ item }) => (
                      <HomeScreenCard
                        {...item}
                        image={item.image}
                        title={item.title}
                        location={item.location}
                      />
                    )}
                  />
                </View>
              </View>
              <View className=" mt-6">
                <View className="flex-row justify-between items-center px-5">
                  <Text className="text-xl font-bold text-gray-800 mb-4">
                    Top Activities
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-sm font-semibold text-muted mb-4">
                      See more
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <FlatList
                    data={topActivities}
                    horizontal
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingLeft: 20, // space before the first card
                      paddingRight: 10, // optional: spacing at the end
                    }}
                    renderItem={({ item }) => (
                      <HomeScreenCard
                        {...item}
                        image={item.image}
                        title={item.title}
                        location={item.location}
                      />
                    )}
                  />
                </View>
              </View>
              <View className=" mt-6">
                <View className="flex-row justify-between items-center px-5">
                  <Text className="text-xl font-bold text-gray-800 mb-4">
                    Top Restaurants
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-sm font-semibold text-muted mb-4">
                      See more
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <FlatList
                    data={topRestaurants}
                    horizontal
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingLeft: 20, // space before the first card
                      paddingRight: 10, // optional: spacing at the end
                    }}
                    renderItem={({ item }) => (
                      <HomeScreenCard
                        {...item}
                        image={item.image}
                        title={item.title}
                        location={item.location}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}
