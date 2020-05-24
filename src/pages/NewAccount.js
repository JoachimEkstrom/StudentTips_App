import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react";
import DataStorage from "../store/store";

function NewAccount({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Create a new account!</Text>
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

export default observer(NewAccount);
