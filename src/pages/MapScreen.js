import React, { component } from "react";
import { StyleSheet, View, FlatList, Modal, Image, Dimensions, KeyboardAvoidingView } from "react-native";
import { Container, Button, Text, Input, Content, Form, Label, Item, Icon } from "native-base";
import { useObserver } from "mobx-react-lite";
import store from "../store/store";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
    const [PinImage, setPinImage] = useState(null);

    let modal = store.getModalinfo;
    let user = store.getCurrentUser;
    let renderPins = store.getMapPins;

    MapboxGL.setAccessToken("pk.eyJ1IjoianN1bGFiIiwiYSI6ImNrYWY1bmplbjAxNDIyc3E4NmY5NzJzYjkifQ.PJ74G61aNg65BGB06Et3NA");

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

    async function saveNewPin() {
        user = store.getCurrentUser;

        let pin = new FormData();

        pin.append("pinTitle", PinTitle);
        pin.append("pinDescription", PinDescription);
        pin.append("pinImage", PinImage);
        pin.append("pinTags", JSON.stringify(Tags));
        pin.append("pinCoordinates", JSON.stringify({ x: MapPressed.longitude, y: MapPressed.latitude }));

        await Fetching.addPinToDb(pin, user.token);

        setPinTitle("");
        setPinDescription("");
        setTags([]);
        setTagText("");
        setPinImage(null);
        console.log("Saving pin");
    }

    async function openPin(index) {
        let pin = store.getMapPins;
        pin = JSON.parse(JSON.stringify(pin[index]));
        await store.saveModalInfo(pin, index);
        modal = store.getModalinfo;
        user = store.getCurrentUser;

        setOpenModalVisible(true);
    }

    function closeModal() {
        setModalVisible(!modalVisible);
        setPinTitle("");
        setPinDescription("");
        setTags([]);
        setTagText("");
        setPinImage(null);
    }

    function renderThePins() {
        renderPins = store.getMapPins;
        return renderPins.map((pin, index) => {
            return (
                <MapboxGL.PointAnnotation
                    key={index}
                    onSelected={() => openPin(index)}
                    coordinate={[Number(pin.pinCoordinates.x), Number(pin.pinCoordinates.y)]}
                    id={pin.pinTitle}
                ></MapboxGL.PointAnnotation>
            );
        });
    }

    function addImages() {
        ImagePicker.showImagePicker({ maxWidth: 500, maxHeight: 500 }, (response) => {
            if (response.didCancel) {
                return;
            }

            const image = {
                uri: response.uri,
                type: response.type,
                name: response.fileName || response.uri.substr(response.uri.lastIndexOf("/") + 1),
            };
            setPinImage(image);
        });
    }
    useFocusEffect(() => {
        renderThePins();
    });

    useEffect(() => {
        renderThePins();
    }, [openModalVisible, modalVisible]);

    return useObserver(() => (
        <View style={styles.page}>
            <View style={styles.container}>
                <MapboxGL.MapView onPress={mapPressedFunc} style={styles.map} preferredFramesPerSecond={10}>
                    <MapboxGL.Camera followUserLocation={followUserLocation} followUserMode={followUserMode} />
                    {renderThePins()}

                    <MapboxGL.UserLocation visible={true} />
                </MapboxGL.MapView>
            </View>
            {/* Create new Pin Modal  */}
            <KeyboardAvoidingView behaviour="position" enabled={true}>
                <Modal animationType="slide" transparent={true} visible={modalVisible}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Add new Location Pin!</Text>

                            <Form style={styles.form}>
                                <Item fixedLabel>
                                    <Label style={styles.lable}>Title:</Label>
                                    <Input onChangeText={(text) => setPinTitle(text)} value={PinTitle} />
                                </Item>
                                <Item fixedLabel>
                                    <Label style={styles.lable}>Description:</Label>
                                    <Input onChangeText={(text) => setPinDescription(text)} value={PinDescription} />
                                </Item>
                            </Form>
                            {/* tags */}

                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                }}
                            >
                                <Form style={styles.form}>
                                    <Item fixedLabel>
                                        <Label style={styles.taglable}>Tags:</Label>
                                        <Input
                                            style={styles.input}
                                            onChangeText={(text) => setTagText(text)}
                                            value={TagText}
                                        />
                                        <Button
                                            iconLeft
                                            rounded
                                            success
                                            style={styles.addTagButton}
                                            onPress={() => {
                                                addtag();
                                            }}
                                        >
                                            <Icon name="add" style={styles.tagIcon} />
                                        </Button>
                                    </Item>
                                </Form>
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

                            {/* render images */}
                            {PinImage !== null && (
                                <View>
                                    <Image
                                        source={{
                                            uri: PinImage.uri,
                                        }}
                                        style={styles.image}
                                    ></Image>
                                </View>
                            )}

                            {/* Add picutures */}
                            <View>
                                <Button
                                    iconLeft
                                    rounded
                                    info
                                    style={styles.buttons}
                                    onPress={() => {
                                        addImages();
                                    }}
                                >
                                    <Icon name="image" />
                                    <Text>Add picture</Text>
                                </Button>
                            </View>
                            <Button
                                iconLeft
                                rounded
                                success
                                style={styles.buttons}
                                onPress={() => {
                                    saveNewPin();
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Icon name="add" />
                                <Text>Save and close</Text>
                            </Button>

                            {/* Close modal */}
                            <Button
                                iconLeft
                                rounded
                                warning
                                style={styles.buttons}
                                onPress={() => {
                                    closeModal();
                                }}
                            >
                                <Icon name="arrow-back" />
                                <Text>Close without save</Text>
                            </Button>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>

            {/* Open the modal clicked on */}
            <Modal animationType="slide" transparent={true} visible={openModalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.showTagTitleText}>{modal.pinTitle}</Text>
                        <Text style={styles.showTagDescriptionText}>{modal.pinDescription}</Text>
                        <View style={styles.flatlist}>
                            <Text style={styles.showTagText}>Tags:</Text>
                            <FlatList
                                data={modal.pinTags}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text style={styles.showTagItemText}>{item}</Text>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            ></FlatList>
                        </View>
                        {/* render images */}
                        {modal.pinImage !== null && (
                            <View>
                                <Image
                                    source={{
                                        uri: modal.pinImage,
                                    }}
                                    style={styles.image}
                                ></Image>
                            </View>
                        )}
                        {/* Close modal */}
                        <Button
                            iconLeft
                            rounded
                            warning
                            style={styles.buttons}
                            onPress={() => {
                                setOpenModalVisible(!openModalVisible);
                            }}
                        >
                            <Icon name="arrow-back" />
                            <Text>Close</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    ));
}

