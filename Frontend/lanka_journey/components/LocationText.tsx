import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

const LocationText = () => {
  const [locationText, setLocationText] = useState("Loading GPS...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Ask for permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        // Get current coordinates
        const loc = await Location.getCurrentPositionAsync({});

        // Reverse geocode to get city and country
        const geocode = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (geocode.length > 0) {
          const { city, region, country } = geocode[0];
          const formattedLocation = city
            ? `${city}, ${country}`
            : `${region}, ${country}`;
          setLocationText(formattedLocation);
        } else {
          setLocationText("");
        }
      } catch (err) {
        setErrorMsg("Error fetching location");
      }
    };

    fetchLocation();
  }, []);

  return (
    <View className="">
      {errorMsg ? (
        <Text className="">{errorMsg}</Text>
      ) : (
        <Text className="text-black text-xs"> 📍{locationText}</Text>
      )}
    </View>
    // <Text className=""> Moratuwa, Sri Lanka</Text>
  );
};
export default LocationText;
