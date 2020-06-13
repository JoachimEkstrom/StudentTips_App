import React, { component } from "react";
import {
    StyleSheet,
    Image,
    TextInput,
    ToastAndroid,
    Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Container, Button, Text, Icon } from "native-base";
import { useObserver } from "mobx-react-lite";
import "react-native-gesture-handler";
import * as Fetching from "../components/fetching";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import Logo from "../img/Logo.png";

function Home({ navigation }) {
    const [errorMsg, setErrorMsg] = useState(null);
    const [UserName, setUserName] = useState("");
    const [Password, setPassword] = useState("");

    useEffect(() => {
        Fetching.getPins();
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
            }
        })();
    }, []);

    function resetFields() {
        setUserName("");
        setPassword("");
    }

    async function loginUser() {
        let user = {
            userName: UserName,
            userPassword: Password,
        };

        let message = await Fetching.login(user);
        showToast(message.message);
        if (message.loggedIn === true) {
            resetFields();
            navigation.navigate("Map");
        }
    }
    function showToast(message) {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }

    return useObserver(() => (
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraScrollHeight={deviceHeight * 0.28}
            keyboardShouldPersistTaps="always"
        >
            <Container style={styles.container}>
                {errorMsg && <Text>{errorMsg}</Text>}
                <Image source={Logo} style={styles.image}></Image>
                <Text style={styles.textH1}>Welcome to TopTip!</Text>

                <Container style={styles.fields}>
                    <Text style={styles.text}>Username: </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => setUserName(text)}
                        value={UserName}
                    />
                </Container>
                <Container style={styles.fields}>
                    <Text style={styles.text}>Password: </Text>
                    <TextInput
                        secureTextEntry={true}
                        style={styles.textInput}
                        onChangeText={(text) => setPassword(text)}
                        value={Password}
                    />
                </Container>
                <Button
                    iconLeft
                    primary
                    style={styles.button}
                    rounded
                    color="#F77F00"
                    onPress={() => {
                        loginUser();
                    }}
                >
                    <Icon name="paper-plane" />
                    <Text>Login!</Text>
                </Button>
                <Button
                    iconLeft
                    primary
                    style={styles.button}
                    rounded
                    color="#F77F00"
                    onPress={() => {
                        resetFields();
                        navigation.navigate("NewAccount");
                    }}
                >
                    <Icon name="person-add" />
                    <Text>Create new account!</Text>
                </Button>
                <Container style={{ margin: deviceWidth * 0.1 }}></Container>
            </Container>
        </KeyboardAwareScrollView>
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
    },
    image: {
        marginTop: deviceHeight * 0.015,
        height: deviceWidth * 0.4,
        width: deviceWidth * 0.4,
        resizeMode: "contain",
    },
    textH1: {
        marginTop: deviceHeight * 0.015,
        marginBottom: deviceHeight * 0.065,
        fontSize: 36,
    },
    text: {
        fontSize: 16,
        height: deviceHeight * 0.03,
        marginLeft: deviceWidth * 0.025,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        height: deviceHeight * 0.065,
        marginLeft: deviceWidth * 0.015,
    },
    button: {
        marginTop: deviceHeight * 0.015,
    },
    fields: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: deviceWidth * 0.75,
        height: deviceHeight * 0.03,
        marginTop: deviceHeight * 0.015,
        marginBottom: deviceHeight * 0.005,
        borderRadius: deviceHeight * 0.03,
    },
});

export default Home;
