import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const languages = [
  {
    id: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
  {
    id: "si",
    name: "Sinhala",
    nativeName: "සිංහල",
    flag: "🇱🇰",
  },
  {
    id: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    flag: "🇱🇰",
  },
];

const Language = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleLanguageSelect = (languageId: string) => {
    setSelectedLanguage(languageId);
    // Show message that languages are not yet supported
    setTimeout(() => {
      alert("Languages are still not yet supported. Coming soon!");
    }, 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            Language Settings
          </Text>
          <View className="w-8" />
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          <Text className="text-gray-600 mb-6 text-center">
            Select your preferred language
          </Text>

          <View className="bg-white rounded-xl border border-gray-200">
            {languages.map((language, index) => (
              <TouchableOpacity
                key={language.id}
                onPress={() => handleLanguageSelect(language.id)}
                className={`flex-row items-center justify-between px-4 py-4 ${
                  index < languages.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <View className="flex-row items-center gap-4">
                  <Text className="text-2xl">{language.flag}</Text>
                  <View>
                    <Text className="text-gray-800 font-medium text-base">
                      {language.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {language.nativeName}
                    </Text>
                  </View>
                </View>
                {selectedLanguage === language.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <View className="flex-row items-center gap-3">
              <Ionicons name="information-circle" size={24} color="#F59E0B" />
              <Text className="text-yellow-800 font-medium flex-1">
                Language support is coming soon! Currently, only English is available.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Language;