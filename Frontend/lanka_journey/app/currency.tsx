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

const currencies = [
  {
    id: "lkr",
    name: "Sri Lankan Rupee",
    code: "LKR",
    symbol: "Rs",
    flag: "🇱🇰",
    description: "Official currency of Sri Lanka",
    isDefault: true,
  },
  {
    id: "usd",
    name: "US Dollar",
    code: "USD",
    symbol: "$",
    flag: "🇺🇸",
    description: "Widely accepted in tourist areas",
    isDefault: false,
  },
  {
    id: "eur",
    name: "Euro",
    code: "EUR",
    symbol: "€",
    flag: "🇪🇺",
    description: "Accepted in major hotels and restaurants",
    isDefault: false,
  },
  {
    id: "gbp",
    name: "British Pound",
    code: "GBP",
    symbol: "£",
    flag: "🇬🇧",
    description: "Accepted in tourist establishments",
    isDefault: false,
  },
];

const exchangeRates = [
  { from: "USD", to: "LKR", rate: "325.50" },
  { from: "EUR", to: "LKR", rate: "355.20" },
  { from: "GBP", to: "LKR", rate: "410.75" },
];

const Currency = () => {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState("lkr");

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
            Currency Information
          </Text>
          <View className="w-8" />
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          <Text className="text-gray-600 mb-6 text-center">
            Currencies used in Sri Lanka
          </Text>

          {/* Currencies List */}
          <View className="bg-white rounded-xl border border-gray-200 mb-6">
            {currencies.map((currency, index) => (
              <TouchableOpacity
                key={currency.id}
                onPress={() => setSelectedCurrency(currency.id)}
                className={`px-4 py-4 ${
                  index < currencies.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-4 flex-1">
                    <Text className="text-2xl">{currency.flag}</Text>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-gray-800 font-semibold text-base">
                          {currency.name}
                        </Text>
                        {currency.isDefault && (
                          <View className="bg-green-100 px-2 py-1 rounded-full">
                            <Text className="text-green-800 text-xs font-medium">
                              Official
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-500 text-sm">
                        {currency.code} ({currency.symbol}) • {currency.description}
                      </Text>
                    </View>
                  </View>
                  <View className="ml-2">
                    {selectedCurrency === currency.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Exchange Rates */}
          <View className="bg-white rounded-xl border border-gray-200 mb-6">
            <View className="px-4 py-3 border-b border-gray-200">
              <Text className="text-gray-800 font-semibold text-base">
                Current Exchange Rates (Approximate)
              </Text>
            </View>
            {exchangeRates.map((rate, index) => (
              <View
                key={`${rate.from}-${rate.to}`}
                className={`px-4 py-3 flex-row justify-between items-center ${
                  index < exchangeRates.length - 1 ? "border-b border-gray-200" : ""
                }`}
              >
                <Text className="text-gray-700">
                  1 {rate.from} = {rate.rate} {rate.to}
                </Text>
                <Ionicons name="trending-up" size={16} color="#10B981" />
              </View>
            ))}
          </View>

          {/* Information Card */}
          <View className="bg-blue-50 rounded-xl border border-blue-200 p-4">
            <View className="flex-row items-start gap-3">
              <Ionicons name="information-circle" size={24} color="#3B82F6" />
              <View className="flex-1">
                <Text className="text-blue-800 font-medium mb-2">
                  Currency Tips for Sri Lanka
                </Text>
                <Text className="text-blue-700 text-sm leading-5">
                  • Sri Lankan Rupee (LKR) is the official currency{'\n'}
                  • US Dollars are widely accepted in tourist areas{'\n'}
                  • ATMs are available in major cities and towns{'\n'}
                  • Credit cards accepted in hotels and restaurants{'\n'}
                  • Always carry some cash for local markets and transport
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Currency;
