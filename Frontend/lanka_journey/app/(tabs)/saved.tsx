import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { images } from "@/constants/images";

const collectionsData = [
  {
    id: "1",
    title: "Default Collection",
    image: images.acresHotel, // replace with your image
  },
  {
    id: "2",
    title: "Beaches",
    image: images.kudaRavana,
  },
];

const Saved = () => {
  const [collections, setCollections] = useState(collectionsData);

  const handleNewCollection = () => {
    // Add your logic here (e.g. open a modal to create a new collection)
    console.log("Create new collection");
  };

  return (
    <View className="flex-1 bg-white px-4 pt-14">
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold">Collections</Text>
        <TouchableOpacity
          onPress={handleNewCollection}
          className="bg-secondary px-3 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">+ New Collection</Text>
        </TouchableOpacity>
      </View>

      {/* Collections Grid */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {collections.map((item) => (
            <View key={item.id} className="w-[48%] mb-5 items-center">
              <Image
                source={item.image}
                className="w-full h-32 rounded-lg"
                resizeMode="cover"
              />
              <Text className="mt-2 text-sm text-gray-600 text-center">
                {item.title}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
export default Saved;
