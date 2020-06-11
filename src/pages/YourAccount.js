import React, { component } from "react";
import {
    StyleSheet,
    ScrollView,
    SafeAreaView,
    ToastAndroid,
} from "react-native";
import { Container, Button, Text } from "native-base";
import { useObserver } from "mobx-react-lite";
import store from "../store/store";
import ListYourPins from "../components/ListYourPins";
import * as Fetching from "../components/fetching";

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

    async function logout() {
        let user = store.getCurrentUser;
        let message = await Fetching.logout(user.token);
        console.log(message);
        showToast(message.message);
        if (message.loggedOut === true) {
            navigation.navigate("Home");
        }
    }

    function showToast(message) {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }

    return useObserver(() => (
        <ScrollView contentContainerStyle={styles.container}>
            <Button
                style={{ marginTop: 10 }}
                rounded
                color="#F77F00"
                onPress={() => logout()}
            >
                <Text>Logout</Text>
            </Button>
            <Text style={styles.text}>Account page FTW!</Text>
            {ListPin()}
        </ScrollView>
    ));
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCBF49",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        height: 20,
        marginLeft: 10,
    },
});

export default YourAccount;
