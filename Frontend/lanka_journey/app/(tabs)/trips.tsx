import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Image
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useUser, useSession } from "@clerk/clerk-expo";
import { createClient } from "@supabase/supabase-js";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import TripCard from "../../components/TripCard";
import axios from "axios";
import { images } from "@/constants/images";

interface Trip {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  user_id: string;
  image?: any;
  // Add other fields as needed
}

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Function to load trips from Supabase
  const loadTrips = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch trips for the current user
      const { data, error } = await client
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Error loading trips:", error);
        return;
      }

      if (data && data.length > 0) {
        // Process each trip to get its first location image
        const tripsWithImages = await Promise.all(
          data.map(async (trip) => {
            try {
              // Fetch trip_locations for this trip
              const { data: locationsData, error: locationsError } = await client
                .from("trip_locations")
                .select("*")
                .eq("trip_id", trip.id);

              if (locationsError) {
                console.error("Error loading trip locations:", locationsError);
                return trip;
              }

              // If there are locations, get the first one's image
              if (locationsData && locationsData.length > 0) {
                const firstLocation = locationsData[0];

                if (firstLocation.place_id) {
                  const locationImage = await fetchPlaceImage(firstLocation.place_id);
                  if (locationImage) {
                    return { ...trip, image: locationImage };
                  }
                }
              }

              return trip;
            } catch (err) {
              console.error("Error processing trip image:", err);
              return trip;
            }
          })
        );

        setTrips(tripsWithImages);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error("Error in loadTrips:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load trips when the component mounts and when the user changes
  useEffect(() => {
    if (user) {
      loadTrips();
    }
  }, [user]);

  // Reload trips when the tab is focused
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadTrips();
      }
    }, [user])
  );

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

  // Render each trip item
  const renderTripItem = ({ item }: { item: Trip }) => (
    <TripCard
      id={item.id.toString()}
      name={item.name}
      startDate={item.start_date}
      endDate={item.end_date}
      image={item.image} // Using the image fetched from Google Places API
    />
  );

  return (
    <View className="flex-1 bg-white p-4 pt-14">
      <Text className="text-2xl font-bold mb-4">My Trips</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" className="flex-1 justify-center items-center" />
      ) : trips.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-semibold mb-2">You don't have any trips yet</Text>
          <Text className="text-sm text-gray-500">Create a trip to get started</Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          renderItem={renderTripItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <TouchableOpacity 
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary justify-center items-center shadow-lg"
        onPress={() => router.push("/(tabs)/createNewTrip")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Trips;
