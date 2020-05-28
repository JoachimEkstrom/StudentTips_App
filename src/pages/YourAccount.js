import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react";
import DataStorage from "../store/store";
import * as Fetching from "../components/fetching";
import ListYourPins from "../components/ListYourPins";

function YourAccount({ navigation }) {
  function openPin() {}

  function ListPin() {
    return DataStorage.MapPins.map((pin, index) => {
      if (pin.pinUser === DataStorage.currentUser.userId) {
        return (
          <ListYourPins
            key={index}
            index={index}
            id={pin.pinTitle}
          ></ListYourPins>
        );
      } else {
        return null;
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text>Account page FTW!</Text>
      {ListPin()}
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
