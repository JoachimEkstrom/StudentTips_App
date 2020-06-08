import React, { component } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    FlatList,
    Modal,
    Image,
    TouchableHighlight,
} from "react-native";
import { useObserver } from "mobx-react-lite";
import store from "../store/store";
import { useEffect, useState } from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import * as Fetching from "../components/fetching";
import ImagePicker from "react-native-image-picker";

function MapScreen({ navigation }) {
    const followUserLocation = true;
    const followUserMode = "compass";
    const [MapPressed, setMapPressed] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [openModalVisible, setOpenModalVisible] = useState(false);
    const [PinTitle, setPinTitle] = useState("");
    const [PinDescription, setPinDescription] = useState("");
    const [TagText, setTagText] = useState("");
    const [Tags, setTags] = useState([]);
    const [Images, setImages] = useState([]);
    const [DeleteButton, setDeleteButton] = useState(false);

    let modal = store.getModalinfo;
    let user = store.getCurrentUser;
    let pinImage;

    MapboxGL.setAccessToken(
        "pk.eyJ1IjoianN1bGFiIiwiYSI6ImNrYWY1bmplbjAxNDIyc3E4NmY5NzJzYjkifQ.PJ74G61aNg65BGB06Et3NA"
    );

    async function mapPressedFunc(event) {
        const { geometry } = event;

        setMapPressed({
            latitude: geometry.coordinates[1],
            longitude: geometry.coordinates[0],
        });
        setModalVisible(true);
    }
    function addtag() {
        setTags([...Tags, TagText]);
        setTagText("");
    }

    function saveNewPin() {
        user = store.getCurrentUser;

        let pin = new FormData();

        pin.append("pinTitle", PinTitle);
        pin.append("pinDescription", PinDescription);
        pin.append("pinImage", Images[0]);
        pin.append("pinTags", JSON.stringify(Tags));
        pin.append(
            "pinCoordinates",
            JSON.stringify({ x: MapPressed.longitude, y: MapPressed.latitude })
        );
        pin.append("pinUser", user.userId);

        Fetching.addPinToDb(pin);

        setPinTitle("");
        setPinDescription("");
        setTags([]);
        setTagText("");
        setImages([]);
        console.log("Saving pin");
    }

    function showDeleteButton() {
        if (DeleteButton) {
            return (
                <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#FF2222" }}
                    onPress={() => {
                        setOpenModalVisible(!openModalVisible);
                        let modal = store.modalinfo;
                        Fetching.deletePinInDb(modal.pinId);
                        store.deleteOneMapPin(modal.index);
                    }}
                >
                    <Text style={styles.textStyle}>Delete this modal</Text>
                </TouchableHighlight>
            );
        } else {
            return null;
        }
    }

    async function openPin(index) {
        let pin = store.getMapPins;
        pin = pin[index];
        pinImage = await Fetching.getPictures(pin);
        await store.saveModalInfo(pin, index);
        modal = store.getModalinfo;
        user = store.getCurrentUser;

        if (user.userId === modal.pinUser || user.isAdmin) {
            setDeleteButton(true);
        } else {
            setDeleteButton(false);
        }
        setOpenModalVisible(true);
    }

    function renderPins() {
        let renderPins = store.getMapPins;
        return renderPins.map((pin, index) => {
            return (
                <MapboxGL.PointAnnotation
                    key={index}
                    onSelected={() => openPin(index)}
                    coordinate={[
                        Number(pin.pinCoordinates.x),
                        Number(pin.pinCoordinates.y),
                    ]}
                    id={pin.pinTitle}
                >
                    {/* <MapboxGL.Callout title={pin.pinTitle} /> */}
                </MapboxGL.PointAnnotation>
            );
        });
    }

    function addImages() {
        ImagePicker.showImagePicker(
            { maxWidth: 500, maxHeight: 500 },
            (response) => {
                if (response.didCancel) {
                    return;
                }

                const image = {
                    uri: response.uri,
                    type: response.type,
                    name:
                        response.fileName ||
                        response.uri.substr(response.uri.lastIndexOf("/") + 1),
                };
                setImages([...Images, image]);
            }
        );
    }

    useEffect(() => {
        showDeleteButton();
    }, [DeleteButton]);

    return useObserver(() => (
        <View style={styles.page}>
            <Text>Maps!!</Text>

            <View style={styles.container}>
                <MapboxGL.MapView
                    onPress={mapPressedFunc}
                    style={styles.map}
                    preferredFramesPerSecond={10}
                >
                    <MapboxGL.Camera
                        followUserLocation={followUserLocation}
                        followUserMode={followUserMode}
                    />
                    {renderPins()}

                    <MapboxGL.UserLocation visible={true} />
                </MapboxGL.MapView>
            </View>
            {/* Create new Pin Modal  */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            Add new Location Pin!
                        </Text>

                        {/* PinTitle */}
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

                        {/* PinDescription */}
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

                        {/* tags */}

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
                                    addtag();
                                }}
                            >
                                <Text style={styles.textStyle}>Add tag</Text>
                            </TouchableHighlight>
                        </View>
                        {/* display tags */}
                        <View style={styles.flatlist}>
                            <FlatList
                                data={Tags}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text>{item}</Text>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            ></FlatList>
                        </View>

                        {/* Add picutures */}
                        <View>
                            <TouchableHighlight
                                style={{
                                    ...styles.openButton,
                                    backgroundColor: "#2196F3",
                                }}
                                onPress={() => {
                                    addImages();
                                }}
                            >
                                <Text style={styles.textStyle}>
                                    Add Pictures
                                </Text>
                            </TouchableHighlight>
                        </View>
                        <TouchableHighlight
                            style={{
                                ...styles.openButton,
                                backgroundColor: "#2196F3",
                            }}
                            onPress={() => {
                                saveNewPin();
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Save and close</Text>
                        </TouchableHighlight>

                        {/* Close modal */}
                        <TouchableHighlight
                            style={{
                                ...styles.openButton,
                                backgroundColor: "#2196F3",
                            }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>
                                Close without save
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>

            {/* Open the modal clicked on */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={openModalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            Title: {modal.pinTitle}
                        </Text>
                        <Text style={styles.modalText}>
                            Latitude: {modal.pinCoordinates.y}
                        </Text>
                        <Text style={styles.modalText}>
                            Longitude: {modal.pinCoordinates.x}
                        </Text>
                        <View style={styles.flatlist}>
                            <FlatList
                                data={modal.pinTags}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text>{item}</Text>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            ></FlatList>
                        </View>
                        {/* render images */}
                        <View>
                            <Image
                                source={{ uri: pinImage, scale: 1 }}
                                style={styles.image}
                            ></Image>
                        </View>
                        {/* Close modal */}
                        <TouchableHighlight
                            style={{
                                ...styles.openButton,
                                backgroundColor: "#2196F3",
                            }}
                            onPress={() => {
                                setOpenModalVisible(!openModalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>close</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </View>
    ));
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    container: {
        height: 350,
        width: 350,
        backgroundColor: "tomato",
    },
    map: {
        flex: 1,
    },
    flatlist: {
        height: 100,
    },
    image: {
        height: 100,
        width: 100,
        resizeMode: "contain",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
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
});

export default MapScreen;
