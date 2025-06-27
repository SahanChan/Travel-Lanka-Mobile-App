import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const Trips = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        initialRegion={{
          latitude: 7.014583,
          longitude: 80.805278,
          latitudeDelta: 5.0,
          longitudeDelta: 3.5,
        }}
      >
        <Marker
          coordinate={{ latitude: 6.868833, longitude: 81.035 }}
          title="Sydney"
          description="A nice place"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
export default Trips;
