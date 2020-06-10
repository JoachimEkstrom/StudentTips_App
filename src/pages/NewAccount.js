import React, { component } from "react";
import {
    StyleSheet,
    Text,
    View,
    Switch,
    TextInput,
    TouchableHighlight,
    Button,
    ToastAndroid,
} from "react-native";
import { useObserver } from "mobx-react-lite";
import store from "../store/store";
import { useEffect, useState } from "react";

function NewAccount({ navigation }) {
    const [Admin, setAdmin] = useState(false);
    const toggleSwitch = () => setAdmin((previousState) => !previousState);
    const [UserName, setUserName] = useState("");
    const [Password, setPassword] = useState("");
    const [RePassword, setRePassword] = useState("");

    async function createAccount() {
        console.log(Password);
        console.log(RePassword);
        console.log(Admin);
        if (Password === RePassword) {
            console.log("Send to Backend!");
        } else {
            ToastAndroid.show("Your passwords don´t match", ToastAndroid.SHORT);
        }
    }

    return useObserver(() => (
        <View style={styles.container}>
            <Text>Create a new account!</Text>

            {/* Account name */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                    Username:{" "}
                </Text>
                <TextInput
                    style={{
                        height: 40,
                        width: 80,
                        borderColor: "gray",
                        borderWidth: 1,
                        fontSize: 16,
                    }}
                    onChangeText={(text) => setUserName(text)}
                    value={UserName}
                />
            </View>

            {/* Choose password */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                    Choose a password:{" "}
                </Text>
                <TextInput
                    style={{
                        height: 40,
                        width: 80,
                        borderColor: "gray",
                        borderWidth: 1,
                        fontSize: 16,
                    }}
                    onChangeText={(text) => setPassword(text)}
                    value={Password}
                />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                    Retype your password:{" "}
                </Text>
                <TextInput
                    style={{
                        height: 40,
                        width: 80,
                        borderColor: "gray",
                        borderWidth: 1,
                        fontSize: 16,
                    }}
                    onChangeText={(text) => setRePassword(text)}
                    value={RePassword}
                />
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    height: 23,
                }}
            >
                <Text>Admin account?: </Text>
                <Switch
                    trackColor={{ false: "#555555", true: "#81b0ff" }}
                    thumbColor={Admin ? "#04ff04" : "#ff0004"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={Admin}
                />
            </View>

            {/* Submit button */}
            <TouchableHighlight>
                <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                >
                    <Button title="Submit" onPress={() => createAccount()} />
                </View>
            </TouchableHighlight>
        </View>
    ));
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FCBF49",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default NewAccount;
