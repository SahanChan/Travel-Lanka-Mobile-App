import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import LocationText from "@/components/LocationText";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  onSearchPress: () => void;
}

const Header = ({
  searchQuery,
  setSearchQuery,
  onSearchPress,
}: HeaderProps) => {
  const insets = useSafeAreaInsets();

  const { user } = useUser();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <View
      className="bg-secondary px-5 pb-4 rounded-b-2xl "
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row justify-between items-center">
        <View className=" flex-row items-center space-x-3 ">
          <Image
            source={{ uri: user?.imageUrl }}
            className="w-12 h-12 rounded-full"
          />
          <View className="ml-2">
            <Text className="text-black font-bold text-sm">
              Welcome,{" "}
              {user?.firstName ||
                user?.username ||
                user?.emailAddresses[0].emailAddress}
            </Text>
            <LocationText />
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} />
        </TouchableOpacity>
      </View>
      <View className="my-5">
        <SearchBar
          placeholder="Search Sri Lanka"
          value={searchQuery}
          onPress={onSearchPress}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );
};
export default Header;