// Screen area
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FCBF49",
    },
    container: {
        height: 700,
        width: 500,
        backgroundColor: "tomato",
        resizeMode: "contain",
    },
    map: {
        flex: 1,
    },
    form: {
        flex: 1,
        width: 300,
        height: 100,
        marginBottom: 10,
        justifyContent: "center",
    },
    lable: {
        justifyContent: "center",
    },
    taglable: {
        flex: 0.2,
        width: 30,
        justifyContent: "center",
    },
    input: {
        width: 100,
        flex: 0.6,
    },
    flatlist: {
        height: 150,
        width: 200,
    },
    image: {
        height: 200,
        width: 200,
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
        justifyContent: "flex-start",
    },
    buttons: {
        marginBottom: 5,
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    addTagButton: {
        flex: 0.2,
        height: 30,
        width: 30,
        borderRadius: 20,
        padding: 0,
        marginRight: 5,
        marginBottom: 0,
        justifyContent: "center",
        alignSelf: "center",
    },
    tagIcon: {
        height: 30,
        width: 30,
        marginLeft: 15,
        marginTop: 5,
        justifyContent: "center",
        alignSelf: "center",
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
    showTagTitleText: {
        fontSize: 30,
        width: 200,
        marginBottom: 10,
        textAlign: "center",
    },
    showTagDescriptionText: {
        fontSize: 20,
        width: 200,
        marginBottom: 20,
        textAlign: "center",
    },
    showTagText: {
        fontSize: 18,
        width: 200,
        marginBottom: 10,
        textAlign: "center",
    },
    showTagItemText: {
        fontSize: 16,
        width: 200,
        marginBottom: 5,
        textAlign: "center",
    },
});

export default MapScreen;
