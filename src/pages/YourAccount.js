import React, { useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, Dimensions, StatusBar, ImageBackground } from "react-native";
import { Container, Button, Text, Header, Icon } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useObserver } from "mobx-react-lite";
import store from "../store/store";
import ListYourPins from "../components/ListYourPins";
import * as Fetching from "../components/fetching";

function YourAccount({ navigation }) {
    const [User, setUser] = useState("");
    let user = store.getCurrentUser;

    function ListPin() {
        let pins = store.getMapPins;

        return pins.map((pin, index) => {
            if (pin.pinUser === user.userId) {
                return <ListYourPins key={index} index={index} id={pin.pinTitle}></ListYourPins>;
            } else {
                return null;
            }
        });
    }

    async function logout() {
        let message = await Fetching.logout(user.token);
        showToast(message.message);
        if (message.loggedOut === true) {
            navigation.navigate("Home");
        }
    }

    function showToast(message) {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }

    useEffect(() => {
        user = store.getCurrentUser;

        setUser(user);
    }, []);

    return useObserver(() => (
        <>
            <StatusBar backgroundColor="#F77F00" />
            <Header style={styles.header}>
                {user.userImage !== null && (
                    <ImageBackground
                        source={{
                            uri: user.userImage,
                        }}
                        style={styles.image}
                    >
                        <Text style={styles.headerText}>{User.userName}'s Pins</Text>
                    </ImageBackground>
                )}
            </Header>
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                keyboardShouldPersistTaps="always"
                style={styles.scroll}
                persistentScrollbar={true}
            >
                {ListPin()}
            </KeyboardAwareScrollView>
            <Container style={styles.container}>
                <Button style={styles.button} iconLeft danger rounded color="#F77F00" onPress={() => logout()}>
                    <Icon name="log-out" />
                    <Text>Logout</Text>
                </Button>
            </Container>
        </>
    ));
}
// Screen area
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#F77F00",
        height: deviceHeight * 0.2,
        width: deviceWidth * 1,
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
    },
    headerText: {
        justifyContent: "center",
        alignSelf: "center",
        textAlign: "center",
        fontSize: 36,
        height: deviceHeight * 0.1,
        padding: 10,
        margin: 0,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        left: 10,
    },
    image: {
        flex: 1,
        height: deviceHeight * 0.2,
        width: deviceWidth * 1,
        resizeMode: "contain",
        backgroundColor: "#F77F00",
        justifyContent: "center",
        alignSelf: "center",
        margin: 0,
        padding: 0,
        right: 10,
    },
    scroll: {
        flex: 0.8,
        backgroundColor: "#FCBF49",
        // height: deviceHeight * 0.5,
    },
    container: {
        height: deviceHeight * 0.3,
        flex: 0.2,
        backgroundColor: "#FCBF49",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingTop: deviceHeight * 0.01,
        paddingBottom: deviceHeight * 0.01,
    },
    button: {
        flex: 0.3,
    },
});

export default YourAccount;
