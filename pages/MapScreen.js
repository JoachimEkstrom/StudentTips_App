import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react";
import DataStorage from "../store/store";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";

function MapScreen({ navigation }) {
  const [Altitude, setAltitude] = useState("");
  const [Longitude, setLongitude] = useState("");
  const [Latitude, setLatitude] = useState("");

  MapboxGL.setAccessToken(
    "pk.eyJ1IjoianN1bGFiIiwiYSI6ImNrYWY1bmplbjAxNDIyc3E4NmY5NzJzYjkifQ.PJ74G61aNg65BGB06Et3NA"
  );

  // let map = new MapboxGL.Map({
  //   container: "map", // container id
  //   style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
  //   center: [Longitude, Latitude], // starting position [lng, lat]
  //   zoom: 9, // starting zoom
  // });

  async function getLocation() {
    await Location.requestPermissionsAsync();

    let location = await Location.getCurrentPositionAsync({});
    setAltitude(location.coords.altitude.toString());
    setLongitude(location.coords.longitude.toString());
    setLatitude(location.coords.latitude.toString());
  }

  setInterval(() => {
    getLocation();
  }, 1000);

  useEffect(() => {
    // Location stuff
    getLocation();
  }, [Altitude, Longitude, Latitude]);

  return (
    <View style={styles.page}>
      <Text>Maps!!</Text>
      <Text>Location info</Text>
      <Text>Altitude: {Altitude} m</Text>
      <Text>Longitude: {Longitude} deg</Text>
      <Text>Latitude: {Latitude} deg</Text>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: "tomato",
  },
  map: {
    flex: 1,
  },
});

export default observer(MapScreen);
