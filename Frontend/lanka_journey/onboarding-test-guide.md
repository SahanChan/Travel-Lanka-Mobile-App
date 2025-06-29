# Onboarding Test Guide

## Overview
This guide explains how to test the onboarding functionality in the Lanka Journey mobile app.

## What Was Implemented

### 1. Onboarding Screen (`app/onboarding.tsx`)
- 3-slide onboarding flow with welcome screens
- Uses AsyncStorage to track completion with key `"hasSeenOnboarding"`
- Sets flag to `"true"` when user signs up or signs in
- Navigates to auth screens after completion

### 2. Main Layout Logic (`app/_layout.tsx`)
- Checks `"hasSeenOnboarding"` flag on app start
- Shows onboarding screen if flag is `false` or doesn't exist
- Proceeds to auth/main app if flag is `true`

### 3. Reset Functionality (Profile Screen)
- Added "Reset Onboarding" option in Profile > Settings
- Clears the `"hasSeenOnboarding"` AsyncStorage key
- Shows confirmation dialogs for user feedback

## How to Test

### Method 1: Using the Profile Screen (Recommended)
1. Open the app and navigate to the Profile tab
2. Scroll down to the Settings section
3. Tap on "Reset Onboarding" 
4. Confirm the action in the dialog
5. Restart the app completely (close and reopen)
6. The onboarding screens should appear again

### Method 2: Manual AsyncStorage Clear (Development)
If you have access to React Native debugger or development tools:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.removeItem('hasSeenOnboarding');
```

### Method 3: Fresh Install
1. Uninstall the app completely
2. Reinstall the app
3. The onboarding should show on first launch

## Expected Behavior

### First Time Users
- App shows onboarding screens immediately
- After completing onboarding (Sign Up/Sign In), flag is set
- Subsequent app launches skip onboarding

### After Reset
- Onboarding screens appear on next app restart
- User can go through the flow again
- Flag gets reset to `"true"` after completion

## Troubleshooting

### Onboarding Not Showing After Reset
- Ensure you completely restart the app (not just minimize/maximize)
- Check if AsyncStorage was actually cleared (use debugger)
- Verify no caching issues in development environment

### Reset Option Not Visible
- Make sure you're in the Profile tab
- Check that the settingsOptions array includes the "Reset Onboarding" item
- Verify imports are correct in the profile component

## Files Modified
1. `constants/index.js` - Added "Reset Onboarding" to settingsOptions
2. `app/(tabs)/profile.tsx` - Added reset functionality and AsyncStorage handling
3. `clearOnboarding.js` - Utility script (optional, for development use)