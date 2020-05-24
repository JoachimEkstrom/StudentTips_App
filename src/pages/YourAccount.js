import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react";
import DataStorage from "../store/store";

function YourAccount({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Account page FTW!</Text>
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

export default observer(YourAccount);
