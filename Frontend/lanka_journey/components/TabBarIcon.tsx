import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TabBarIconProps {
  focused: boolean;
  color: string;
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({
  focused,
  color,
  iconName,
  label,
}) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 70,
      }}
    >
      <Ionicons name={iconName} size={24} color={color} />
      <Text style={{ color }} className="mt-4 font-medium text-xs">
        {label}
      </Text>
    </View>
  );
};

export default TabBarIcon;
