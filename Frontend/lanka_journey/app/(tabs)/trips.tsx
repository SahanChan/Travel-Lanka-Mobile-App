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

interface Trip {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  user_id: string;
  // Add other fields as needed
}

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

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

      setTrips(data || []);
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
      image={null} // Will be replaced with actual image from database later
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
