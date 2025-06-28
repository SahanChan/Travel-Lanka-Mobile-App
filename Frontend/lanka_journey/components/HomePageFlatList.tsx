import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import HomeScreenCard from "@/components/HomeScreenCard";
import axios from "axios";
import { images } from "@/constants/images";

interface HomePageFlatListProps {
  name?: string;
  data?: Array<{
    id: string;
    image?: any;
    title: string;
    location?: string;
  }>;
}

interface PlaceData {
  id: string;
  image?: any;
  title: string;
  location?: string;
}

interface Photo {
  name: string;
  widthPx?: number;
  heightPx?: number;
}

const HomePageFlatList = ({ name, data }: HomePageFlatListProps) => {
  // Function to convert photo reference to a valid image source
  const getPhotoSource = (photo: Photo | undefined) => {
    if (!photo || !photo.name) {
      // Return a default image if no photo is available
      return null;
    }

    // Create a valid image source object for React Native
    return {
      uri: `https://places.googleapis.com/v1/${photo.name}/media?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY}&maxHeightPx=400&maxWidthPx=400`,
      headers: {
        "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY,
      },
    };
  };
  const [placesWithGoogleData, setPlacesWithGoogleData] = useState<PlaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGoogleData = async () => {
      if (!data || data.length === 0) {
        setPlacesWithGoogleData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Check if API key exists
        if (!process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY) {
          throw new Error("Google Maps API key is missing");
        }

        const updatedPlaces = await Promise.all(
          data.map(async (place) => {
            try {
              const response = await axios.post(
                "https://places.googleapis.com/v1/places:searchText",
                {
                  textQuery: place.title,
                  locationRestriction: {
                    rectangle: {
                      low: {
                        latitude: 5.918, // Southernmost point of Sri Lanka
                        longitude: 79.791, // Westernmost point of Sri Lanka
                      },
                      high: {
                        latitude: 9.834, // Northernmost point of Sri Lanka
                        longitude: 81.881, // Easternmost point of Sri Lanka
                      },
                    },
                  },
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_SDK_KEY,
                    "X-Goog-FieldMask":
                      "places.id,places.displayName,places.shortFormattedAddress,places.photos",
                  },
                }
              );

              if (response.data && response.data.places && response.data.places.length > 0) {
                const googlePlace = response.data.places[0];
                const photoSource = googlePlace.photos && googlePlace.photos.length > 0 
                  ? getPhotoSource(googlePlace.photos[0]) 
                  : null;

                // Log the Google Place ID for debugging
                console.log(`Google Place ID for ${place.title}:`, googlePlace.id);

                return {
                  id: googlePlace.id || place.id,
                  image: photoSource || place.image,
                  title: place.title,
                  location: googlePlace.shortFormattedAddress || place.location,
                };
              }
              return place;
            } catch (err) {
              console.error(`Error fetching data for ${place.title}:`, err);
              return place;
            }
          })
        );

        setPlacesWithGoogleData(updatedPlaces);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Something went wrong. Try again.");
        setPlacesWithGoogleData(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleData();
  }, [data]);

  return (
    <View className=" mt-6">
      <View className="flex-row justify-between items-center px-5">
        <Text className="text-xl font-bold text-gray-800 mb-4">{name}</Text>
        <TouchableOpacity>
          <Text className="text-sm font-semibold text-muted mb-4">
            See more
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {loading ? (
          <View className="flex items-center justify-center h-32">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : error ? (
          <Text className="text-red-500 text-center">{error}</Text>
        ) : (
          <FlatList
            data={placesWithGoogleData}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: 20, // space before the first card
              paddingRight: 10, // optional: spacing at the end
            }}
            renderItem={({ item }) => (
              <HomeScreenCard
                id={item.id}
                image={item.image}
                title={item.title}
                location={item.location}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};
export default HomePageFlatList;
