import React from "react";
import {
    StyleSheet,
    TextInput,
    View,
    FlatList,
    Modal,
    Image,
    TouchableHighlight,
    Dimensions,
    KeyboardAvoidingView,
} from "react-native";
import {
    Container,
    Button,
    Text,
    Card,
    Input,
    Content,
    Form,
    Label,
    Header,
    Item,
    Icon,
    Textarea,
    List,
    ListItem,
} from "native-base";
import { useObserver } from "mobx-react-lite";
import store from "../store/store";
import { useEffect, useState } from "react";
import * as Fetching from "../components/fetching";
import ImagePicker from "react-native-image-picker";

function EditPin(props) {
    const [PinTitle, setPinTitle] = useState("");
    const [PinDescription, setPinDescription] = useState("");
    const [TagText, setTagText] = useState("");
    const [Tags, setTags] = useState([]);
    const [openModalVisible, setOpenModalVisible] = useState(false);
    const [Img, setImg] = useState(null);
    const [updated, setupdated] = useState(false);

    let copyPin = store.getMapPins;
    copyPin = copyPin[props.pinIndex];
    let thisPin = JSON.parse(JSON.stringify(copyPin));
    let user = store.getCurrentUser;

    useEffect(() => {
        setPinTitle(thisPin.pinTitle);
        setPinDescription(thisPin.pinDescription);
        setTags(thisPin.pinTags);
        setImg(thisPin.pinImage);
    }, []);

    function UpdatePin() {
        let pin = new FormData();

        pin.append("pinTitle", PinTitle);
        pin.append("pinDescription", PinDescription);
        pin.append("pinImage", Img);
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

        Fetching.patchPinInDb(pin, thisPin.pinId, user.token);
        setOpenModalVisible(!openModalVisible);
    }

    function updateImage() {
        ImagePicker.showImagePicker({ maxWidth: 500, maxHeight: 500 }, (response) => {
            if (response.didCancel) {
                return;
            }

            const image = {
                uri: response.uri,
                type: response.type,
                name: response.fileName || response.uri.substr(response.uri.lastIndexOf("/") + 1),
            };

            setImg(image);
            setupdated(true);
        });
    }

    function closeModal() {
        setPinTitle(thisPin.pinTitle);
        setPinDescription(thisPin.pinDescription);
        setTags(copyPin.pinTags);
        setImg(null);
        setupdated(false);
        setOpenModalVisible(!openModalVisible);
    }

    function deletePin() {
        setPinTitle(thisPin.pinTitle);
        setPinDescription(thisPin.pinDescription);
        setTags(copyPin.pinTags);
        setImg(null);
        setupdated(false);
        Fetching.deletePinInDb(thisPin.pinId, user.token);
        store.deleteOneMapPin(props.pinIndex);
        setOpenModalVisible(!openModalVisible);
    }

    return useObserver(() => (
        <View style={styles.container}>
            <Button
                iconLeft
                style={styles.button}
                rounded
                onPress={() => {
                    setOpenModalVisible(true);
                }}
            >
                <Icon name="menu" />
                <Text>Edit pin</Text>
            </Button>
            <Content keyboardShouldPersistTaps="never">
                <Modal animationType="slide" transparent={true} visible={openModalVisible} style={styles.modal}>
                    <View style={styles.centeredView}>
                        <Container style={styles.modalView}>
                            <Container style={styles.modalContent}>
                                <Form>
                                    <Item fixedLabel last>
                                        <Label>Title:</Label>
                                        <Input onChangeText={(text) => setPinTitle(text)} value={PinTitle} />
                                    </Item>
                                    <Item fixedLabel last>
                                        <Label>Description:</Label>
                                        <Input
                                            onChangeText={(text) => setPinDescription(text)}
                                            value={PinDescription}
                                        />
                                    </Item>
                                </Form>
                            </Container>
                            {/* Edit Tags */}
                            <Container style={styles.flatlistContainer}>
                                <FlatList
                                    style={styles.flatlist}
                                    data={Tags}
                                    extraData={Tags}
                                    renderItem={({ item }) => (
                                        <Container style={styles.listContainer}>
                                            <Text style={styles.tagText}>{item}</Text>
                                            <Button
                                                iconLeft
                                                rounded
                                                danger
                                                style={styles.tagButton}
                                                onPress={() => {
                                                    for (let i = 0; i < Tags.length; i++) {
                                                        if (item == Tags[i]) {
                                                            Tags.splice(i, 1);
                                                            setTags(JSON.parse(JSON.stringify(Tags)));
                                                        }
                                                    }
                                                }}
                                            >
                                                <Icon name="trash" style={styles.tagIcon} />
                                            </Button>
                                        </Container>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                ></FlatList>
                            </Container>
                            <Container style={styles.addTag}>
                                <Form style={styles.addTagForm}>
                                    <Item fixedLabel last style={styles.addTagItem}>
                                        <Label style={styles.addTagLable}>Add tag:</Label>
                                        <Input
                                            style={styles.addTagInput}
                                            onChangeText={(text) => setTagText(text)}
                                            value={TagText}
                                        />
                                    </Item>
                                </Form>
                                <Button
                                    iconLeft
                                    rounded
                                    success
                                    style={styles.addTagButton}
                                    onPress={() => {
                                        setTags([...Tags, TagText]);
                                        setTagText("");
                                    }}
                                >
                                    <Icon name="add" style={styles.tagIcon} />
                                </Button>
                            </Container>

                            <Container style={styles.lowerParts}>
                                {(thisPin.pinImage !== null || updated === true) && (
                                    <>
                                        <Container style={styles.imageContainer}>
                                            {updated === false && (
                                                <Image
                                                    source={{
                                                        uri: thisPin.pinImage,
                                                    }}
                                                    style={styles.image}
                                                ></Image>
                                            )}
                                            {updated === true && (
                                                <Image
                                                    source={{
                                                        uri: Img.uri,
                                                    }}
                                                    style={styles.image}
                                                ></Image>
                                            )}
                                        </Container>
                                        <Button
                                            iconLeft
                                            rounded
                                            info
                                            style={styles.buttons}
                                            onPress={() => {
                                                updateImage();
                                            }}
                                        >
                                            <Icon name="image" />
                                            <Text>Change picture</Text>
                                        </Button>
                                    </>
                                )}
                                {/* if no picture add one. */}
                                {thisPin.pinImage === null && updated === false && (
                                    <>
                                        <Container style={styles.imageContainer}>
                                            {updated === true && (
                                                <Image
                                                    source={{
                                                        uri: Img.uri,
                                                    }}
                                                    style={styles.image}
                                                ></Image>
                                            )}
                                        </Container>
                                        <Button
                                            iconLeft
                                            rounded
                                            info
                                            style={styles.buttons}
                                            onPress={() => {
                                                updateImage();
                                            }}
                                        >
                                            <Icon name="image" />
                                            <Text>Add picture</Text>
                                        </Button>
                                    </>
                                )}

                                {/* Update pin */}
                                <Button
                                    iconLeft
                                    rounded
                                    style={styles.buttons}
                                    onPress={() => {
                                        UpdatePin();
                                    }}
                                >
                                    <Icon name="settings" />
                                    <Text>Update pin</Text>
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
                                    <Text>Discard changes and close</Text>
                                </Button>
                                {/* Delete pin  */}
                                <Button
                                    iconLeft
                                    rounded
                                    danger
                                    style={styles.buttons}
                                    onPress={() => {
                                        deletePin();
                                    }}
                                >
                                    <Icon name="trash" />
                                    <Text>Delete this pin</Text>
                                </Button>
                            </Container>
                        </Container>
                    </View>
                </Modal>
            </Content>
        </View>
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
        height: 50,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
    },

    modalView: {
        flex: 1,
        flexDirection: "column",
        height: deviceHeight * 0.95,
        width: deviceWidth * 0.95,
        margin: 10,
        backgroundColor: "#FFF9C4",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 20,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalContent: {
        flex: 0.3,
        height: 30,
        width: 330,
        backgroundColor: "#FFF9C4",
    },
    flatlistContainer: {
        marginTop: 10,
        flex: 0.3,
        height: 20,
        width: 330,
        flexDirection: "column",
        justifyContent: "center",
        alignSelf: "stretch",
    },
    flatlist: {
        flex: 1,
        height: 30,
        width: 330,
        backgroundColor: "#FFF9C4",
    },
    listContainer: {
        flex: 0.1,
        height: 30,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF9C4",
    },
    tagText: {
        flex: 0.8,
        fontSize: 17,
        height: 30,
        marginLeft: 23,
        textAlign: "center",
    },
    tagButton: {
        flex: 0.2,
        height: 30,
        width: 30,
        borderRadius: 20,
        padding: 0,
        marginRight: 5,
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
    addTag: {
        marginTop: 10,
        flex: 0.1,
        height: 50,
        width: 330,
        flexDirection: "row",
        backgroundColor: "#FFF9C4",
    },
    addTagForm: {
        flex: 0.8,
        height: 50,
        width: 200,
    },
    addTagItem: {
        flex: 0.5,
        height: 50,
        width: 330,
        textAlign: "center",
        flexDirection: "row",
    },
    addTagLable: {
        flex: 0.25,
        height: 30,
        width: 40,
    },
    addTagInput: {
        flex: 0.75,
        height: 50,
        width: 120,
        fontSize: 20,
    },
    addTagButton: {
        flex: 0.2,
        height: 30,
        width: 30,
        borderRadius: 20,
        padding: 0,
        marginRight: 5,
        marginBottom: 20,
        justifyContent: "center",
        alignSelf: "center",
    },
    lowerParts: {
        flex: 0.5,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#FFF9C4",
    },
    imageContainer: {
        flex: 1,
        height: 180,
        width: 180,
    },
    image: {
        flex: 1,
        height: 200,
        width: 200,
        resizeMode: "contain",
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: "#FFF9C4",
    },
    buttons: {
        marginTop: 5,
        flex: 0.8,
        justifyContent: "center",
        alignSelf: "center",
        width: 300,
    },
    button: {
        backgroundColor: "#1976D2",
    },
});

export default EditPin;
