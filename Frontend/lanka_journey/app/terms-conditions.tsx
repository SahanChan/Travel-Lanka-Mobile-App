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

const TermsConditions = () => {
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
            Terms & Conditions
          </Text>
          <View className="w-8" />
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          <Text className="text-sm text-gray-500 mb-6 text-center">
            Last updated: {new Date().toLocaleDateString()}
          </Text>

          <View className="space-y-6">
            {/* Welcome */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Welcome to Lanka Journey!
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                These Terms and Conditions ("Terms") govern your use of the
                Lanka Journey mobile application and related services. By using
                our app, you agree to these terms. If you don't agree, please
                don't use our services.
              </Text>
              <Text className="text-gray-700 leading-6">
                We've tried to make these terms as friendly and understandable
                as possible, because nobody likes reading legal jargon!
              </Text>
            </View>

            {/* About Our Service */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                About Our Service
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                Lanka Journey is your friendly travel companion for exploring
                Sri Lanka. We provide:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Travel recommendations and guides
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Trip planning tools
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Location information and reviews
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Cultural insights and local tips
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Community features for travelers
                </Text>
              </View>
            </View>

            {/* User Responsibilities */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Your Responsibilities as a User
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                We believe in creating a positive community for all travelers.
                Here's what we ask of you:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Be respectful to other users and local communities
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Provide accurate information when sharing reviews or tips
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Don't spam or post inappropriate content
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Respect local customs and environmental guidelines
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Use the app for personal, non-commercial purposes
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Keep your account information secure and up-to-date
                </Text>
              </View>
            </View>

            {/* Content Guidelines */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Content Guidelines
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                When you share content on Lanka Journey, please ensure it's:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Helpful and relevant to other travelers
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Respectful of local culture and traditions
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Free from offensive, discriminatory, or harmful language
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Not promoting illegal activities or unsafe practices
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Your own original content or properly attributed
                </Text>
              </View>
            </View>

            {/* Open Source Nature */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Open Source Community
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                Lanka Journey is proudly open-source! This means:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • You can view, modify, and contribute to our source code
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Community contributions are welcome and encouraged
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Bug reports and feature requests help us improve
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • You can fork the project for your own use
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Transparency is at the core of everything we do
                </Text>
              </View>
            </View>

            {/* Disclaimers */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Important Disclaimers
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                While we strive to provide accurate and helpful information,
                please note:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Travel information may change without notice
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Always verify current conditions before traveling
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • We're not responsible for third-party services or bookings
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • User-generated content reflects individual opinions
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Follow local laws and regulations during your travels
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Travel at your own risk and use common sense
                </Text>
              </View>
            </View>

            {/* Privacy and Data */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Privacy and Your Data
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                Your privacy matters to us. Here's our commitment:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • We collect only necessary information for app functionality
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Your data is never sold to third parties
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • You can delete your account and data at any time
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • We use secure, encrypted storage for your information
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Check our Privacy Policy for detailed information
                </Text>
              </View>
            </View>

            {/* Intellectual Property */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Intellectual Property
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                Regarding content and intellectual property:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Our app design and original content are protected
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • User-generated content remains owned by the user
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • You grant us license to display your shared content
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Respect copyrights when sharing photos or content
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Our open-source code is available under appropriate licenses
                </Text>
              </View>
            </View>

            {/* Service Availability */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Service Availability
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                We work hard to keep Lanka Journey running smoothly, but:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Services may occasionally be unavailable for maintenance
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • We may update features and functionality regularly
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Some features may require internet connectivity
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • We'll notify users of major changes when possible
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Emergency maintenance may occur without prior notice
                </Text>
              </View>
            </View>

            {/* Community Standards */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Community Standards
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                Lanka Journey is built on community spirit. We expect all users
                to:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • Help fellow travelers with genuine advice
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Share experiences that benefit the community
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Report inappropriate content or behavior
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Promote sustainable and responsible tourism
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Celebrate the diversity of travelers and cultures
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Contribute positively to the travel community
                </Text>
              </View>
            </View>

            {/* Updates and Changes */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Updates and Changes
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                As Lanka Journey evolves, these terms may change:
              </Text>
              <View className="ml-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  • We'll notify users of significant changes
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Continued use implies acceptance of updated terms
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • Major changes will include a grace period for review
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  • You can always view the current terms in the app
                </Text>
                <Text className="text-gray-700 leading-6">
                  • Community feedback on changes is always welcome
                </Text>
              </View>
            </View>

            {/* Contact and Support */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Contact and Support
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                We're here to help! If you have questions, concerns, or
                feedback:
              </Text>
              <View className="bg-gray-50 rounded-lg p-4">
                <Text className="text-gray-700 leading-6 mb-2">
                  Email: s.chandrabahu@gmail.com
                </Text>
                <Text className="text-gray-700 leading-6 mb-2">
                  GitHub Issues: github.com/SahanChan/Travel-Lanka-Mobile-App
                </Text>

                <Text className="text-gray-700 leading-6">
                  Social Media: @LankaJourney
                </Text>
              </View>
            </View>

            {/* Final Note */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Thank You!
              </Text>
              <Text className="text-gray-700 leading-6 mb-4">
                Thank you for being part of the Lanka Journey community! We're
                excited to help you discover the beauty, culture, and adventures
                that Sri Lanka has to offer.
              </Text>
              <Text className="text-gray-700 leading-6">
                Remember, travel is about creating memories, building
                connections, and respecting the places and people you encounter.
                Happy travels!
              </Text>
            </View>

            {/* Open Source Badge */}
            <View className="bg-blue-50 rounded-xl border border-blue-200 p-4 mt-6">
              <View className="flex-row items-center gap-3">
                <Ionicons name="heart" size={24} color="#3B82F6" />
                <View className="flex-1">
                  <Text className="text-blue-800 font-medium mb-1">
                    Made with ❤️ by Sahan
                  </Text>
                  <Text className="text-blue-700 text-sm">
                    Lanka Journey is open-source software created by travelers,
                    for travelers. Join our community and help make travel
                    better for everyone!
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

export default TermsConditions;
