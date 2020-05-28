import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react";
import DataStorage from "../store/store";
import EditPin from "../components/EditPin";
import { useEffect, useState } from "react";

function ListYourPins(props) {
  return (
    <View style={styles.container}>
      <Text>One pin FTW!</Text>
      <Text>{props.id}</Text>
      <EditPin pinIndex={props.index}></EditPin>
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

export default observer(ListYourPins);
