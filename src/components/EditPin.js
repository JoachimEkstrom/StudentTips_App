import React from "react";
import {
    StyleSheet,
    Text,
    Button,
    TextInput,
    View,
    FlatList,
    Modal,
    TouchableHighlight,
} from "react-native";
import { useObserver } from "mobx-react-lite";
import store from "../store/store";
import { useEffect, useState } from "react";
import * as Fetching from "../components/fetching";
// import * as Functions from "../components/Functions";

function EditPin(props) {
    const [PinTitle, setPinTitle] = useState("");
    const [PinDescription, setPinDescription] = useState("");
    const [TagText, setTagText] = useState("");
    const [Tags, setTags] = useState([]);
    const [openModalVisible, setOpenModalVisible] = useState(false);

    let copyPin = store.getMapPins;
    copyPin = copyPin[props.pinIndex];
    let thisPin = JSON.parse(JSON.stringify(copyPin));
    let user = store.getCurrentUser;

    useEffect(() => {
        setPinTitle(thisPin.pinTitle);
        setPinDescription(thisPin.pinDescription);
        setTags(thisPin.pinTags);
    }, []);

    function UpdatePin() {
        let pin = new FormData();

        pin.append("pinTitle", PinTitle);
        pin.append("pinDescription", PinDescription);
        pin.append("pinImage", "Bazinga");
        pin.append("pinTags", JSON.stringify(Tags));
        pin.append(
            "pinCoordinates",
            JSON.stringify({
                x: thisPin.pinCoordinates.x,
                y: thisPin.pinCoordinates.y,
            })
        );
        pin.append("pinUser", user.userId);
        pin.append("pinId", thisPin.pinId);

        Fetching.patchPinInDb(pin, thisPin.pinId);
        setOpenModalVisible(!openModalVisible);
    }

    return useObserver(() => (
        <View style={styles.container}>
            <Button
                title="Edit this pin"
                onPress={() => {
                    setOpenModalVisible(true);
                }}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={openModalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{ fontSize: 20, textAlign: "center" }}>
                                Title:{" "}
                            </Text>
                            <TextInput
                                style={{
                                    height: 40,
                                    width: 80,
                                    borderColor: "gray",
                                    borderWidth: 1,
                                    fontSize: 16,
                                }}
                                onChangeText={(text) => setPinTitle(text)}
                                value={PinTitle}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{ fontSize: 20, textAlign: "center" }}>
                                Description:{" "}
                            </Text>
                            <TextInput
                                style={{
                                    height: 40,
                                    width: 80,
                                    borderColor: "gray",
                                    borderWidth: 1,
                                    fontSize: 16,
                                }}
                                onChangeText={(text) => setPinDescription(text)}
                                value={PinDescription}
                            />
                        </View>
                        <Text style={styles.modalText}>
                            Latitude: {thisPin.pinCoordinates.y}
                        </Text>
                        <Text style={styles.modalText}>
                            Longitude: {thisPin.pinCoordinates.x}
                        </Text>

                        {/* Edit Tags */}
                        <View style={styles.flatlist}>
                            <FlatList
                                data={Tags}
                                extraData={Tags}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text>{item}</Text>
                                        <TouchableHighlight
                                            style={{
                                                ...styles.openButton,
                                                backgroundColor: "#2196F3",
                                            }}
                                            onPress={() => {
                                                for (
                                                    let i = 0;
                                                    i < Tags.length;
                                                    i++
                                                ) {
                                                    if (item == Tags[i]) {
                                                        Tags.splice(i, 1);

                                                        setTags(
                                                            JSON.parse(
                                                                JSON.stringify(
                                                                    Tags
                                                                )
                                                            )
                                                        );
                                                    }
                                                }
                                            }}
                                        >
                                            <Text style={styles.textStyle}>
                                                Delete tag
                                            </Text>
                                        </TouchableHighlight>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            ></FlatList>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{ fontSize: 20, textAlign: "center" }}>
                                Tags:{" "}
                            </Text>
                            <TextInput
                                style={{
                                    height: 40,
                                    width: 80,
                                    borderColor: "gray",
                                    borderWidth: 1,
                                    fontSize: 16,
                                }}
                                onChangeText={(text) => setTagText(text)}
                                value={TagText}
                            />
                            <TouchableHighlight
                                style={{
                                    ...styles.openButton,
                                    backgroundColor: "#2196F3",
                                }}
                                onPress={() => {
                                    setTags([...Tags, TagText]);
                                    setTagText("");
                                }}
                            >
                                <Text style={styles.textStyle}>Add tag</Text>
                            </TouchableHighlight>
                        </View>

                        {/* Update pin */}
                        <TouchableHighlight
                            style={{
                                ...styles.openButton,
                                backgroundColor: "#2196F3",
                            }}
                            onPress={() => {
                                UpdatePin();
                            }}
                        >
                            <Text style={styles.textStyle}>Update pin</Text>
                        </TouchableHighlight>
                        {/* Close modal */}
                        <TouchableHighlight
                            style={{
                                ...styles.openButton,
                                backgroundColor: "#2196F3",
                            }}
                            onPress={() => {
                                setPinTitle(thisPin.pinTitle);
                                setPinDescription(thisPin.pinDescription);
                                setTags(copyPin.pinTags);
                                setOpenModalVisible(!openModalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>
                                Discard changes and close
                            </Text>
                        </TouchableHighlight>

                        {/* Delete pin  */}
                        <TouchableHighlight
                            style={{
                                ...styles.openButton,
                                backgroundColor: "#FF2222",
                            }}
                            onPress={() => {
                                Fetching.deletePinInDb(thisPin.pinId);
                                store.deleteOneMapPin(props.pinIndex);
                                setOpenModalVisible(!openModalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>
                                Delete this pin
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </View>
    ));
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    flatlist: {
        height: 100,
    },
});

export default EditPin;
