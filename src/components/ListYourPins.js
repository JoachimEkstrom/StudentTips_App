import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useObserver } from "mobx-react-lite";
import EditPin from "../components/EditPin";

function ListYourPins(props) {
    return useObserver(() => (
        <View style={styles.container}>
            <Text>{props.id}</Text>
            <EditPin pinIndex={props.index}></EditPin>
        </View>
    ));
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        height: 75,
    },
});

export default ListYourPins;
