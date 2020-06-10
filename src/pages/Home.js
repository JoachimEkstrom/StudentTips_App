import React, { component } from "react";
import { StyleSheet, Image, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Container, Button, Text } from "native-base";
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

    return useObserver(() => (
        <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={200}>
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
                    style={{ marginTop: 10 }}
                    rounded
                    color="#F77F00"
                    onPress={() => {
                        resetFields();
                        navigation.navigate("Map");
                    }}
                >
                    <Text>Login!</Text>
                </Button>
                <Button
                    style={{ marginTop: 10 }}
                    rounded
                    color="#F77F00"
                    onPress={() => {
                        resetFields();
                        navigation.navigate("NewAccount");
                    }}
                >
                    <Text>Create new account!</Text>
                </Button>
                {/* <Button
                style={{ marginTop: 10 }}
                rounded
                color="#F77F00"
                onPress={() => navigation.navigate("YourAccount")}
            >
                <Text>Your profile</Text>
            </Button> */}
                <Container style={{ margin: 50 }}></Container>
            </Container>
        </KeyboardAwareScrollView>
    ));
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCBF49",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        marginTop: 10,
        height: 150,
        width: 150,
        resizeMode: "contain",
    },
    textH1: {
        marginTop: 10,
        marginBottom: 50,
        fontSize: 36,
    },
    text: {
        fontSize: 16,
        height: 20,
        marginLeft: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        height: 50,
        marginLeft: 5,
    },
    fields: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: 300,
        height: 20,
        marginTop: 10,
        marginBottom: 5,
        borderRadius: 20,
    },
});

export default Home;
