import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Modal,
  TouchableHighlight,
} from "react-native";
import { observer } from "mobx-react";
import DataStorage from "../store/store";
import { useEffect, useState } from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import * as Fetching from "../components/fetching";

function MapScreen({ navigation }) {
  const followUserLocation = true;
  const followUserMode = "compass";
  let map;
  const [MapPressed, setMapPressed] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [openModalVisible, setOpenModalVisible] = useState(false);
  const [LocationName, setLocationName] = useState("");
  const [TagText, setTagText] = useState("");
  const [Tags, setTags] = useState([]);
  const [DeleteButton, setDeleteButton] = useState(false);

  MapboxGL.setAccessToken(
    "pk.eyJ1IjoianN1bGFiIiwiYSI6ImNrYWY1bmplbjAxNDIyc3E4NmY5NzJzYjkifQ.PJ74G61aNg65BGB06Et3NA"
  );

  async function mapPressedFunc(event) {
    const { geometry } = event;

    setMapPressed({
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
    });
    console.log(MapPressed);
    setModalVisible(true);
  }
  function addtag() {
    setTags([...Tags, TagText]);
    setTagText("");
    console.log(Tags);
  }

  function saveNewPin() {
    let x = String(MapPressed.longitude);
    let y = String(MapPressed.latitude);

    let pin = {
      pinCoordinates: {
        y: y,
        x: x,
      },
      pinDescription: "",
      pinImage: "",
      pinTags: Tags,
      pinTitle: LocationName,
      pinUser: DataStorage.currentUser.userId,
    };

    Fetching.addPinToDb(pin);
    DataStorage.MapPins.push(pin);
    setLocationName("");
    setTags([]);
    setTagText("");
    console.log("Saving pin");
    // console.log(pin);
  }

  function showDeleteButton() {
    if (DeleteButton) {
      return (
        <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: "#FF2222" }}
          onPress={() => {
            setOpenModalVisible(!openModalVisible);
            deleteMapPin(DataStorage.modalinfo.index);
          }}
        >
          <Text style={styles.textStyle}>Delete this modal</Text>
        </TouchableHighlight>
      );
    } else {
      return null;
    }
  }

  function openPin(index) {
    DataStorage.modalinfo = DataStorage.MapPins[index];
    DataStorage.modalinfo.index = index;

    if (
      DataStorage.currentUser.userId === DataStorage.MapPins[index].pinUser ||
      DataStorage.currentUser.isAdmin
    ) {
      setDeleteButton(true);
    } else {
      setDeleteButton(false);
    }
    console.log(DeleteButton);
    setOpenModalVisible(true);
  }

  function deleteMapPin(index) {
    console.log("Deleting a Pin");
    console.log(DataStorage.MapPins);

    DataStorage.MapPins.splice(index, 1);
    console.log(DataStorage.MapPins);
  }

  function renderPins() {
    return DataStorage.MapPins.map((pin, index) => {
      return (
        <MapboxGL.PointAnnotation
          key={index}
          onSelected={() => openPin(index)}
          coordinate={[pin.pinCoordinates.x, pin.pinCoordinates.y]}
          id={pin.pinTitle}
        ></MapboxGL.PointAnnotation>
      );
    });
  }

  useEffect(() => {
    showDeleteButton();
  }, [DeleteButton]);

  return (
    <View style={styles.page}>
      <Text>Maps!!</Text>

      <View style={styles.container}>
        <MapboxGL.MapView onPress={mapPressedFunc} style={styles.map}>
          <MapboxGL.Camera
            followUserLocation={followUserLocation}
            followUserMode={followUserMode}
          />
          {renderPins()}

          <MapboxGL.UserLocation visible={true} />
        </MapboxGL.MapView>
      </View>
      {/* Create new Pin Modal  */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add new Location Pin!</Text>

            {/* Location name */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ fontSize: 20, textAlign: "center" }}>Name: </Text>
              <TextInput
                style={{
                  height: 40,
                  width: 80,
                  borderColor: "gray",
                  borderWidth: 1,
                  fontSize: 16,
                }}
                onChangeText={(text) => setLocationName(text)}
                value={LocationName}
              />
            </View>

            {/* tags */}

            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ fontSize: 20, textAlign: "center" }}>Tags: </Text>
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
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
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
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                saveNewPin();
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Save and close</Text>
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
              Title: {DataStorage.modalinfo.pinTitle}
            </Text>
            <Text style={styles.modalText}>
              Latitude: {DataStorage.modalinfo.pinCoordinates.y}
            </Text>
            <Text style={styles.modalText}>
              Longitude: {DataStorage.modalinfo.pinCoordinates.x}
            </Text>
            <Text style={styles.modalText}>
              {/* User: {DataStorage.modalinfo.addedByUserId} */}
            </Text>
            <View style={styles.flatlist}>
              <FlatList
                data={DataStorage.modalinfo.pinTags}
                renderItem={({ item }) => (
                  <View>
                    <Text>{item}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              ></FlatList>
            </View>
            {/* Close modal */}
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setOpenModalVisible(!openModalVisible);
              }}
            >
              <Text style={styles.textStyle}>close</Text>
            </TouchableHighlight>

            {/* Delete modal  */}

            {showDeleteButton()}
          </View>
        </View>
      </Modal>
    </View>
  );
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

export default observer(MapScreen);
