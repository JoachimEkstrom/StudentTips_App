import React, { useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, Dimensions, StatusBar, View, Image } from "react-native";
import { Container, Button, Text, Header, Icon } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useObserver } from "mobx-react-lite";
import store from "../store/store";
import ListYourPins from "../components/ListYourPins";
import * as Fetching from "../components/fetching";

function YourAccount({ navigation }) {
    const [UserName, setUserName] = useState("");
    let user = store.getCurrentUser;
    console.log(user);

    function ListPin() {
        let pins = store.getMapPins;
        user = store.getCurrentUser;
        return pins.map((pin, index) => {
            if (pin.pinUser === user.userId) {
                return <ListYourPins key={index} index={index} id={pin.pinTitle}></ListYourPins>;
            } else {
                return null;
            }
        });
    }

    async function logout() {
        user = store.getCurrentUser;
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

        setUserName(user.userName);
    }, []);

    return useObserver(() => (
        <>
            <StatusBar backgroundColor="#F77F00" />
            <Header style={styles.header}>
                <Text style={styles.headerText}>{UserName}'s Pins</Text>
                {/* { !== null && (
                    <View>
                        <Image
                            source={{
                                uri: UserImage,
                            }}
                            style={styles.image}
                        ></Image>
                    </View>
                )} */}
            </Header>
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={deviceHeight * 0.28}
                keyboardShouldPersistTaps="always"
                style={{ backgroundColor: "#FCBF49" }}
            >
                {ListPin()}
            </KeyboardAwareScrollView>
            <Container style={styles.container}>
                <Button iconLeft danger rounded color="#F77F00" onPress={() => logout()}>
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
    container: {
        height: deviceHeight * 0.3,
        flex: 1,
        backgroundColor: "#FCBF49",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: deviceHeight * 0.04,
        paddingBottom: deviceHeight * 0.05,
        // borderTopWidth: 1,
        // borderColor: "black",
    },
    header: {
        backgroundColor: "#F77F00",
        height: deviceHeight * 0.065,
    },
    headerText: {
        justifyContent: "center",
        alignSelf: "center",
        fontSize: 26,
        height: deviceHeight * 0.045,
        padding: 0,
        margin: 0,
    },
});

export default YourAccount;
