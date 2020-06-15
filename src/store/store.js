import { observable, reaction } from "mobx";

const store = observable({
    // Derivations
    get getMapPins() {
        return store.MapPins;
    },
    get getModalinfo() {
        return store.modalinfo;
    },
    get getCurrentUser() {
        return store.currentUser;
    },
    // Actions

    saveMapPins(pins) {
        store.MapPins = pins;
    },
    addOneMapPin(pin) {
        store.MapPins.push(pin);
    },
    deleteOneMapPin(index) {
        store.MapPins.splice(index, 1);
    },
    saveModalInfo(pin, index) {
        store.modalinfo = pin;
        store.modalinfo.index = index;
    },
    saveModalImage(image) {
        store.modalinfo.pinImage = image;
    },
    userLoggedIn(user) {
        store.currentUser = user;
    },
    userLoggedOut(user) {
        store.currentUser = user;
    },
    // Data
    MapPins: [
        {
            pinTitle: "test",
            pinCoordinates: {
                y: "57.69882110471608",
                x: "11.977473309244896",
            },
            pinImage: "",
            pinTags: ["Bazinga", "Testing"],
            pinUser: 1,
            pinDescription: "",
            pinId: 1,
        },
    ],
    currentUser: {
        userName: "",
        token: "",
        userId: "",
        userImage: null,
    },
    modalinfo: {
        pinTitle: "",
        pinCoordinates: {
            x: 0,
            y: 0,
        },
        pinImage: "",
        pinTags: ["", ""],
        pinUser: 1,
        pinDescription: "",
        pinId: 1,
        index: 0,
    },
});

export default store;
