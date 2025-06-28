import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useUser, useSession } from "@clerk/clerk-expo";
import { createClient } from "@supabase/supabase-js";
import CustomBottomSheet, {
  CustomBottomSheetRef,
} from "../../components/CustomBottomSheet";
import axios from "axios";
import { images } from "@/constants/images";
import SearchResults from "@/components/SearchResults";

// Define transport types
const transportTypes = [
  { id: "bus", name: "Bus", icon: "bus" },
  { id: "train", name: "Train", icon: "train" },
  { id: "tuktuk", name: "Tuk Tuk", icon: "car" },
  { id: "car", name: "Car", icon: "car" },
  { id: "motorcycle", name: "Motorcycle", icon: "bicycle" },
  { id: "uber", name: "Uber", icon: "car" },
  { id: "pickme", name: "PickMe", icon: "car" },
];

interface Trip {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  user_id: string;
}

interface DayData {
  day: number;
  date: Date;
  transport: string | null;
}

const TripDetails = () => {
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysData, setDaysData] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [collections, setCollections] = useState<any[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [showCollections, setShowCollections] = useState(false);

  const bottomSheetRef = useRef<CustomBottomSheetRef>(null);
  const attractionsBottomSheetRef = useRef<CustomBottomSheetRef>(null);

  // Get user and session from Clerk
  const { user } = useUser();
  const { session } = useSession();

  // Create Supabase client with Clerk authentication
  function createClerkSupabaseClient() {
    return createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL!,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
      {
        async accessToken() {
          return session?.getToken() ?? null;
        },
      },
    );
  }

  const client = createClerkSupabaseClient();

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days between two dates
  const getDaysBetweenDates = (
    startDate: string,
    endDate: string,
  ): DayData[] => {
    if (!startDate || !endDate) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Add one day to include the end date
    end.setDate(end.getDate() + 1);

    const days: DayData[] = [];
    let currentDate = new Date(start);
    let dayCount = 1;

    while (currentDate < end) {
      days.push({
        day: dayCount,
        date: new Date(currentDate),
        transport: null,
      });
      currentDate.setDate(currentDate.getDate() + 1);
      dayCount++;
    }

    return days;
  };

  // Load trip data
  const loadTripData = async () => {
    if (!user || !id) return;

    setLoading(true);
    try {
      // Fetch trip for the current user and id
      const { data, error } = await client
        .from("trips")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error loading trip:", error);
        return;
      }

      if (data) {
        setTrip(data);
        // Generate days data from start and end dates
        const days = getDaysBetweenDates(data.start_date, data.end_date);
        setDaysData(days);
      }
    } catch (error) {
      console.error("Error in loadTripData:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load trip data when component mounts
  useEffect(() => {
    if (user && id) {
      loadTripData();
    }
  }, [user, id]);

  // Search debounce effect
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

  // Handle transport selection
  const handleTransportSelect = (transportId: string) => {
    if (selectedDay !== null) {
      setDaysData((prevDays) =>
        prevDays.map((day) =>
          day.day === selectedDay ? { ...day, transport: transportId } : day,
        ),
      );
      bottomSheetRef.current?.close();
    }
  };

  // Open transport selection bottom sheet
  const openTransportSelection = (day: number) => {
    setSelectedDay(day);
    bottomSheetRef.current?.expand();
  };

  // Open attractions bottom sheet
  const openAttractionsSelection = (day: number) => {
    setSelectedDay(day);
    setSearchQuery("");
    setSearchResults([]);
    setShowCollections(false);
    loadCollections();
    attractionsBottomSheetRef.current?.expand();
  };

  // Function to search for places
  const fetchPlaces = async () => {
    // Check if search query is empty
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");

      // Check if API key exists
      if (!process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY) {
        throw new Error("Google Maps API key is missing");
      }

      const response = await axios.post(
        "https://places.googleapis.com/v1/places:searchText",
        {
          textQuery: searchQuery,
          locationRestriction: {
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

      // Check if places array exists in the response
      if (response.data && response.data.places) {
        setSearchResults(response.data.places);
      } else {
        console.warn("No places found in response:", response.data);
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setSearchError("Something went wrong. Try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Function to load collections from Supabase
  const loadCollections = async () => {
    if (!user) return;

    setCollectionsLoading(true);
    try {
      // Fetch collections with their locations
      const { data, error } = await client.from("collections").select(`
        *,
        collection_locations(*)
      `);

      if (error) {
        console.error("Error loading collections:", error);
        return;
      }

      // Process collections to add images
      const processedCollections = await Promise.all(
        data.map(async (collection) => {
          // If collection has locations
          if (
            collection.collection_locations &&
            collection.collection_locations.length > 0
          ) {
            const firstLocation = collection.collection_locations[0];

            // If location has a place_id, fetch image from Google API
            if (firstLocation.place_id) {
              const image = await fetchPlaceImage(firstLocation.place_id);
              if (image) {
                return { ...collection, image };
              }
            }
          }

          // Return collection with default image if no location or image found
          return { ...collection, image: images.ellaRock };
        }),
      );

      setCollections(processedCollections);
    } catch (error) {
      console.error("Error in loadCollections:", error);
    } finally {
      setCollectionsLoading(false);
    }
  };

  // Function to fetch image from Google Places API
  const fetchPlaceImage = async (placeId: string) => {
    try {
      // Check if API key exists
      if (!process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY) {
        throw new Error("Google Maps API key is missing");
      }

      const response = await axios.get(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY,
            "X-Goog-FieldMask": "photos",
          },
        },
      );

      if (response.data.photos && response.data.photos.length > 0) {
        const photoName = response.data.photos[0].name;
        return {
          uri: `https://places.googleapis.com/v1/${photoName}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY}&maxHeightPx=400&maxWidthPx=400`,
        };
      }
      return null;
    } catch (err) {
      console.error("Error fetching place image:", err);
      return null;
    }
  };

  // Function to add attraction to trip day
  const addAttractionToDay = (attraction: any) => {
    // Here you would add the attraction to the day's data
    // This would involve updating the daysData state and possibly saving to Supabase
    console.log(
      `Adding attraction ${attraction.displayName?.text || attraction.title} to day ${selectedDay}`,
    );

    // Close the bottom sheet after adding
    attractionsBottomSheetRef.current?.close();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-lg font-semibold text-center">
          Trip not found or you don't have access to it.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background pt-10 px-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold">{trip.name}</Text>
        <Text className="text-gray-500 mt-1">
          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
        </Text>
      </View>

      {daysData.map((dayItem, index) => (
        <View key={dayItem.day} className="flex-row mb-5">
          {/* Timeline Indicator */}
          <View className="items-center mr-3">
            <View className="w-6 h-6 rounded-full bg-gray-200 justify-center items-center">
              <Text className="text-gray-700 text-xs font-bold">
                {dayItem.day}
              </Text>
            </View>
            {index < daysData.length - 1 && (
              <View className="w-px flex-1 border-l border-dashed border-gray-300 mt-1" />
            )}
          </View>

          {/* Cards */}
          <View className="flex-1 space-y-4">
            {/* Day Date */}
            <Text className="text-sm text-gray-500">
              {dayItem.date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Text>

            {/* Add New Attractions */}
            <TouchableOpacity
              className="bg-white rounded-xl p-5 items-center justify-center shadow-sm"
              onPress={() => openAttractionsSelection(dayItem.day)}
            >
              <Ionicons name="add" size={32} color="#888" />
              <Text className="text-gray-500 mt-2 font-medium">
                Add New Attractions
              </Text>
            </TouchableOpacity>

            {/* Transport Method */}
            <TouchableOpacity
              className={`border ${dayItem.transport ? "border-solid border-gray-200" : "border-dashed border-gray-300"} p-4 rounded-xl items-center`}
              onPress={() => openTransportSelection(dayItem.day)}
            >
              {dayItem.transport ? (
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      (transportTypes.find((t) => t.id === dayItem.transport)
                        ?.icon as any) || "car"
                    }
                    size={20}
                    color="#555"
                  />
                  <Text className="text-gray-700 text-sm ml-2">
                    {transportTypes.find((t) => t.id === dayItem.transport)
                      ?.name || "Transport"}
                  </Text>
                </View>
              ) : (
                <Text className="text-gray-400 text-sm">
                  Tap Here To Choose Your Transport Method
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Transport Selection Bottom Sheet */}
      <CustomBottomSheet ref={bottomSheetRef} snapPoint="60%">
        <View>
          <Text className="text-lg font-bold mb-4">
            Select Transport Method
          </Text>
          <View className="space-y-3">
            {transportTypes.map((transport) => (
              <TouchableOpacity
                key={transport.id}
                className="flex-row items-center p-3 border-b border-gray-100"
                onPress={() => handleTransportSelect(transport.id)}
              >
                <Ionicons name={transport.icon as any} size={24} color="#555" />
                <Text className="ml-3 text-gray-800 font-medium">
                  {transport.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </CustomBottomSheet>

      {/* Attractions Bottom Sheet */}
      <CustomBottomSheet ref={attractionsBottomSheetRef} snapPoint="80%">
        <View className="flex-1">
          <Text className="text-lg font-bold mb-4">
            Add Attraction to Day {selectedDay}
          </Text>

          {/* Search and Toggle Buttons */}
          <View className="mb-4">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-3">
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                className="flex-1 ml-2 text-base"
                placeholder="Search for places..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={fetchPlaces}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row mb-2">
              <TouchableOpacity
                className={`flex-1 py-2 px-4 rounded-lg mr-2 ${!showCollections ? "bg-secondary" : "bg-gray-200"}`}
                onPress={() => setShowCollections(false)}
              >
                <Text
                  className={`text-center font-medium ${!showCollections ? "text-white" : "text-gray-700"}`}
                >
                  Search
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-2 px-4 rounded-lg ${showCollections ? "bg-secondary" : "bg-gray-200"}`}
                onPress={() => setShowCollections(true)}
              >
                <Text
                  className={`text-center font-medium ${showCollections ? "text-white" : "text-gray-700"}`}
                >
                  My Collections
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content Area */}
          <View className="flex-1">
            {/* Search Results */}
            {!showCollections && (
              <>
                {searchLoading ? (
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0066cc" />
                    <Text className="mt-2 text-gray-500">Searching...</Text>
                  </View>
                ) : searchError ? (
                  <View className="flex-1 justify-center items-center">
                    <Text className="text-red-500">{searchError}</Text>
                  </View>
                ) : searchResults.length > 0 ? (
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    renderItem={({ item }) => (
                      <View className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden border border-gray-100">
                        {item.photos && item.photos.length > 0 ? (
                          <Image
                            source={{
                              uri: `https://places.googleapis.com/v1/${item.photos[0].name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY}&maxHeightPx=400&maxWidthPx=400`,
                              headers: {
                                "X-Goog-Api-Key":
                                  process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY,
                              },
                            }}
                            className="w-full h-40"
                            resizeMode="cover"
                          />
                        ) : (
                          <Image
                            source={images.ellaRock}
                            className="w-full h-40"
                            resizeMode="cover"
                          />
                        )}
                        <View className="px-4 pt-3 pb-2">
                          <Text className="font-bold text-lg text-primary">
                            {(item.displayName as any)?.text || "Unknown Place"}
                          </Text>
                          <Text className="text-sm text-gray-500 mt-1 mb-1">
                            <Text className="text-muted">📍</Text>{" "}
                            {(item.shortFormattedAddress as any) ||
                              "No address available"}
                          </Text>
                        </View>
                        <TouchableOpacity
                          className="mx-4 mb-4 bg-secondary rounded-xl py-2.5 shadow-sm"
                          activeOpacity={0.7}
                          onPress={() => addAttractionToDay(item)}
                        >
                          <Text className="text-white text-center font-bold text-sm">
                            Add to Day {selectedDay}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                ) : searchQuery.trim() ? (
                  <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">No results found</Text>
                  </View>
                ) : (
                  <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">
                      Search for places to add to your trip
                    </Text>
                  </View>
                )}
              </>
            )}

            {/* Collections */}
            {showCollections && (
              <>
                {collectionsLoading ? (
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0066cc" />
                    <Text className="mt-2 text-gray-500">
                      Loading collections...
                    </Text>
                  </View>
                ) : collections.length > 0 ? (
                  <FlatList
                    data={collections}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
                        onPress={() => {
                          // Show locations in this collection
                          if (
                            item.collection_locations &&
                            item.collection_locations.length > 0
                          ) {
                            // Replace search results with collection locations
                            const locations = item.collection_locations.map(
                              (loc: any) => ({
                                id: loc.place_id,
                                displayName: { text: loc.title },
                                shortFormattedAddress:
                                  loc.address || "No address available",
                                // We would need to fetch photos for each location if needed
                              }),
                            );
                            setSearchResults(locations);
                            setShowCollections(false);
                          }
                        }}
                      >
                        <Image
                          source={item.image}
                          className="w-full h-40"
                          resizeMode="cover"
                        />
                        <View className="p-3">
                          <Text className="font-bold text-lg">{item.name}</Text>
                          <Text className="text-gray-500 text-sm">
                            {item.collection_locations?.length || 0} locations
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">No collections found</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </CustomBottomSheet>
    </ScrollView>
  );
};

export default TripDetails;
