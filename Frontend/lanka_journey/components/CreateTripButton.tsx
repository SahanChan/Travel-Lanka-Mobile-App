import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CreateTripButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
}

const CreateTripButton: React.FC<CreateTripButtonProps> = ({ iconName }) => {
  return (
    <View
      style={{
        height: 75,
        width: 75,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 99999,
        backgroundColor: "#ffc600",
        top: -20,
        // marginBottom: 70,
      }}
    >
      <Ionicons color="#ffffff" name={iconName} size={40} />
    </View>
  );
};

export default CreateTripButton;
