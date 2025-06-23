import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import Header from "@/components/Header";
import { icons } from "@/constants/icons";
import TopPlacesCard from "@/components/TopPlacesCard";
import { images } from "@/constants/images";
import {
  categories,
  topActivities,
  topHotels,
  topPlaces,
  topRestaurants,
} from "@/constants";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/SignOutButton";
import { Link } from "expo-router";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();

  return (
    <>
      <Header />
      {/*<View className="px-5 py-2">*/}
      {/*  <Text className="text-lg font-semibold">*/}
      {/*    Welcome,{" "}*/}
      {/*    {user?.firstName ||*/}
      {/*      user?.username ||*/}
      {/*      user?.emailAddresses[0].emailAddress}*/}
      {/*  </Text>*/}
      {/*  <SignOutButton />*/}
      {/*</View>*/}
      <ScrollView
        className="flex-1 "
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 150 }}
      >
        <View className="flex flex-col">
          <View className="px-5 mt-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Categories
            </Text>
            <View className="flex-row justify-between">
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  className="items-center justify-center bg-secondary-100 w-24 h-24 rounded-xl shadow-sm"
                  activeOpacity={0.8}
                >
                  <Image
                    source={cat.icon}
                    className="w-10 h-10 mb-1"
                    resizeMode="contain"
                  />
                  <Text className="text-xs text-gray-600 text-center">
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className=" mt-6">
            <View className="flex-row justify-between items-center px-5">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Top Places
              </Text>
              <TouchableOpacity>
                <Text className="text-sm font-semibold text-muted mb-4">
                  See more
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                data={topPlaces}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 20, // space before the first card
                  paddingRight: 10, // optional: spacing at the end
                }}
                renderItem={({ item }) => (
                  <TopPlacesCard
                    image={item.image}
                    title={item.title}
                    location={item.location}
                  />
                )}
              />
            </View>
          </View>
          <View className=" mt-6">
            <View className="flex-row justify-between items-center px-5">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Top Hotels
              </Text>
              <TouchableOpacity>
                <Text className="text-sm font-semibold text-muted mb-4">
                  See more
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                data={topHotels}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 20, // space before the first card
                  paddingRight: 10, // optional: spacing at the end
                }}
                renderItem={({ item }) => (
                  <TopPlacesCard
                    image={item.image}
                    title={item.title}
                    location={item.location}
                  />
                )}
              />
            </View>
          </View>
          <View className=" mt-6">
            <View className="flex-row justify-between items-center px-5">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Top Activities
              </Text>
              <TouchableOpacity>
                <Text className="text-sm font-semibold text-muted mb-4">
                  See more
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                data={topActivities}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 20, // space before the first card
                  paddingRight: 10, // optional: spacing at the end
                }}
                renderItem={({ item }) => (
                  <TopPlacesCard
                    image={item.image}
                    title={item.title}
                    location={item.location}
                  />
                )}
              />
            </View>
          </View>
          <View className=" mt-6">
            <View className="flex-row justify-between items-center px-5">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Top Restaurants
              </Text>
              <TouchableOpacity>
                <Text className="text-sm font-semibold text-muted mb-4">
                  See more
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                data={topRestaurants}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 20, // space before the first card
                  paddingRight: 10, // optional: spacing at the end
                }}
                renderItem={({ item }) => (
                  <TopPlacesCard
                    image={item.image}
                    title={item.title}
                    location={item.location}
                  />
                )}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
