import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { observer } from "mobx-react";
import DataStorage from "../store/store";
import "react-native-gesture-handler";

function Home({ navigation }) {
  return (
    <View style={styles.container}>
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
