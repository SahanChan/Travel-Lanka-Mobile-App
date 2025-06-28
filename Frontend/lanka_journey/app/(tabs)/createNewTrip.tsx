import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser, useSession } from "@clerk/clerk-expo";
import { createClient } from "@supabase/supabase-js";
import { router } from "expo-router";

const CreateNewTrip = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tripName, setTripName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // Function to save trip to Supabase
  const saveTrip = async () => {
    // Validate inputs
    if (!tripName.trim()) {
      Alert.alert("Error", "Please enter a trip name");
      return;
    }

    if (!startDate) {
      Alert.alert("Error", "Please select a start date");
      return;
    }

    if (!endDate) {
      Alert.alert("Error", "Please select an end date");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to create a trip");
      return;
    }

    setIsLoading(true);

    try {
      // Insert trip into Supabase
      const { data, error } = await client
        .from("trips")
        .insert({
          user_id: user.id,
          name: tripName.trim(),
          start_date: startDate ? startDate.toISOString().split("T")[0] : "", // Format as YYYY-MM-DD
          end_date: endDate ? endDate.toISOString().split("T")[0] : "", // Format as YYYY-MM-DD
        })
        .select();

      if (error) {
        console.error("Error creating trip:", error);
        Alert.alert("Error", "Failed to create trip. Please try again.");
        return;
      }

      Alert.alert("Success", "Trip created successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/trips"),
        },
      ]);
    } catch (error) {
      console.error("Error in saveTrip:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    setEndDate(currentDate);
  };
  return (
    <View className="flex-1 bg-background px-5 pt-12">
      <Text className="text-xl text-black font-semibold text-center mb-5">
        Create New Trip
      </Text>

      <TouchableOpacity className="border border-dashed border-gray-300 rounded-lg  h-32 justify-center items-center mb-5">
        <Ionicons name="cloud-upload-outline" size={24} color="#999" />
        <Text className="text-xs text-gray-400 mt-2">
          Upload Trip Cover Image
        </Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Trip Name"
        placeholderTextColor="#999"
        className="border border-gray-200   rounded-lg p-3 text-base mb-4"
        value={tripName}
        onChangeText={setTripName}
      />

      <View className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 mb-4">
        <TextInput
          placeholder="Start Dates"
          placeholderTextColor="#999"
          className="flex-1 text-base "
          editable={false}
          value={formatDate(startDate)}
        />
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#999" />
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
      </View>

      <View className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 mb-4">
        <TextInput
          placeholder="End Dates"
          placeholderTextColor="#999"
          className="flex-1 text-base "
          editable={false}
          value={formatDate(endDate)}
        />
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#999" />
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}
      </View>

      <TouchableOpacity
        className="bg-secondary rounded-xl py-4 mt-2 items-center"
        onPress={saveTrip}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">Next</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
export default CreateNewTrip;
