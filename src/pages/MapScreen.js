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

function MapScreen({ navigation }) {
  const followUserLocation = true;
  const followUserMode = "compass";
  let map;
  const [MapPressed, setMapPressed] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [openModalVisible, setOpenModalVisible] = useState(false);
  const [LocationName, setLocationName] = useState("");
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

  async function saveNewPin() {
    let pin = {
      title: LocationName,
      coords: {
        latitude: MapPressed.latitude,
        longitude: MapPressed.longitude,
      },
      image: "",
      tags: ["Bazinga", "Nevada"],
      addedByUserId: DataStorage.currentUser.userId,
    };

    DataStorage.MapPins.push(pin);
    setLocationName("");
    console.log("Saving pin");
    console.log(pin);
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
    console.log("Modal info");
    console.log(DataStorage.MapPins[index].addedByUserId);
    console.log("Current user info");
    console.log(DataStorage.currentUser.userId);
    if (
      DataStorage.currentUser.userId ===
      DataStorage.MapPins[index].addedByUserId
    ) {
      console.log("This is true");
      setDeleteButton(true);
    } else if (DataStorage.currentUser.isAdmin) {
      console.log("This is true");
      setDeleteButton(true);
    } else {
      console.log("This is false");
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
          coordinate={[pin.coords.longitude, pin.coords.latitude]}
          id={pin.title}
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
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              onChangeText={(text) => setLocationName(text)}
              value={LocationName}
            />

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
              Title: {DataStorage.modalinfo.title}
            </Text>
            <Text style={styles.modalText}>
              Latitude: {DataStorage.modalinfo.coords.latitude}
            </Text>
            <Text style={styles.modalText}>
              Longitude: {DataStorage.modalinfo.coords.longitude}
            </Text>
            <Text style={styles.modalText}>
              {/* User: {DataStorage.modalinfo.addedByUserId} */}
            </Text>
            {/* <FlatList
              data={DataStorage.modalinfo.tags}
              renderItem={({ tag }) => (
                <View>
                  <Text>{tag}</Text>
                </View>
              )}
            ></FlatList> */}

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
