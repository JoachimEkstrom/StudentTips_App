import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { observer } from "mobx-react";
import DataStorage from "../store/store";
import "react-native-gesture-handler";
import * as Fetching from "../components/fetching";
import { useEffect, useState } from "react";

function Home({ navigation }) {
  useEffect(() => {
    Fetching.getPins();
  }, []);
  return (
    <View style={styles.container}>
      <Button
        title="Create new Account"
        onPress={() => navigation.navigate("NewAccount")}
      />
      <Button
        title="Your Account"
        onPress={() => navigation.navigate("YourAccount")}
      />
      <Button
        title="Go to Map page"
        onPress={() => navigation.navigate("Map")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default observer(Home);
