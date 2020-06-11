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
import { useEffect, useState } from "react";
import * as Fetching from "../components/fetching";

function NewAccount({ navigation }) {
    const [Admin, setAdmin] = useState(false);
    const toggleSwitch = () => setAdmin((previousState) => !previousState);
    const [UserName, setUserName] = useState("");
    const [Password, setPassword] = useState("");
    const [RePassword, setRePassword] = useState("");
    const [Description, setDescription] = useState("");
    const [Image, setImage] = useState(null);
    const [Email, setEmail] = useState("");

    async function createAccount() {
        console.log(Password);
        console.log(RePassword);
        console.log(Admin);
        let user = new FormData();

        user.append("userName", UserName);
        user.append("userPassword", Password);
        user.append("userAdmin", Admin);
        user.append("userImage", Image);
        user.append("userDescription", Description);
        user.append("userEmail", Email);

        if (Password === RePassword) {
            console.log("Saving User");
            let message = await Fetching.addNewUser(user);
            if (message === true) {
                navigation.navigate("Home");
            }
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
            {/* Email */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                    Email:{" "}
                </Text>
                <TextInput
                    style={{
                        height: 40,
                        width: 80,
                        borderColor: "gray",
                        borderWidth: 1,
                        fontSize: 16,
                    }}
                    onChangeText={(text) => setEmail(text)}
                    value={Email}
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

            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                    User description:{" "}
                </Text>
                <TextInput
                    style={{
                        height: 40,
                        width: 80,
                        borderColor: "gray",
                        borderWidth: 1,
                        fontSize: 16,
                    }}
                    onChangeText={(text) => setDescription(text)}
                    value={Description}
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
            {/* Cancel button */}
            <TouchableHighlight>
                <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                >
                    <Button
                        title="Cancel"
                        onPress={() => navigation.navigate("Home")}
                    />
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
