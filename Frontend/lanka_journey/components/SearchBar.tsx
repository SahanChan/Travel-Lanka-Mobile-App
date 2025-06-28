import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
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

      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={"#a8b5db"}
        className={"flex-1 ml-2 text-black"}
      />

      {value && value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText && onChangeText("")}
          className="p-1"
        >
          <Ionicons name="close-outline" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default SearchBar;
