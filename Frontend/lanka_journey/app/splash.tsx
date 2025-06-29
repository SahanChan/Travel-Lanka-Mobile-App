import React from "react";
import {
  View,
  Image,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { images } from "@/constants/images";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {

  return (
    <ImageBackground
      source={images.bgImage3}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          source={images.logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator
          size="large"
          color="#FFD700"
          style={styles.loadingIndicator}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width,
    height,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 120,
  },
  loadingIndicator: {
    marginTop: 40,
  },
});

export default SplashScreen;
