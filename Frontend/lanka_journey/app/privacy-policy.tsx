import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            Privacy Policy
          </Text>
          <View className="w-8" />
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          <Text className="text-sm text-gray-500 mb-6 text-center">
            Last updated: {new Date().toLocaleDateString()}
          </Text>

          <View className="space-y-6">
            {/* Introduction */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Our Commitment to Privacy
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                Lanka Journey is committed to protecting your privacy and being
                transparent about how we handle your data. As an open-source
                travel application, we believe in the principles of
                transparency, user control, and data minimization.
              </Text>
              <Text className="text-gray-700 leading-6">
                This Privacy Policy explains how we collect, use, and protect
                your information when you use our mobile application and related
                services.
              </Text>
            </View>

            {/* Open Source Nature */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Open Source Transparency
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                Lanka Journey is proudly open-source software. This means:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Our source code is publicly available for review and audit
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • You can verify exactly how your data is processed
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Community contributions help improve privacy and security
                </Text>
                <Text className="text-gray-700 leading-6">
                  • No hidden data collection or tracking mechanisms
                </Text>
              </View>
            </View>

            {/* Information We Collect */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Information We Collect
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                We collect only the minimum information necessary to provide our
                services:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Account information (name, email) when you create an account
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Trip preferences and saved locations for personalization
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Device information for app functionality and crash reporting
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Location data (only when explicitly granted) for
                  location-based features
                </Text>
              </View>
            </View>

            {/* How We Use Information */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                How We Use Your Information
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                Your information is used solely to enhance your travel
                experience:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Provide personalized travel recommendations
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Save your favorite locations and trip plans
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Improve app performance and fix bugs
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Send important updates about the service (with your consent)
                </Text>
              </View>
            </View>

            {/* Data Protection */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Data Protection & Security
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                We implement industry-standard security measures to protect your
                data:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Encryption of data in transit and at rest
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Regular security audits and updates
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Limited access to personal data by authorized personnel only
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Secure cloud infrastructure with reputable providers
                </Text>
              </View>
            </View>

            {/* Your Rights */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Your Rights & Control
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                You have full control over your data:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Access and download your personal data
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Correct or update your information
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Delete your account and associated data
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Opt-out of non-essential communications
                </Text>
              </View>
            </View>

            {/* Third-Party Services */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Third-Party Services
              </Text>
              <Text className="text-gray-700 leading-6">
                We may use trusted third-party services for authentication,
                analytics, and cloud storage. These services are carefully
                selected based on their privacy practices and are bound by
                strict data processing agreements.
              </Text>
            </View>

            {/* Contact Information */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Contact Us
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </Text>
              <View className="bg-gray-50 rounded-lg p-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  Email: privacy@lankajourney.com
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  GitHub: github.com/lankajourney/mobile-app
                </Text>
                <Text className="text-gray-700 leading-6">
                  Community Forum: community.lankajourney.com
                </Text>
              </View>
            </View>

            {/* Open Source Badge */}
            <View className="bg-green-50 rounded-xl border border-green-200 p-4 mt-6">
              <View className="flex-row items-center gap-3">
                <Ionicons name="code-slash" size={24} color="#10B981" />
                <View className="flex-1">
                  <Text className="text-green-800 font-medium mb-1">
                    Open Source & Free
                  </Text>
                  <Text className="text-green-700 text-sm">
                    This app is open-source software, built by the community for
                    the community. Your privacy and freedom are our priorities.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
