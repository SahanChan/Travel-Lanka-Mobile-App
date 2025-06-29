// Script to clear AsyncStorage and reset onboarding state
// Run this script to see the onboarding screen again

import AsyncStorage from '@react-native-async-storage/async-storage';

const clearOnboardingState = async () => {
  try {
    await AsyncStorage.removeItem('hasSeenOnboarding');
    console.log('✅ Onboarding state cleared successfully!');
    console.log('🔄 Restart the app to see the onboarding screen again.');
  } catch (error) {
    console.error('❌ Error clearing onboarding state:', error);
  }
};

// For React Native CLI or if running in a React Native environment
export const resetOnboarding = clearOnboardingState;

// For direct execution (if supported)
if (typeof require !== 'undefined' && require.main === module) {
  clearOnboardingState();
}