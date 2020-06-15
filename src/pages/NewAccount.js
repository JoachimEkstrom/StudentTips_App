import React from "react";
import { StyleSheet, Switch, ToastAndroid, Image, Dimensions, KeyboardAvoidingView, ScrollView } from "react-native";
import { Container, Button, Text, Card, Input, Content, Form, Label, Header, Item, Icon, Textarea } from "native-base";
import { useObserver } from "mobx-react-lite";
import { useState } from "react";
import * as Fetching from "../components/fetching";
import ImagePicker from "react-native-image-picker";

function NewAccount({ navigation }) {
    const [Admin, setAdmin] = useState(false);

    const [UserName, setUserName] = useState("");
    const [Password, setPassword] = useState("");
    const [RePassword, setRePassword] = useState("");
    const [Description, setDescription] = useState("");
    const [ProfileImage, setProfileImage] = useState(null);
    const [Email, setEmail] = useState("");

    async function createAccount() {
        console.log(Password);
        console.log(RePassword);
        console.log(Admin);
        let user = new FormData();

        user.append("userName", UserName);
        user.append("userPassword", Password);
        user.append("userAdmin", Admin);
        user.append("userImage", ProfileImage);
        user.append("userDescription", Description);
        user.append("userEmail", Email);

        if (Password === RePassword) {
            console.log("Saving User");
            let message = await Fetching.addNewUser(user);
            if (message === true) {
                navigation.navigate("Home");
                resetProfileInfo();
            }
        } else {
            ToastAndroid.show("Your passwords don´t match", ToastAndroid.SHORT);
        }
    }

    function resetProfileInfo() {
        setAdmin(false);
        setUserName("");
        setPassword("");
        setRePassword("");
        setProfileImage(null);
        setDescription("");
        setEmail("");
    }
    function addImage() {
        ImagePicker.showImagePicker({ maxWidth: 500, maxHeight: 500 }, (response) => {
            if (response.didCancel) {
                return;
            }

            const image = {
                uri: response.uri,
                type: response.type,
                name: response.fileName || response.uri.substr(response.uri.lastIndexOf("/") + 1),
            };
            setProfileImage(image);
        });
    }

    const toggleSwitch = () => setAdmin((previousState) => !previousState);

    return useObserver(() => (
        <Container style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <ScrollView style={{ flex: 1 }}>
                    <Card style={styles.card}>
                        <Header style={styles.header}>
                            <Text style={styles.h1}>Enter Account info</Text>
                        </Header>
                        <Container style={styles.formContainer}>
                            <Form style={styles.form}>
                                <Item fixedLabel>
                                    <Label>Username:</Label>
                                    <Input onChangeText={(text) => setUserName(text)} value={UserName} />
                                </Item>
                                <Item fixedLabel>
                                    <Label>Password:</Label>
                                    <Input
                                        secureTextEntry={true}
                                        onChangeText={(text) => setPassword(text)}
                                        value={Password}
                                    />
                                </Item>
                                <Item fixedLabel>
                                    <Label>Retype Password:</Label>
                                    <Input
                                        secureTextEntry={true}
                                        onChangeText={(text) => setRePassword(text)}
                                        value={RePassword}
                                    />
                                </Item>
                                <Item fixedLabel>
                                    <Label>Email:</Label>
                                    <Input onChangeText={(text) => setEmail(text)} value={Email} />
                                </Item>
                                <Item fixedLabel style={styles.itemSwitch}>
                                    <Label>Admin account?</Label>
                                    <Container
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            height: 23,
                                            backgroundColor: "#FFF9C4",
                                        }}
                                    >
                                        <Switch
                                            trackColor={{
                                                false: "#555555",
                                                true: "#81b0ff",
                                            }}
                                            thumbColor={Admin ? "#CDDC39" : "#D32F2F"}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleSwitch}
                                            value={Admin}
                                        />
                                    </Container>
                                </Item>
                                <Item fixedLabel last style={styles.itemTextArea}>
                                    <Textarea
                                        style={styles.textarea}
                                        rowSpan={3}
                                        bordered
                                        placeholder="Describe yourself!"
                                        onChangeText={(text) => setDescription(text)}
                                        value={Description}
                                    />
                                </Item>
                            </Form>
                        </Container>

                        <Container style={styles.lowerParts}>
                            {ProfileImage !== null && (
                                <Image
                                    source={{
                                        uri: ProfileImage.uri,
                                    }}
                                    style={styles.image}
                                ></Image>
                            )}
                            <Button
                                iconLeft
                                info
                                style={styles.button}
                                rounded
                                color="#F77F00"
                                onPress={() => addImage()}
                            >
                                <Icon name="image" />
                                <Text>Add Picture</Text>
                            </Button>

                            {/* Submit button */}

                            <Button iconLeft success style={styles.button} rounded onPress={() => createAccount()}>
                                <Icon name="person-add" />
                                <Text>Submit</Text>
                            </Button>
                            {/* Cancel button */}

                            <Button
                                iconLeft
                                danger
                                style={styles.button}
                                rounded
                                color="#F77F00"
                                onPress={() => navigation.navigate("Home")}
                            >
                                <Icon name="trash" />
                                <Text>Cancel</Text>
                            </Button>
                        </Container>
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
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
    },
    image: {
        flex: 1,
        marginTop: deviceHeight * 0.015,
        height: deviceWidth * 0.6,
        width: deviceWidth * 0.6,
        resizeMode: "contain",
        alignSelf: "center",
        backgroundColor: "#FFF9C4",
    },
    header: {
        backgroundColor: "#F77F00",
    },
    h1: {
        marginTop: deviceHeight * 0.008,
        fontSize: 30,
        textAlign: "center",
    },
    card: {
        margin: deviceHeight * 0.015,
        width: deviceWidth * 0.9,
        height: deviceHeight * 0.9,
        paddingBottom: deviceHeight * 0.015,
        backgroundColor: "#FFF9C4",
    },
    formContainer: {
        flex: 0.8,
        backgroundColor: "#FFF9C4",
    },
    lowerParts: {
        flex: 0.6,
        backgroundColor: "#FFF9C4",
    },
    button: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "center",
        marginTop: deviceHeight * 0.015,
        width: deviceWidth * 0.65,
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        alignItems: "center",
    },
    itemSwitch: {
        padding: deviceHeight * 0.015,
        backgroundColor: "#FFF9C4",
    },
    itemTextArea: {
        paddingRight: deviceWidth * 0.04,
        backgroundColor: "#FFF9C4",
    },
    textarea: {
        flex: 1,
        height: deviceHeight * 0.1,
        width: deviceWidth * 0.75,
        paddingRight: deviceWidth * 0.025,
        borderColor: "gray",
        borderWidth: 1,
        fontSize: 14,
        alignSelf: "center",
        backgroundColor: "#FFF9C4",
    },
});

export default NewAccount;
