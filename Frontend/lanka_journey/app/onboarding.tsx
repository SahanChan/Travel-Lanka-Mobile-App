import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";

const { width, height } = Dimensions.get("window");

const slides: SlideItem[] = [
  {
    key: "1",
    title: "Welcome to Discover Ceylon",
    description:
      "Unveiling Sri Lanka's charms. Explore culture, landscapes & heritage. Your ultimate travel guide.",
    image: images.bgImage2, // replace with your actual file
  },
  {
    key: "2",
    title: "We are the first",
    description: "Sri Lanka #1 full guide travel app",
    image: images.bgImage3,
  },
  {
    key: "3",
    title: "Let’s Get Started!",
    description:
      "Sign up to unlock your personal trip planner and local secrets, or if you are with us already, sign in",
    image: images.bgImage1,
  },
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList<SlideItem>>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      flatListRef.current?.scrollToIndex({ index: nextSlide, animated: true });
    }
  };

  const handleSignUp = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(auth)/sign-up");
  };

  const handleSignIn = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(auth)/sign-in");
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    if (index !== currentSlide) {
      setCurrentSlide(index);
    }
  };

  const SlideItem = ({ item }: { item: SlideItem }) => (
    <View style={styles.slideContainer}>
      <ImageBackground
        source={item.image}
        style={styles.slideBackground}
        resizeMode="cover"
      >
        <View style={styles.logoContainer}>
          <Image
            source={images.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          {currentSlide === slides.length - 1 ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleSignIn}
                style={styles.signInButton}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSignUp}
                style={styles.signUpButton}
              >
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
  );

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  index === currentSlide
                    ? "#FFD700"
                    : "rgba(255, 255, 255, 0.5)",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        data={slides}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => <SlideItem item={item} />}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        extraData={currentSlide}
      />
      <Pagination />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  slideContainer: {
    width,
    height: "100%",
  },
  slideBackground: {
    width,
    height: "100%",
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 120,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "transparent",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  description: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  signInButton: {
    backgroundColor: "transparent",
    borderColor: "#FFD700",
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 24,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  signInText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: "#FFD700",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 24,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  signUpText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#FFD700",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignSelf: "flex-end",
    marginTop: 20,
    marginBottom: 10,
  },
  nextButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Onboarding;
