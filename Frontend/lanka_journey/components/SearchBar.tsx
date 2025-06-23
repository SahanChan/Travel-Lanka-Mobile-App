import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  placeholder?: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({ onPress, placeholder, value, onChangeText }: Props) => {
  return (
    <View className={"flex-row items-center bg-accent rounded-md px-2"}>
      <Ionicons name="search" size={24} />

      {/*<Image*/}
      {/*  source={}*/}
      {/*  className={"size-5"}*/}
      {/*  resizeMode={"contain"}*/}
      {/*  tintColor={"#ab8bff"}*/}
      {/*/>*/}
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={"#a8b5db"}
        className={"flex-1 ml-2 text-black"}
      />
    </View>
  );
};
export default SearchBar;
