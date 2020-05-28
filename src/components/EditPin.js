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
import { observer } from "mobx-react";
import DataStorage from "../store/store";
import { useEffect, useState } from "react";
import * as Fetching from "../components/fetching";
import * as Functions from "../components/Functions";

function EditPin(props) {
  const [PinTitle, setPinTitle] = useState("");
  const [PinDescription, setPinDescription] = useState("");
  const [TagText, setTagText] = useState("");
  const [Tags, setTags] = useState([]);
  const [openModalVisible, setOpenModalVisible] = useState(false);
  const [DeleteButton, setDeleteButton] = useState(false);

  let thisPin = DataStorage.MapPins[props.pinIndex];
  useEffect(() => {
    setPinTitle(thisPin.pinTitle);
  }, []);

  function UpdatePin() {
    let pin = {
      pinCoordinates: {
        y: String(MapPressed.latitude),
        x: String(MapPressed.longitude),
      },
      pinDescription: PinDescription,
      pinImage: "",
      pinTags: Tags,
      pinTitle: PinTitle,
      pinUser: DataStorage.currentUser.userId,
    };

    Fetching.addPinToDb(pin);
    DataStorage.MapPins.push(pin);
    setPinTitle("");
    setPinDescription("");
    setTags([]);
    setTagText("");
    setOpenModalVisible(!openModalVisible);
  }

  return (
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
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ fontSize: 20, textAlign: "center" }}>Title: </Text>
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

            <Text style={styles.modalText}>
              Latitude: {thisPin.pinCoordinates.y}
            </Text>
            <Text style={styles.modalText}>
              Longitude: {thisPin.pinCoordinates.x}
            </Text>
            <View style={styles.flatlist}>
              <FlatList
                data={thisPin.pinTags}
                renderItem={({ item }) => (
                  <View>
                    <Text>{item}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              ></FlatList>
            </View>
            {/* Update pin */}
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                // UpdatePin();
              }}
            >
              <Text style={styles.textStyle}>Update pin</Text>
            </TouchableHighlight>
            {/* Close modal */}
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setOpenModalVisible(!openModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Discard changes and close</Text>
            </TouchableHighlight>

            {/* Delete pin  */}
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#FF2222" }}
              onPress={() => {
                setOpenModalVisible(!openModalVisible);
                Functions.deleteMapPin(props.pinIndex, thisPin.pinId);
              }}
            >
              <Text style={styles.textStyle}>Delete this pin</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
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

export default observer(EditPin);
