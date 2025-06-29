import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { images } from "@/constants/images";
import { useSession, useUser } from "@clerk/clerk-expo";
import { createClient } from "@supabase/supabase-js";
import CustomBottomSheet, {
  CustomBottomSheetRef,
} from "@/components/CustomBottomSheet";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

const Saved = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<any>(null);

  // Bottom sheet references
  const bottomSheetRef = useRef<CustomBottomSheetRef>(null);
  const locationsBottomSheetRef = useRef<CustomBottomSheetRef>(null);

  // Snap points for the bottom sheets (percentage of screen height)
  const snapPoint = "30%";
  const locationsSnapPoint = "50%";

  // Get screen width for 2-column layout
  const screenWidth = Dimensions.get("window").width;

  // The `useUser()` hook is used to ensure that Clerk has loaded data about the signed in user
  const { user } = useUser();
  // The `useSession()` hook is used to get the Clerk session object
  // The session object is used to get the Clerk session token
  const { session } = useSession();

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

  // Function to load collections from Supabase
  const loadCollections = async () => {
    if (!user) return;

    setLoading(true);
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

      // Check if there are no collections and create a default "favourites" collection
      if (data.length === 0) {
        const { data: newCollection, error: createError } = await client
          .from("collections")
          .insert({
            name: "Favourites",
            // user_id comes from Clerk auth context automatically
          })
          .select();

        if (createError) {
          console.error("Error creating default collection:", createError);
        } else {
          console.log(
            "Default 'Favourites' collection created successfully:",
            newCollection,
          );
          // Add the new collection to data array
          data.push({ ...newCollection[0], collection_locations: [] });
        }
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadCollections();
  }, [user]);

  // Reload collections when the tab is focused
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadCollections();
      }
    }, [user]),
  );

  const handleNewCollection = () => {
    // Reset the name field
    setName("");
    // Open the bottom sheet
    bottomSheetRef.current?.expand();
  };

  const createNewCollection = async () => {
    if (!name.trim()) {
      // Don't create collection if name is empty
      return;
    }

    const { data, error } = await client
      .from("collections")
      .insert({
        name: name.trim(),
        // user_id comes from Clerk auth context automatically
      })
      .select();

    if (error) {
      console.error("Error creating collection:", error);
    } else {
      console.log("Collection created successfully:", data);
      // Reload collections
      loadCollections();
      // Close the bottom sheet
      bottomSheetRef.current?.close();
    }
  };

  return (
    <View className="flex-1 bg-background px-4 pt-14">
      {/* Bottom Sheet for creating new collection */}
      <CustomBottomSheet ref={bottomSheetRef} snapPoint={snapPoint}>
        <View className="flex-1">
          <Text className="text-xl font-bold mb-4">Create New Collection</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md mb-4"
            placeholder="Collection Name"
            value={name}
            onChangeText={setName}
            autoFocus
          />
          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={() => bottomSheetRef.current?.close()}
              className="mr-4 py-2 px-4"
            >
              <Text className="text-gray-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={createNewCollection}
              className="bg-secondary py-2 px-4 rounded-lg"
            >
              <Text className="text-white font-semibold">Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomBottomSheet>

      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold">Collections</Text>
        <TouchableOpacity
          onPress={handleNewCollection}
          className="bg-secondary px-3 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">+ New Collection</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-2">Loading collections...</Text>
        </View>
      )}

      {/* Collections FlatList */}
      {!loading && (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden"
              style={{ width: (screenWidth - 40) / 2 }} // 40px for padding and gap
              onPress={() => {
                setSelectedCollection(item);
                locationsBottomSheetRef.current?.expand();
              }}
            >
              {/* Collection Image */}
              <Image
                source={item.image}
                className="w-full h-40 rounded-t-lg"
                resizeMode="cover"
              />

              {/* Collection Details */}
              <View className="flex-row p-3 items-center justify-between">
                <Text className="text-md font-bold ">{item.name}</Text>

                {/* Location Count */}
                <Text className="text-xs text-gray-500">
                  {item.collection_locations?.length || 0} items
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Locations Bottom Sheet */}
      <CustomBottomSheet
        ref={locationsBottomSheetRef}
        snapPoint={locationsSnapPoint}
      >
        <View className="flex-1">
          <Text className="text-xl font-bold mb-4">
            {selectedCollection?.name} Locations
          </Text>

          {selectedCollection?.collection_locations &&
          selectedCollection.collection_locations.length > 0 ? (
            <FlatList
              data={selectedCollection.collection_locations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View className="py-3 border-b border-gray-200">
                  <Text className="text-base">{item.title}</Text>
                </View>
              )}
            />
          ) : (
            <Text className="text-gray-500">
              No locations in this collection
            </Text>
          )}
        </View>
      </CustomBottomSheet>
    </View>
  );
};
export default Saved;
