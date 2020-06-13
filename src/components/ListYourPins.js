import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Container, Button, Text, Icon } from "native-base";
import { useObserver } from "mobx-react-lite";
import EditPin from "../components/EditPin";

function ListYourPins(props) {
    return useObserver(() => (
        <Container style={styles.container}>
            <Text style={styles.text}>{props.id}</Text>
            <EditPin pinIndex={props.index}></EditPin>
        </Container>
    ));
}

// Screen area
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCBF49",
        alignItems: "center",
        justifyContent: "center",
        height: deviceHeight * 0.105,
    },
    text: {
        fontSize: 20,
    },
});

export default ListYourPins;
