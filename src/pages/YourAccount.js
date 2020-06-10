import React, { component } from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import { useObserver } from "mobx-react-lite";
import store from "../store/store";
import ListYourPins from "../components/ListYourPins";

function YourAccount({ navigation }) {
    function ListPin() {
        let pins = store.getMapPins;
        let user = store.getCurrentUser;
        return pins.map((pin, index) => {
            if (pin.pinUser === user.userId) {
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

    return useObserver(() => (
        <ScrollView style={styles.container}>
            <Text>Account page FTW!</Text>
            {ListPin()}
        </ScrollView>
    ));
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCBF49",
    },
});

export default YourAccount;
