import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import { useUser } from "@clerk/clerk-expo";

const Header = () => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
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
            source={images.profileImage}
            className="w-12 h-12 rounded-full"
          />
          <View className="ml-2">
            <Text className="text-black font-bold text-sm">
              Welcome,{" "}
              {user?.firstName ||
                user?.username ||
                user?.emailAddresses[0].emailAddress}
            </Text>
            <Text className="text-black text-xs">📍 Moratuwa, Sri Lanka</Text>
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
          onPress={() => {}}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
};
export default Header;
