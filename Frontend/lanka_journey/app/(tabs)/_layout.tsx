import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableOpacityProps,
} from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "@/constants/icons";
import CreateTripButton from "@/components/CreateTripButton";
import { Ionicons } from "@expo/vector-icons";
import TabBarIcon from "@/components/TabBarIcon";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#ffc600",
        tabBarStyle: {
          position: "absolute",
          bottom: 27,
          height: 90,
          left: 16,
          right: 16,
          backgroundColor: "#eeeeee",
          elevation: 20,
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              iconName={focused ? "home" : "home-outline"}
              label="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              iconName={focused ? "earth" : "earth-outline"}
              label="Trips"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="createNewTrip"
        options={{
          tabBarShowLabel: false,
          title: "Add",
          headerShown: false,
          // tabBarIcon: ({}) => <CreateTripButton iconName="add" />,
          tabBarButton: (props) => (
            <TouchableOpacity
              {...(props as TouchableOpacityProps)}
              style={{
                top: -20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CreateTripButton iconName="add" />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              iconName={focused ? "bookmark" : "bookmark-outline"}
              label="Saved"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              iconName={focused ? "person" : "person-outline"}
              label="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;
