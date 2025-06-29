// Test script to verify onboarding functionality
// This script helps test the onboarding fix

import AsyncStorage from '@react-native-async-storage/async-storage';

const testOnboardingFix = async () => {
  console.log('🧪 Testing Onboarding Fix...\n');
  
  try {
    // Check current onboarding state
    const currentState = await AsyncStorage.getItem('hasSeenOnboarding');
    console.log('📋 Current onboarding state:', currentState || 'null (first time user)');
    
    if (currentState === 'true') {
      console.log('⚠️  Onboarding has been completed before.');
      console.log('🔄 Clearing onboarding state to test...');
      await AsyncStorage.removeItem('hasSeenOnboarding');
      console.log('✅ Onboarding state cleared!');
    } else {
      console.log('✅ Onboarding state is ready for first-time experience');
    }
    
    console.log('\n📱 Instructions:');
    console.log('1. Completely close and restart the app');
    console.log('2. The onboarding screen should now appear');
    console.log('3. If it still doesn\'t appear, check:');
    console.log('   - Make sure you have a stable internet connection');
    console.log('   - Ensure the .env file contains EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
    console.log('   - Try clearing the app cache: npx expo start -c');
    
  } catch (error) {
    console.error('❌ Error testing onboarding:', error);
  }
};

// Export for use in other files
export const runOnboardingTest = testOnboardingFix;

// For direct execution
if (typeof require !== 'undefined' && require.main === module) {
  testOnboardingFix();
}