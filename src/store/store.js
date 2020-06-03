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
        userName: "Berra",
        userId: 1,
        isAdmin: false,
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

// // Reaction
// reaction(() => {
//     return store.MapPins;
// });

export default store;

// import { extendObservable } from "mobx";

// class DataStorage {
//   constructor() {
//     extendObservable(this, {
//       MapPins: [
//         {
//           pinTitle: "test",
//           pinCoordinates: {
//             y: "57.69882110471608",
//             x: "11.977473309244896",
//           },
//           pinImage: "",
//           pinTags: ["Bazinga", "Testing"],
//           pinUser: 1,
//           pinDescription: "",
//           pinId: 1,
//         },
//       ],
//       currentUser: {
//         userName: "Berra",
//         userId: 1,
//         isAdmin: false,
//       },
//       modalinfo: {
//         pinTitle: "",
//         pinCoordinates: {
//           x: 0,
//           y: 0,
//         },
//         index: 0,
//         showDeleteButton: false,
//       },
//     });
//   }
// }

// export default new DataStorage();
